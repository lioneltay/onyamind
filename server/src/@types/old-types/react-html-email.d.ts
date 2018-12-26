declare module "react-html-email" {
  export const Email: React.ComponentType<{
    title: string
  }>

  export const Item: React.ComponentType<{
    align?: "center" | "left" | "right"
  }>

  export const Span: React.ComponentType<{
    fontSize: number | string
  }>

  export const A: React.ComponentType<{

  }>
  export const renderEmail: (node: React.ReactElement<any>) => string
}
