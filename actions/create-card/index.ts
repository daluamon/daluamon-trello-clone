"use server";

import { auth } from '@clerk/nextjs';
import { InputType, ReturnType } from './types';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { CreateCard } from './schema';
import { createSafeAction } from '@/lib/create-safe-action';
import { createAuditLog } from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';


const handler = async (data: InputType): Promise<ReturnType> => {
  const {userId, orgId} = auth();

  if (!userId || !orgId) {
    return {
      error: "unauthorized",
    }
  }

  const { title, boardId, listId } = data;

  let card;
   try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        board: {
          orgId
        },
      },
    });

    if (!list) {
      return {
        error: "Lista não encontrada"
      }
    }

    const lastCard = await db.card.findFirst({
      where: {listId},
      orderBy: {order: "desc"},
      select: {order: true}
    });

    const newOrder = lastCard ? lastCard.order +1 : 1;

    card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder
      }
    });

    await createAuditLog({
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: card.title,
      action: ACTION.CREATE
    })

   } catch (error) {
    return {
      error: "Falha ao criar o cartão"
    }
   }

   revalidatePath(`/board/${boardId}`);
   return { data: card };
}

export const createCard = createSafeAction(CreateCard, handler);