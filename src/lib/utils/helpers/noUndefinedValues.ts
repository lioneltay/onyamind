import { pickBy } from "ramda"

export const noUndefinedValues = pickBy((v, k) => v !== undefined)
