type Result = { 
  message: string
  error: boolean
};

const deleteProduct = async (productId: string): Promise<Result> => {
  const url = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/products/${productId}`;
  const result = await fetch(
    url, {
    method: 'DELETE'
  })

  const hasError = !result.ok

  return {
    error: hasError,
    message: hasError ? 'Contact the admin.' : 'Product deleted.',
  }
}

export default deleteProduct