import React from "react"
import { Button, Snackbar, IconButton } from "@material-ui/core"
import { Close } from "@material-ui/icons"

import { useSelector, useActions } from "services/store"

type Props = {
  show: boolean
}

export default () => {
  const { show } = useSelector(state => ({
    show: state.ui.showUndoSnackbar,
  }))

  const { openUndoSnackbar, closeUndoSnackbar } = useActions()

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={show}
      autoHideDuration={7000}
      onClose={closeUndoSnackbar}
      ClickAwayListenerProps={{
        onClickAway: () => {},
      }}
      ContentProps={{
        "aria-describedby": "message-id",
      }}
      message={<span style={{ userSelect: "none" }}>Task deleted</span>}
      action={[
        <Button
          key="undo"
          color="secondary"
          size="small"
          onClick={() => console.log("what")}
        >
          UNDO
        </Button>,
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={closeUndoSnackbar}
        >
          <Close />
        </IconButton>,
      ]}
    />
  )
}
