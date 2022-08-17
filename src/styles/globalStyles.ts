import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
   box-sizing: border-box;
   font-family: Montserrat, Open-Sans, Helvetica, Sans-Serif;
  }

  body {
    margin: 0;
    padding: 0;
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
