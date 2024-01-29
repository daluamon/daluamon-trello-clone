"use client"

import { createBoard } from "@/actions/create-board"
import { FormButton } from "./form-button";
import { useAction } from "@/hooks/use-action";
import { FormInput } from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-button";

export const Form = () => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log("Success!", data)
    },
    onError: (error) => {
      console.log("Error!", error)
    }
  })

  const onsubmit = (formData: FormData) => {
    const title = formData.get("title") as string;

    execute({ title })
  }

  return (
    <form action={onsubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput
          id="title"
          label="Título"
          errors={fieldErrors}
        />
      </div>
      <FormSubmit>
        Salvar
      </FormSubmit>
      </form>
  )
}

