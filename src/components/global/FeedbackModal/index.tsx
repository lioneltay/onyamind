import React from "react"
import FeedbackModal from "./FeedbackModal"
import * as api from "services/api"
import { useActions, useSelector } from "services/store"

export default () => {
  const {
    ui: { openSnackbar, closeFeedbackModal },
  } = useActions()

  const { open } = useSelector((state) => ({
    open: state.ui.showFeedbackModal,
  }))

  return (
    <FeedbackModal
      onSubmit={async (values) => {
        await api.sendFeedback({
          subject: values.subject,
          description: values.description,
        })
        openSnackbar({ text: "Feedback sent!" })
        closeFeedbackModal()
      }}
      open={open}
      onClose={closeFeedbackModal}
    />
  )
}
