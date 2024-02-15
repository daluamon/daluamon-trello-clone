"use client";

import { Plus, X } from 'lucide-react';
import { ListWrapper } from "./list-wrapper";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useParams, useRouter } from "next/navigation";
import FormSubmit from "@/components/form/form-button";
import { Button } from "@/components/ui/button";
import { useAction } from '@/hooks/use-action';
import { toast } from 'sonner';
import { createList } from '@/actions/create-list';

export const ListForm = () => {
  const router = useRouter();
  const params = useParams();

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    })
  }

  const disableEditing = () => {
    setIsEditing(false);
  }

  const { execute, fieldErrors  } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`Lista "${data.title}" criada com sucesso!`);
      disableEditing();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      disableEditing();
    };
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;

    execute({
      title,
      boardId
    });
  }

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          action={onSubmit}
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <FormInput
            ref={inputRef}
            errors={fieldErrors}
            id="title"
            placeholder="Entre com o Título da lista"
            className="text-sm px-2 py-1 font-medium border-transparent hover:border-input focus:border-input transition"
          />
          <input
            hidden
            value={params.boardId}
            name="boardId"
          />

          <div className="flex items-center gap-x-1">
            <FormSubmit>
              Adicionar lista
            </FormSubmit>
            <Button
              onClick={disableEditing}
              size="sm"
              variant="ghost"
            >
              <X className='w-5 h-5'/>
            </Button>

          </div>
        </form>
      </ListWrapper>
    )
  }
  
  return (
    <ListWrapper>
     <button
      onClick={enableEditing}
      className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
     >
      <Plus className="h-4 w-4 mr-2"/>
      Adicionar lista
     </button>
    </ListWrapper>
  )
}