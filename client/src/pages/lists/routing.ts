import { slug } from "lib/utils"

type ListPageUrlInput = {
  listId: ID
  listName: string
}
export const listPageUrl = (config: ListPageUrlInput) => {
  if (!config) {
    return slug(`/lists`)
  }

  return `/lists/${slug(config.listId)}/${slug(config.listName)}`
}
