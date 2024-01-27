import { z } from "zod";

export const CreateBoard = z.object({
  title: z.string({
    required_error: "Titulo é obrigatório",
    invalid_type_error: "Titulo deve ser uma string",
  }).min(3, {
    message: "Titulo deve ter no mínimo 3 caracteres",
  }),
})