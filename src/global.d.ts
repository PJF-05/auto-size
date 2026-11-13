declare module 'vue' {
  interface ComponentCustomProperties {
    $px2rem: (px: string | number) => string
  }
}

export { }