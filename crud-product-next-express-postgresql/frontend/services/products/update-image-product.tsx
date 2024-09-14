type Result = {
  error: boolean,
  message: string
}

export const updateImageProduct = async (productId: string, image: File): Promise<Result> => {
  const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/products/${productId}/images`;
  
  const form = new FormData()
  form.set("image", image)
  const response = await fetch(
    url, {
    method: 'PATCH',
    body: form
  })
  return {
    error: !response.ok,
    message: 'Image updated.'
  }
}