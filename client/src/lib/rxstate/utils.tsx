import { useState } from 'react'

export const useForceUpdate = () => {
  const [, forceUpdate] = useState(null)
  return forceUpdate as () => void
}
