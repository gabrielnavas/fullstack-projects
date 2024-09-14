export const getOrganizationName = (): string => {
  return process.env.NEXT_PUBLIC_ORGANIZATION_NAME as string | 'Organization Name';
}

export const getOrganizationDescription = (): string => {
  return process.env.NEXT_PUBLIC_ORGANIZATION_DESCRIPTION_SHORT as string | 'Organization Description';
}