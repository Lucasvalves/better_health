export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14)
}

export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1)$2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
    .substring(0, 15)
}

export const maskCRM = (value: string) => {
  return value
    .replace(/\D/g, '') 
    .substring(0, 6)
}
