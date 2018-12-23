import { CSSProperties } from "react"

declare global {
  export interface Stylable {
    className?: string
    style?: CSSProperties
  }

  type Omit<U, V> = Pick<U, Exclude<keyof U, V>>
}

export {}
