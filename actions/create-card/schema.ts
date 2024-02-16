import { z } from 'zod';

export const CreateCard = z.object({
  title: z.string({
    required_error: "Título é obrigatório",
    invalid_type_error: "Título deve ser um texto"
  }).min(3, {
    message: "Título deve ter no mínimo 3 caracteres"
  }),
  boardId: z.string(),
  listId: z.string(),
})