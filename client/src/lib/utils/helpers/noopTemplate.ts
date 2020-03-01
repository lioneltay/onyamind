export const noopTemplate = (
  strings: TemplateStringsArray,
  ...keys: any[]
): string => {
  const lastIndex = strings.length - 1
  return (
    strings.slice(0, lastIndex).reduce((p, s, i) => p + s + keys[i], "") +
    strings[lastIndex]
  )
}
