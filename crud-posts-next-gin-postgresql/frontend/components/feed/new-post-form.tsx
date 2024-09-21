import React from "react";

import { useForm } from "react-hook-form";

import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";

import { FeedContext, FeedContextType } from "@/contexts/feed-context";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@/components/shared/form/error-message";

const formSchema = z.object({
  description: z.string()
    .min(1, 'The description must be at least 1 character long.')
    .max(120, 'The description cannot exceed 120 characters.')
})

type Form = z.infer<typeof formSchema>

export const NewPostForm: React.FC = () => {
  const { handleInsertPost } = React.useContext(FeedContext) as FeedContextType

  const {
    register,
    handleSubmit,
    formState: { errors, },
    reset
  } = useForm<Form>({
    resolver: zodResolver(formSchema)
  })

  const onSubmitInsertPost = React.useCallback(async (data: Form) => {
    const insertWithSuccess = await handleInsertPost(data.description)
    if (insertWithSuccess) {
      reset({ description: '' })
    }
  }, [handleInsertPost, reset])

  return (
    <form className="flex flex-col gap-2 p-4"
      onSubmit={handleSubmit(onSubmitInsertPost)}>
      <Textarea
        className="max-h-[110px]"
        {...register('description')}
        placeholder="Type your text"
      />
      <div className="flex justify-end w-[100%]">
        <ErrorMessage className="ps-1 w-[100%]" message={errors.description?.message} />
        <Button type='submit' className="w-[20%] " >Post</Button>
      </div>
    </form>
  );
}
