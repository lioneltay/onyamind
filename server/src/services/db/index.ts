import { getManager } from "typeorm"
import { noopTemplate } from "lib/string"

export function query(query_string: string, parameters?: any[]): Promise<any> {
  const manager = getManager()
  return manager.query(query_string, parameters)
}

export const sql = noopTemplate
