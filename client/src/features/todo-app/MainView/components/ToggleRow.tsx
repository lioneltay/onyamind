import React, { useState, Fragment } from "react"
import styled from "styled-components"
import { grey_text } from "../../constants"
import IconButton from "@material-ui/core/IconButton"
import ExpandMore from "@material-ui/icons/ExpandMore"
import MoreVert from "@material-ui/icons/MoreVert"
import { useAppState } from "../../state"

import IconButtonMenu from "../../components/IconButtonMenu"

const Rotate = styled.div.attrs({})<{ rotate: boolean }>`
  transform: rotate(${({ rotate }) => (rotate ? "-180deg" : "0")});
  transition: 300ms;
`

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 0fr 1fr 0fr;
  align-items: center;
  padding-left: 8px;
  color: ${grey_text};
`

const Text = styled.div`
  padding: 0 18px;
  cursor: pointer;
`

type Props = {
  open: boolean
  onToggle: () => void
  number_of_tasks: number
}

const ToggleRow: React.FunctionComponent<Props> = ({
  open,
  onToggle,
  number_of_tasks,
}) => {
  const {
    actions: { uncheckCompletedTasks, deleteCompletedTasks },
  } = useAppState()

  return (
    <RowContainer>
      <Rotate rotate={open}>
        <IconButton onClick={onToggle}>
          <ExpandMore />
        </IconButton>
      </Rotate>

      <Text onClick={onToggle}>{number_of_tasks} checked off</Text>

      <IconButtonMenu
        icon={<MoreVert />}
        items={[
          {
            label: "Uncheck all items",
            action: uncheckCompletedTasks,
          },
          {
            label: "Delete completed items",
            action: deleteCompletedTasks,
          },
        ]}
      />
    </RowContainer>
  )
}

export default ToggleRow
