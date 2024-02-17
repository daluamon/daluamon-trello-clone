"use server";

import { auth } from '@clerk/nextjs';
import { InputType, ReturnType } from './types';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { DeleteCard } from './schema';
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
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId
          }
        }
      }
    });

   } catch (error) {
    return {
      error: "Falha ao deletar o cartão!"
    }
   }

   revalidatePath(`/board/${boardId}`);
   return { data: card}
}

export const deleteCard = createSafeAction(DeleteCard, handler);