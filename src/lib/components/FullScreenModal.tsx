import React from "react"
import { noopTemplate as css } from "lib/utils"
import PlainModal, { PlainModalProps } from "./PlainModal"
import { ArrowBackIcon } from "lib/icons"
import { IconButton } from "@material-ui/core"
import Text from "./Text"

export type FullScreenModalProps = PlainModalProps & {
  title?: string
  closeIcon?: React.ReactNode
  secondaryAction?: React.ReactNode
}

const FullScreenModal = ({
  title,
  children,
  closeIcon = <ArrowBackIcon />,
  secondaryAction,
  onClose,
  ...rest
}: FullScreenModalProps) => {
  return (
    <PlainModal
      css={css`
        min-height: 100vh;
        width: 100vw;
      `}
      {...rest}
      onClose={onClose}
    >
      <div className="fj-sb fa-c">
        <div className="fa-c">
          <IconButton onClick={onClose}>{closeIcon}</IconButton>

          <Text>{title}</Text>
        </div>

        {secondaryAction}
      </div>

      {children}
    </PlainModal>
  )
}

export default FullScreenModal
