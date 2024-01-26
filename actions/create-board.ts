"use server";

import { z } from "zod";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};

const CreateBoard = z.object({
    title: z.string().min(3, {
    message: "Titulo deve ter no mínimo 3 caracteres"
  })
});

export async function create(prevState: State, formData: FormData) {

  const validatedFields = CreateBoard.safeParse({
    title: formData.get("title"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erro ao criar o quadro"
    };
  }

  const { title } = validatedFields.data;

  try {
    await db.board.create({
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      message: "Erro ao criar o quadro"
    };
  }

  revalidatePath("http://localhost:3000/organization/org_2bN3X2da7O5A8MefPLdDG1oKRIH")
  redirect("http://localhost:3000/organization/org_2bN3X2da7O5A8MefPLdDG1oKRIH")
}