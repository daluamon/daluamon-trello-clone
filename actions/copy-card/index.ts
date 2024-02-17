"use server";

import { auth } from '@clerk/nextjs';
import { InputType, ReturnType } from './types';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { CopyCard } from './schema';
import { createSafeAction } from '@/lib/create-safe-action';

const handler = async (data: InputType): Promise<ReturnType> => {
  const {userId, orgId} = auth();

  if (!userId || !orgId) {
    return {
      error: "unauthorized",
    }
  }

  const { id, boardId} = data;

  let card;
   try {
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId
          }
        }
      },
    });

    if (!cardToCopy) {
      return {
        error: "Card não encontrado"
      }
    }

    const lastCard = await db.card.findFirst({
      where: {
        listId: cardToCopy.listId,
      },
      orderBy: {
        order: "desc"
      },
      select: {
        order: true
      }
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Cópia`,
        description: cardToCopy.description,
        order: newOrder,
        listId: cardToCopy.listId,
      }
    })

   } catch (error) {
    return {
      error: "Falha ao copiar"
    }
   }

   revalidatePath(`/board/${boardId}`);
   return { data: card}
}

export const copyCard = createSafeAction(CopyCard, handler);