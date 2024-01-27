"use client"

import { createBoard } from "@/actions/create-board"
import { FormInput } from "./form-input";
import { FormButton } from "./form-button";
import { useAction } from "@/hooks/use-action";

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
          errors={fieldErrors}
        />
      </div>
      <FormButton />
      </form>
  )
}

