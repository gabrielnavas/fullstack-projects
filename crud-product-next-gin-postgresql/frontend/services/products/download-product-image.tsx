import { humanizeMessage } from "@/utils/string"

type Result = {
  image: File | null
  error: boolean
  message: string
}

export const downloadProductImage = async (productId: string): Promise<Result> => {
  const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/products/${productId}/images`;
  const result = await fetch(url)

  if (!result.ok) {
    const data = await result.json()
    return {
      image: null,
      error: false,
      message: data.message ? humanizeMessage(data.message) : 'Error on load image! Call the admin.'
    }
  }

  const blob = await result.blob();
  if (!blob || blob.size === 0) {
    return {
      image: null,
      error: false,
      message: 'Error on load image! Call the admin.'
    }
  }
  const file = new File([blob], "image");
  return {
    image: file,
    error: false,
    message: 'Image loaded.'
  }
}