"use client"

import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { ElementRef, KeyboardEventHandler, forwardRef, useRef } from "react";
import FormSubmit from '../../../../../components/form/form-button';
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { createCard } from "@/actions/create-card";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";

interface CardFormProps{
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
  listId,
  isEditing,
  enableEditing,
  disableEditing
}, ref) => {

  const params = useParams();
  const formRef = useRef<ElementRef<"form">>(null);
  const { execute, fieldErrors } = useAction(createCard, {
    onSuccess: (data) => {
      toast.success(`Cartão "${data.title}" criado com sucesso!`);
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const onkeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  }

  useOnClickOutside(formRef, disableEditing);
  useEventListener("keydown", onkeyDown);

  const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const listId = formData.get("listId") as string;
    const boardId = params.boardId as string;

    execute({
      title,
      listId,
      boardId
    });
  }

  if(isEditing) {
    return (
      <form
        ref={formRef}
        action={onSubmit}
        className="m-1 py-0.5 px-1 space-y-4"
      >
        <FormTextarea
          id="title"
          onKeyDown={onTextareaKeyDown}
          ref={ref}
          placeholder="Digite o título do cartão"
        />
        <input
          hidden
          id="listId"
          name="listId"
          value={listId}
        />
        <div className="flex items-center gap-x-1">
          <FormSubmit>
            Adicionar Cartão
          </FormSubmit>
          <Button
            onClick={disableEditing}
            size="sm"
            variant="ghost"
          >
            <X className="w-5 h-5"/>
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="pt-2 px-2">
      <Button
        onClick={enableEditing}
        className="w-full px-2 py-1.5 justify-start text-muted-foreground text-sm"
        size="sm"
        variant="ghost"
      >
        <Plus className="w-4 h-4 mr-2"/>
        Adicionar um cartão
      </Button>
    </div>
  )
});

CardForm.displayName = 'CardForm';