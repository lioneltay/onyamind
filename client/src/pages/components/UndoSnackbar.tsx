import React from "react"
import Button from "@material-ui/core/Button"
import Snackbar from "@material-ui/core/Snackbar"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from "@material-ui/icons/Close"

import { connect } from "services/state"
import { openUndo, undo, closeUndo } from "services/state/modules/misc"

type Props = {
  show: boolean
}

const UndoSnackbar: React.FunctionComponent<Props> = ({ show }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={show}
      autoHideDuration={7000}
      onClose={closeUndo}
      ClickAwayListenerProps={{
        onClickAway: () => {},
      }}
      ContentProps={{
        "aria-describedby": "message-id",
      }}
      message={<span style={{ userSelect: "none" }}>Task deleted</span>}
      action={[
        <Button key="undo" color="secondary" size="small" onClick={undo}>
          UNDO
        </Button>,
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={closeUndo}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  )
}

export default connect(state => ({
  show: state.show_undo,
}))(UndoSnackbar)
