import { createGlobalStyle } from 'styled-components'
import MontserratBold from 'assets/fonts/Montserrat-Bold.ttf'
import MontserratMedium from 'assets/fonts/Montserrat-Medium.ttf'

export const GlobalStyle = createGlobalStyle`

  @font-face {
    font-family: "Montserrat";
    src: local("Montserrat"),
    url(${MontserratBold}) format("truetype");
    font-weight: 700;
  }

  @font-face {
    font-family: "Montserrat";
    src: local("Montserrat"),
    url(${MontserratMedium}) format("truetype");
    font-weight: 500;
  }

  * {
   box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: Montserrat, Open-Sans, Helvetica, Sans-Serif;
  }

  a {
    text-decoration: none;
  } 

  button{
    cursor: pointer;
  }
`
