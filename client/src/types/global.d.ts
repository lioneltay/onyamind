import { CSSProperties } from "react"

declare global {
  export interface Stylable {
    className?: string
    style?: CSSProperties
  }
}

export {}
