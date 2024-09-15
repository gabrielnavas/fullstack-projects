import { FC, useCallback, useContext, useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import Image from "next/image";

import { useToast } from "@/hooks/use-toast";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { Product } from "@/services/products/product";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { TableContext } from "@/components/products/context/product-context";
import { TableContextType } from "@/components/products/context/types";

import { formSchema, FormSchemaType } from "@/components/products/form/form-schema";
import { Check, RotateCw, X } from "lucide-react";

import { downloadProductImage } from '@/services/products/download-product-image'
import { ScrollArea } from "@/components/ui/scroll-area";

interface IProductFormProps {
  productToUpdate?: Product | undefined
  afterSubmitOrCancel: () => void
  readonly: boolean
};

export const ProductForm: FC<IProductFormProps> = ({
  productToUpdate,
  afterSubmitOrCancel,
  readonly,
}) => {

  const [isReadOnly, setIsReadOnly] = useState(readonly)
  const { handleAddProduct, handleUpdateProduct } = useContext(TableContext) as TableContextType

  const [image, setImage] = useState<File | null>(null);

  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<FormSchemaType>({
    values: {
      description: productToUpdate ? productToUpdate.description : '',
      name: productToUpdate ? productToUpdate.name : '',
      price: productToUpdate ? productToUpdate.price : 100.00,
      quantity: productToUpdate ? productToUpdate.quantity : 10
    },
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    async function loadImage() {
      if (productToUpdate !== undefined) {
        const result = await downloadProductImage(productToUpdate.id)
        if (result.error) {
          toast({
            title: 'Oops!! attention!',
            description: result.message,
            variant: 'destructive',
            duration: 7000,
          })
        } else {
          setImage(result.image)
        }
      }
    }
    loadImage()
  }, [productToUpdate])

  const onClickSubmit = useCallback(async (data: FormSchemaType) => {
    let success = false
    if (productToUpdate !== undefined) {
      success = await handleUpdateProduct(productToUpdate.id, data, image)
    } else {
      success = await handleAddProduct(data, image)
    }
    if (success) {
      afterSubmitOrCancel();
    }
  }, [image])

  const description = productToUpdate !== undefined
    ? 'Update the product'
    : 'Create a new Product'

  const submitButtonText = productToUpdate !== undefined
    ? 'Update'
    : 'Add'

  const getUrlImage = useCallback((): string => {
    if (image !== null) {
      return URL.createObjectURL(image);
    }
    return '';
  }, [image])

  return (
    <form onSubmit={handleSubmit(onClickSubmit)} className="flex justify-center">
      <ScrollArea className="w-[100%] h-[85vh] border-none border b-2 pr-3 mt-6">
        <DialogHeader className="mb-10">
          <DialogTitle>Product Form</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-y-4 px-1">
          {image && (
            <div className="min-w-[100px] max-w-[170px]">
              <Image
                alt="product image"
                width={250}
                height={250}
                src={getUrlImage()} />
            </div>
          )}
          {!isReadOnly && (
            <div className="flex flex-col justify-start gap-1 w-[100%]">
              <Label htmlFor="name">
                Load an new Image
              </Label>
              <Input
                type="file"
                onChange={e => {
                  if (e.target && e.target.files && e.target.files.length > 0) {
                    setImage(e.target.files[0]);
                  }
                }}
                className="col-span-3"
              />
            </div>
          )}
          <div className="flex flex-col justify-start gap-1 w-[100%]">
            <Label htmlFor="name">
              Name
            </Label>
            <Input
              disabled={isReadOnly}
              {...register('name')}
              placeholder="ex. Apple"
              className="col-span-3"
            />
            {errors.name && <Label className="mt-1 text-red-500">{errors.name.message}</Label>}
          </div>
          <div className="flex flex-col justify-start gap-1 w-[100%]">
            <Label htmlFor="description" className="text-start">
              Description
            </Label>
            <Textarea
              disabled={isReadOnly}
              {...register('description')}
              placeholder="Ex. Apple red"
              className="col-span-3 max-h-[200px] min-h-[200px]"
            />
            {errors.description && <Label className="mt-1 text-red-500">{errors.description.message}</Label>}
          </div>
          <div className="flex flex-col justify-start gap-1 w-[100%]">
            <Label htmlFor="price" className="text-start">
              Price
            </Label>
            <Input
              disabled={isReadOnly}
              {...register('price')}
              step=".01"
              type="number"
              placeholder="Ex. Apple red"
              className="col-span-3"
            />
            {errors.price && <Label className="mt-1 text-red-500">{errors.price.message}</Label>}
          </div>
          <div className="flex flex-col justify-start gap-1 w-[100%]">
            <Label htmlFor="quantity" className="text-start">
              Quantity
            </Label>
            <Input
              disabled={isReadOnly}
              {...register('quantity')}
              type="number"
              placeholder="Ex. 99.99"
              className="col-span-3"
            />
            {errors.quantity && <Label className="mt-1 text-red-500">{errors.quantity.message}</Label>}
          </div>

        </div>

        <DialogFooter className="flex flex-col gap-y-2 py-2 px-1">
          {isReadOnly && (
            <Button
              type="button"
              variant='outline'
              className="w-full"
              onClick={() => setIsReadOnly(false)}>
              <RotateCw color="yellow" />
              Do you want to update ?
            </Button>
          )}
          {!isReadOnly && (
            <Button type="submit" className="w-full" >
              <Check className="mx-1" />
              {submitButtonText}
            </Button>
          )}
          <Button 
            type="button" 
            className="w-full" 
            variant='outline' 
            onClick={afterSubmitOrCancel}>
            <X />
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>
        </DialogFooter>
      </ScrollArea>

    </form>
  );
}
