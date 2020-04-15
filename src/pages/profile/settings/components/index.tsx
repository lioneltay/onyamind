import React from "react"
import { Text, TextProps } from "lib/components"

export const SectionTitle = (props: TextProps) => (
  <Text variant="h5" {...props} />
)

export const SubSectionTitle = (props: TextProps) => (
  <Text variant="h6" {...props} />
)
