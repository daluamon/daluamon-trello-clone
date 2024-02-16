"use server";

import { auth } from '@clerk/nextjs';
import { InputType, ReturnType } from './types';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { CopyList } from './schema';
import { createSafeAction } from '@/lib/create-safe-action';

const handler = async (data: InputType): Promise<ReturnType> => {
  const {userId, orgId} = auth();

  if (!userId || !orgId) {
    return {
      error: "unauthorized",
    }
  }

  const { id, boardId} = data;

  let list;
   try {
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          orgId
        }
      },
      include: {
        cards: true
      }
    });

    if (!listToCopy) {
      return {
        error: "Lista não encontrada"
      }
    }

    const lastList = await db.list.findFirst({
      where: {boardId},
      orderBy: {order: 'desc'},
      select: {order: true}
    });


    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} - Cópia`,
        order: newOrder,
        cards: {
          createMany: {
            data: listToCopy.cards.map((card) => ({
              title: card.title,
              order: card.order,
              description: card.description
            }))
          }
        },
      },
      include: {
        cards: true
      },
    })


   } catch (error) {
    return {
      error: "Falha ao copiar"
    }
   }

   revalidatePath(`/board/${boardId}`);
   return { data: list}
}

export const copyList = createSafeAction(CopyList, handler);