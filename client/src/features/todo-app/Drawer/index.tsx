import React, { useState } from "react"
import MDrawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Typography from "@material-ui/core/Typography"
import Avatar from "@material-ui/core/Avatar"
import Divider from "@material-ui/core/Divider"
import Modal from "@material-ui/core/Modal"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"

import Feedback from "@material-ui/icons/Feedback"
import Help from "@material-ui/icons/Help"
import AccountCircle from "@material-ui/icons/AccountCircle"
import ExitToApp from "@material-ui/icons/ExitToApp"

import LoginWidget from "../LoginWidget"

import { useAppState } from "../state"
import { background_color } from "../constants"

import { firebase } from "services/firebase"

import TaskList from "./TaskList"
import CreateTaskListModal from "./CreateTaskListModal"
import RenameTaskListModal from "./RenameTaskListModal"
import { ID } from "services/rest-api"

import { comparator } from "ramda"

const Drawer: React.FunctionComponent = () => {
  const {
    user,
    task_lists,
    show_drawer,
    selected_task_list_id,

    actions: {
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

  const selected_list = selected_id
    ? task_lists.find(list => list.id === selected_id)
    : null

  const primary_list = task_lists.find(list => list.primary)

  return (
    <MDrawer
      open={show_drawer}
      onClose={() => {
        setShowDrawer(false)
        setShowCreateModal(false)
      }}
    >
      <List className="py-0" style={{ width: 400, maxWidth: "100%" }}>
        {user ? (
          <ListItem style={{ backgroundColor: background_color }}>
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
          </ListItem>
        ) : (
          <ListItem
            className="fj-c"
            style={{ backgroundColor: background_color }}
          >
            <LoginWidget />
          </ListItem>
        )}

        <ListItem className="pb-0" dense>
          <ListItemText>
            <Typography variant="subtitle2">Primary List</Typography>
          </ListItemText>
        </ListItem>

        {primary_list && (
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
        )}

        <Divider />

        <ListItem className="pb-0" dense>
          <ListItemText>
            <Typography variant="subtitle2">Other Lists</Typography>
          </ListItemText>
        </ListItem>

        {task_lists
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
          ))}

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

        <Modal
          className="fj-c fa-c"
          open={show_delete_modal}
          onClose={() => setShowDeleteModal(false)}
        >
          {selected_id && selected_list ? (
            <Paper className="p-3">
              <Typography variant="h6">Delete {selected_list.name}</Typography>

              <Typography className="mt-3" variant="caption">
                Are you sure you want to delete this list?
              </Typography>

              <div className="fj-e mt-3">
                <Button
                  color="primary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={async () => {
                    await removeTaskList(selected_id)
                    setSelectedId(null)
                    setShowDeleteModal(false)
                  }}
                >
                  Confirm
                </Button>
              </div>
            </Paper>
          ) : (
            <div />
          )}
        </Modal>

        {user ? (
          <ListItem
            button
            className="cursor-pointer"
            onClick={() => firebase.auth().signOut()}
          >
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary={<Typography>Sign out</Typography>} />
          </ListItem>
        ) : null}

        <ListItem button>
          <ListItemIcon>
            <Feedback />
          </ListItemIcon>
          <ListItemText primary={<Typography>Send feedback</Typography>} />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <Help />
          </ListItemIcon>
          <ListItemText primary={<Typography>Help</Typography>} />
        </ListItem>
      </List>
    </MDrawer>
  )
}

export default Drawer
