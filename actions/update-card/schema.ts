import { z } from 'zod';

export const UpdateCard = z.object({
  boardId: z.string(),
  description: z.optional(
    z.string({
      required_error: "Descrição é obrigatório",
      invalid_type_error: "Descrição deve ser um texto",
    }).min(3, {
      message: "Descrição deve ter no mínimo 3 caracteres"
    }),
  ),
  title: z.optional(
    z.string({
      required_error: "Título é obrigatório",
      invalid_type_error: "Título deve ser um texto"
    }).min(3, {
      message: "Título deve ter no mínimo 3 caracteres"
    }),
  ),
  id: z.string()
})