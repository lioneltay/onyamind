import React from "react"
import { noop } from "lib/utils"
import { Button, Snackbar, IconButton, Slide } from "@material-ui/core"
import Alert, { AlertProps } from "@material-ui/lab/Alert"
import { ClearIcon } from "lib/icons"
import { TransitionProps } from "@material-ui/core/transitions"

import { useSelector, useActions } from "services/store"

const SlideTransition = (props: TransitionProps) => {
  return <Slide {...props} direction="up" />
}

export default () => {
  const { closeSnackbar } = useActions("ui")
  const { snackbar } = useSelector((state) => ({
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
    >
      <Alert variant="filled" severity={currentSnackbar?.type}>
        {currentSnackbar?.text}
      </Alert>
    </Snackbar>
  )
}
