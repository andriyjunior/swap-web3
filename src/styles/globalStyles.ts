import { createGlobalStyle } from 'styled-components'

import MontserratBold from 'assets/fonts/Montserrat-Bold.ttf'
import MontserratSemiBold from 'assets/fonts/Montserrat-SemiBold.ttf'
import MontserratMedium from 'assets/fonts/Montserrat-Medium.ttf'
import MontserratLight from 'assets/fonts/Montserrat-Light.ttf'

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
    url(${MontserratSemiBold}) format("truetype");
    font-weight: 600;
  }

  @font-face {
    font-family: "Montserrat";
    src: local("Montserrat"),
    url(${MontserratMedium}) format("truetype");
    font-weight: 500;
  }

  @font-face {
    font-family: "Montserrat";
    src: local("Montserrat"),
    url(${MontserratLight}) format("truetype");
    font-weight: 400;
  }

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
