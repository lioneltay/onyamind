import styled, { createGlobalStyle } from "styled-components"

import flex from "./flex"
import font from "./font"
import interaction from "./interaction"
import resets from "./resets"
import size from "./size"
import spacing from "./spacing"
import text from "./text"
import widgets from "./widgets"
import accessibility from "./accessibility"

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Roboto", "Helvetica", "Arial", "sans-serif";
  }

  html, body, .app {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    overscroll-behavior-y: none;
  }

  ${flex}
  ${font}
  ${interaction}
  ${resets}
  ${size}
  ${spacing}
  ${text}
  ${widgets}
  ${accessibility}
`
