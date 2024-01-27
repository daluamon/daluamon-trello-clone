"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";


const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Você não está logado"
    };
  }

  const { title } = data;
  let board;

  try {
    board = await db.board.create({
      data: {
        title,
      },
    })
  } catch (error) {
    return {
      error: "Erro ao criar o quadro"
    };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);

