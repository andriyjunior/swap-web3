export const colors = {
  white: '#ffffff',
  black: '#000000',
  cyan: '#00FFF0',
  purple: '#BD00FF',
  orange: '#FF8700',
  yellow: 'FFF500',
}

export const gradients = {
  primary:
    'linear-gradient(90deg, #00FFF0 0%, #BD00FF 37.5%, #FF8700 68.23%, #FFF500 100%)',
  secondary: 'linear-gradient(90deg, #00FFF0 0%, #BD00FF 50%, #FF8700 100%)',
  bg: 'linear-gradient(180deg, rgba(247, 247, 247, 0) 11.59%, #F7F7F7 36.96%), linear-gradient(0deg, #D5D9FF, #D5D9FF), linear-gradient(90deg, #00FFF0 0%, #BD00FF 39.58%, #FF8700 69.79%, #FFF500 100%);',
}

export const shadows = {
  main: '0px 8px 12px 0px rgba(123, 43, 255, 0.05)',
  inner: ' 0px 4px 8px 0px rgba(123, 43, 255, 0.05) inset',
  onFocus:
    '0px 0px 0px 2px rgba(0, 0, 0, 0.1), inset 0px 4px 8px rgba(123, 43, 255, 0.05);',
  logo: '0px 8px 12px rgba(123, 43, 255, 0.05)',
  violetSm: '0px 4px 8px rgba(123, 43, 255, 0.05)',
  violet: '0px 3px 1px rgba(55, 0, 143, 0.2)',
}

export const zIndexes = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
}

export const breakpoints = {
  xs: '0',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px',
}
