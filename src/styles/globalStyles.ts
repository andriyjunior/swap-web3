import { createGlobalStyle } from 'styled-components'
import { getTransparentColor } from './colorConverter'
import { colors } from './variables'

export const GlobalStyle = createGlobalStyle`
  * {
   box-sizing: border-box;
   font-family: Montserrat, Open-Sans, Helvetica, Sans-Serif;
  }

  body {
    margin: 0;
    padding: 0;

    &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: ${getTransparentColor(colors.black, 0.25)};
  }

  &::-webkit-scrollbar {
    width: 8px;
    background-color: ${getTransparentColor(colors.black, 0.25)};
    border-radius: 8px;
    }
  }

  input,
  textarea,
  button,
  select,
  a {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  a {
    text-decoration: none;
  }

  button{
    padding: 0;
    margin: 0;
    cursor: pointer;
  }
`
