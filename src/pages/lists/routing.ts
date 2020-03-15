import { slug } from "lib/utils"

export const listPageUrl = (listId?: ID) => {
  if (!listId) {
    return `/lists`
  }

  return `/lists/${slug(listId)}`
}
