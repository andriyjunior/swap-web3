export const colorConverter = {
  hexToRgba(hex: string, alpha: number) {
    const red = parseInt(hex[1] + hex[2], 16)
    const green = parseInt(hex[3] + hex[4], 16)
    const blue = parseInt(hex[5] + hex[6], 16)

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
  },
}

export const getTransparentColor = (color: string, opacity: number) => {
  return colorConverter.hexToRgba(color, opacity)
}
