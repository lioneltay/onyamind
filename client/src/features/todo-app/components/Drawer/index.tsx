import React, { useState } from "react"
import { useMediaQuery } from "@tekktekk/react-media-query"

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Typography from "@material-ui/core/Typography"
import Avatar from "@material-ui/core/Avatar"
import Divider from "@material-ui/core/Divider"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"

import Feedback from "@material-ui/icons/Feedback"
import Clear from "@material-ui/icons/Clear"
import Help from "@material-ui/icons/Help"
import AccountCircle from "@material-ui/icons/AccountCircle"
import ExitToApp from "@material-ui/icons/ExitToApp"

import { useAppState } from "../../state"
import { background_color } from "../../constants"

import TaskList from "./TaskList"
import CreateTaskListModal from "./CreateTaskListModal"
import RenameTaskListModal from "./RenameTaskListModal"
import DeleteTaskListModal from "./DeleteTaskListModal"
import { ID } from "../../types"

import { comparator } from "ramda"
import GoogleSignInButton from "../../components/GoogleSignInButton"

const Drawer: React.FunctionComponent = () => {
  const {
    user,
    task_lists,
    show_drawer,
    selected_task_list_id,

    actions: {
      signOut,
      signInWithGoogle,
      setShowDrawer,
      editTaskList,
      addTaskList,
      removeTaskList,
      setPrimaryTaskList,
      selectTaskList,
    },
  } = useAppState()

  const [show_create_modal, setShowCreateModal] = useState(false)
  const [show_delete_modal, setShowDeleteModal] = useState(false)
  const [show_rename_modal, setShowRenameModal] = useState(false)
  const [selected_id, setSelectedId] = useState(null as ID | null)

  const selected_list =
    selected_id && task_lists
      ? task_lists.find(list => list.id === selected_id)
      : null

  const primary_list = task_lists ? task_lists.find(list => list.primary) : null

  const mobile = useMediaQuery("(max-width: 500px)")

  console.log({ mobile })

  return (
    <SwipeableDrawer
      open={show_drawer}
      onOpen={() => setShowDrawer(true)}
      onClose={() => {
        setShowDrawer(false)
        setShowCreateModal(false)
      }}
    >
      <List
        className="py-0"
        style={{ width: mobile ? "100vw" : 400, maxWidth: "100%" }}
      >
        {user ? (
          <ListItem
            style={{ paddingRight: 4, backgroundColor: background_color }}
          >
            <ListItemAvatar>
              {user.photoURL ? (
                <Avatar src={user.photoURL} />
              ) : (
                <Avatar>
                  <AccountCircle style={{ transform: "scale(1.9)" }} />
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemText primary={user.displayName} secondary={user.email} />
            <IconButton>
              <Clear onClick={() => setShowDrawer(false)} />
            </IconButton>
          </ListItem>
        ) : (
          <ListItem
            className="fj-c"
            style={{ backgroundColor: background_color }}
          >
            <GoogleSignInButton onClick={signInWithGoogle} />
          </ListItem>
        )}

        <ListItem className="pb-0" dense>
          <ListItemText>
            <Typography variant="subtitle2">Primary List</Typography>
          </ListItemText>
        </ListItem>

        {primary_list ? (
          <TaskList
            key={primary_list.id}
            task_list={primary_list}
            selected={primary_list.id === selected_task_list_id}
            onBodyClick={id => selectTaskList(id)}
            onDelete={id => {
              setSelectedId(id)
              setShowDeleteModal(true)
            }}
            onRename={id => {
              setSelectedId(id)
              setShowRenameModal(true)
            }}
          />
        ) : (
          <div>Loading...</div>
        )}

        <Divider />

        <ListItem className="pb-0" dense>
          <ListItemText>
            <Typography variant="subtitle2">Other Lists</Typography>
          </ListItemText>
        </ListItem>

        {task_lists ? (
          task_lists
            .filter(list => !list.primary)
            .sort(comparator((l1, l2) => l1.created_at > l2.created_at))
            .map(list => (
              <TaskList
                key={list.id}
                task_list={list}
                selected={list.id === selected_task_list_id}
                onBodyClick={id => selectTaskList(id)}
                onDelete={id => {
                  setSelectedId(id)
                  setShowDeleteModal(true)
                }}
                onRename={id => {
                  setSelectedId(id)
                  setShowRenameModal(true)
                }}
                onMakePrimary={id => {
                  setPrimaryTaskList(id)
                }}
              />
            ))
        ) : (
          <div>Loading...</div>
        )}

        <Divider />
        <ListItem className="fj-c fa-st p-0" button>
          <Button
            fullWidth
            color="primary"
            variant="text"
            style={{ height: 64 }}
            onClick={() => setShowCreateModal(true)}
          >
            CREATE NEW LIST
          </Button>
        </ListItem>
        <Divider />

        {user && (
          <OptionItem icon={<ExitToApp />} text="Sign out" onClick={signOut} />
        )}
        <OptionItem icon={<Feedback />} text="Send feedback" />
        <OptionItem icon={<Help />} text="Help" />
      </List>

      <CreateTaskListModal
        onSubmit={async values => {
          const task_list = await addTaskList({
            ...values,
            user_id: user ? user.uid : null,
            number_of_tasks: 0,
          })

          if (task_list.primary) {
            await setPrimaryTaskList(task_list.id)
          }

          setShowCreateModal(false)
        }}
        open={show_create_modal}
        onClose={() => setShowCreateModal(false)}
      />

      {selected_list && selected_id ? (
        <RenameTaskListModal
          task_list={selected_list}
          onSubmit={async values => {
            await editTaskList(selected_id, { ...values })
            setShowRenameModal(false)
          }}
          open={show_rename_modal}
          onClose={() => setShowRenameModal(false)}
        />
      ) : null}

      {selected_id && selected_list ? (
        <DeleteTaskListModal
          open={show_delete_modal}
          onClose={() => setShowDeleteModal(false)}
          task_list_name={selected_list.name}
          onConfirmDelete={async () => {
            await removeTaskList(selected_id)
            setSelectedId(null)
            setShowDeleteModal(false)
          }}
        />
      ) : null}
    </SwipeableDrawer>
  )
}

export default Drawer

type OptionItemProps = {
  icon: React.ReactElement<any>
  text: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
}

const OptionItem: React.FunctionComponent<OptionItemProps> = ({
  onClick,
  icon,
  text,
}) => {
  return (
    <ListItem button className="cursor-pointer" onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={<Typography>{text}</Typography>} />
    </ListItem>
  )
}
