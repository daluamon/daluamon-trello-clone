"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteBoard(id: string) {
  await db.board.delete({
    where: {
      id,
    },
  });

  revalidatePath("http://localhost:3000/organization/org_2bN3X2da7O5A8MefPLdDG1oKRIH")
}