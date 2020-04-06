import React from "react"
import { noop } from "lib/utils"
import { Button, Snackbar, IconButton, Slide } from "@material-ui/core"
import { ClearIcon } from "lib/icons"
import { TransitionProps } from "@material-ui/core/transitions"

import { useSelector, useActions } from "services/store"

const SlideTransition = (props: TransitionProps) => {
  return <Slide {...props} direction="up" />
}

export default () => {
  const { closeSnackbar } = useActions("ui")
  const { snackbar, dark } = useSelector((state) => ({
    dark: state.settings.darkMode,
    snackbar: state.ui.snackbar,
  }))
  const [currentSnackbar, setCurrentSnackbar] = React.useState<typeof snackbar>(
    snackbar,
  )
  const [open, setOpen] = React.useState(!!snackbar)
  const queueRef = React.useRef([] as NonNullable<typeof snackbar>[])

  function processQueue() {
    const nextSnackbar = queueRef.current.shift()
    if (nextSnackbar) {
      setOpen(true)
      setCurrentSnackbar(nextSnackbar)
    } else {
      setCurrentSnackbar(null)
    }
  }

  React.useEffect(() => {
    if (snackbar && snackbar.text !== currentSnackbar?.text) {
      queueRef.current.push(snackbar)

      if (open) {
        setOpen(false)
      } else {
        processQueue()
      }
    }
  }, [snackbar?.text])

  const handleExit = () => {
    processQueue()
  }

  const handleClose = () => {
    closeSnackbar()
    currentSnackbar?.onClose?.()
    setOpen(false)
  }

  return (
    <Snackbar
      key={currentSnackbar?.text}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={open}
      autoHideDuration={currentSnackbar?.duration}
      onClose={handleClose}
      onExited={handleExit}
      TransitionComponent={SlideTransition}
      ClickAwayListenerProps={{
        onClickAway: noop,
      }}
      message={
        <span style={{ userSelect: "none" }}>
          {currentSnackbar?.icon ? (
            <span style={{ marginRight: 4 }}>{currentSnackbar.icon}</span>
          ) : null}
          {currentSnackbar?.text}
        </span>
      }
      action={currentSnackbar?.actions
        .map(({ label, handler }) => (
          <Button
            key={label}
            color="secondary"
            size="small"
            onClick={() => {
              handleClose()
              handler?.()
            }}
          >
            {label}
          </Button>
        ))
        .concat(
          currentSnackbar.closable ? (
            <IconButton
              key="close"
              style={{ color: dark ? "rgba(0, 0, 0, 0.54)" : "white" }}
              onClick={handleClose}
            >
              <ClearIcon />
            </IconButton>
          ) : (
            []
          ),
        )}
    />
  )
}
