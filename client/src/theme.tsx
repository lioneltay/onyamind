import React, { createContext, useContext } from "react"
import baseStyled, { ThemedStyledInterface } from "styled-components"
import { ThemeProvider as SCThemeProvider } from "styled-components"
import red from "@material-ui/core/colors/red"

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { teal, blue } from "@material-ui/core/colors"

import { connect } from "services/state"

const getSCTheme = ({ dark }: ThemeProps) => {
  return {
    background_color: dark ? "#282828" : "#ffffff",
    background_faded_color: dark ? "#424242" : "#f9f9f9",
    highlighted_text_color: "#3A7AF2",
    highlight_color: dark ? "#002663" : "#E4EEFE",
    grey_text: "#6a6a6a",
    icon_color: dark ? "ffffff" : "#0000008a",
    error_color: red["500"],
  }
}

type ThemeProps = {
  dark: boolean
}

export const light_mui_theme = createMuiTheme({
  palette: {
    type: "light",
    primary: blue,
    secondary: teal,
  },
  overrides: {
    MuiToolbar: {
      root: {
        backgroundColor: getSCTheme({ dark: false }).background_color,
      },
    },
  },
})

export const dark_mui_theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue,
    secondary: teal,
  },
  overrides: {
    MuiToolbar: {
      root: {
        backgroundColor: getSCTheme({ dark: true }).background_color,
      },
    },
  },
})

export const getTheme = ({ dark }: ThemeProps) => {
  const mui_theme = dark ? dark_mui_theme : light_mui_theme
  return { ...getSCTheme({ dark }), mui: mui_theme }
}

export type Theme = ReturnType<typeof getTheme>

const ThemeContext = createContext<Theme>(getTheme({ dark: true }))

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FunctionComponent<ThemeProps> = ({
  children,
}) => {
  const theme = getTheme({ dark: true })
  return (
    <MuiThemeProvider theme={theme.mui}>
      <SCThemeProvider theme={theme}>
        <ThemeContext.Provider value={getTheme({ dark: true })}>
          {children as React.ReactElement<any>}
        </ThemeContext.Provider>
      </SCThemeProvider>
    </MuiThemeProvider>
  )
}

export const styled = baseStyled as ThemedStyledInterface<Theme>
