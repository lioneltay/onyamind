import React, { createContext, useContext } from "react"
import baseStyled, { ThemedStyledInterface } from "styled-components"
import { ThemeProvider as SCThemeProvider } from "styled-components"
import red from "@material-ui/core/colors/red"

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { teal, blue } from "@material-ui/core/colors"

import { useSelector, useActions } from "services/store"

const getSCTheme = ({ dark }: ThemeProps) => {
  return {
    backgroundColor: dark ? "#282828" : "#ffffff",
    backgroundFadedColor: dark ? "#424242" : "#f9f9f9",
    highlightedTextColor: "#3A7AF2",
    highlightColor: dark ? "#002663" : "#E4EEFE",
    greyText: "#6a6a6a",
    iconColor: dark ? "ffffff" : "#0000008a",
    errorColor: red["500"],
  }
}

type ThemeProps = {
  dark?: boolean
}

export const lightMuiTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: blue,
    secondary: teal,
  },
  overrides: {
    MuiToolbar: {
      root: {
        backgroundColor: getSCTheme({ dark: false }).backgroundColor,
      },
    },
  },
})

export const darkMuiTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue,
    secondary: teal,
  },
  overrides: {
    MuiToolbar: {
      root: {
        backgroundColor: getSCTheme({ dark: true }).backgroundColor,
      },
    },
  },
})

export const createTheme = ({ dark }: ThemeProps) => {
  const muiTheme = dark ? darkMuiTheme : lightMuiTheme
  return { ...getSCTheme({ dark }), mui: muiTheme }
}

export type Theme = ReturnType<typeof createTheme>

const ThemeContext = createContext<Theme>(createTheme({ dark: true }))

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FunctionComponent<ThemeProps> = ({
  children,
}) => {
  const dark = useSelector((state) => state.settings.darkMode)
  const theme = createTheme({ dark })

  return (
    <MuiThemeProvider theme={theme.mui}>
      <SCThemeProvider theme={theme}>
        <ThemeContext.Provider value={theme}>
          {children as React.ReactElement<any>}
        </ThemeContext.Provider>
      </SCThemeProvider>
    </MuiThemeProvider>
  )
}

export const styled = baseStyled as ThemedStyledInterface<Theme>
