import 'styled-components/native'

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      common: {
        black: string
        white: string
        lightGray: string
        darkGray: string
        blue: string
        darkBlue: string
        gray6: string
        gray1: string
      }
      home: string
      primary: string
      primaryButton: string
      placeholderTextColor: string
      unfocusedBackground: string
      error: string
      accentColor: string
      accentBackground: string
    }
  }
}
