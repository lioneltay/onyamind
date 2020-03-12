import React, { useState } from "react"
import ContentLoader from "react-content-loader"

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Collapse from "@material-ui/core/Collapse"
import {Text} from "lib/components"
import Avatar from "@material-ui/core/Avatar"
import Divider from "@material-ui/core/Divider"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import LinearProgress from "@material-ui/core/LinearProgress"
import Fade from "@material-ui/core/Fade"
import Switch from "@material-ui/core/Switch"

import Help from "@material-ui/icons/Help"
import ExpandMore from "@material-ui/icons/ExpandMore"
import ExpandLess from "@material-ui/icons/ExpandLess"
import Feedback from "@material-ui/icons/Feedback"
import Clear from "@material-ui/icons/Clear"
import AccountCircle from "@material-ui/icons/AccountCircle"
import ExitToApp from "@material-ui/icons/ExitToApp"
import Delete from "@material-ui/icons/Delete"

import Modal from "lib/components/Modal"

import CreateTaskListModal from "./CreateTaskListModal"
import RenameTaskListModal from "./RenameTaskListModal"
import DeleteTaskListModal from "./DeleteTaskListModal"

import { comparator } from "ramda"
import GoogleSignInButton from "../GoogleSignInButton"
import TaskList from "./TaskList"

import { connect } from "services/state"
import { toggleDrawer } from "services/state/modules/ui"
import { signIn, signOut } from "services/state/modules/user"
import {
  addTaskList,
  editTaskList,
  deleteTaskList,
  setPrimaryTaskList,
} from "services/state/modules/task-lists"
import { withRouter, RouteComponentProps } from "react-router"

import { toggleDarkMode } from "services/state/modules/settings"

type Props = RouteComponentProps & {
  theme: Theme
  dark_mode: boolean
  show: boolean
  user: User
  task_lists: TaskList[]
  selected_task_list_id: ID | null
}

const Drawer: React.FunctionComponent<Props> = ({
  theme,
  dark_mode,
  user,
  show,
  task_lists,
  selected_task_list_id,
  history,
}) => {
  const [show_create_modal, setShowCreateModal] = useState(false)
  const [show_delete_modal, setShowDeleteModal] = useState(false)
  const [show_rename_modal, setShowRenameModal] = useState(false)
  const [selected_id, setSelectedId] = useState(null as ID | null)
  const [show_other_lists, setShowOtherLists] = useState(true)
  const [show_help_modal, setShowHelpModal] = useState(false)

  const selected_list =
    selected_id && task_lists
      ? task_lists.find(list => list.id === selected_id)
      : null

  const primary_list = task_lists ? task_lists.find(list => list.primary) : null

  const selectTaskList = (list: TaskList) => {
    history.push(`/lists/${list.id}/${list.name}`)
  }

  return (
    <SwipeableDrawer
      open={show}
      onOpen={toggleDrawer}
      onClose={() => {
        toggleDrawer()
        setShowCreateModal(false)
      }}
    >
      <List
        className="py-0"
        style={{
          width: "80vw",
          maxWidth: 400,
          minWidth: 280,
          minHeight: "100vh",
          backgroundColor: dark_mode
            ? theme.background_faded_color
            : theme.background_color,
        }}
      >
        {user ? (
          <ListItem
            style={{
              backgroundColor: dark_mode
                ? theme.background_color
                : theme.background_faded_color,
            }}
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
            <ListItemSecondaryAction>
              <IconButton>
                <Clear onClick={toggleDrawer} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ) : (
          <ListItem style={{ backgroundColor: theme.background_color }}>
            <ListItemText>
              <GoogleSignInButton onClick={signIn} />
            </ListItemText>

            <ListItemSecondaryAction>
              <IconButton>
                <Clear onClick={toggleDrawer} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )}
        <ListItem className="pb-0 pt-3" dense>
          <ListItemText className="fa-c">
            <Text variant="subtitle2" className="fa-c">
              <span className="mr-3">Primary List</span>
              <Help
                className="cursor-pointer"
                style={{ color: theme.icon_color }}
                onClick={() => setShowHelpModal(true)}
              />
            </Text>
          </ListItemText>
        </ListItem>
        <Modal
          open={show_help_modal}
          onClose={() => setShowHelpModal(false)}
          title="Primary List"
          style={{ width: 500, maxWidth: "100%" }}
          actions={
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowHelpModal(false)}
            >
              Got it
            </Button>
          }
        >
          <Text>
            The primary list will be selected by default when you open the
            application.
          </Text>
        </Modal>
        {primary_list ? (
          <TaskList
            key={primary_list.id}
            task_list={primary_list}
            selected={primary_list.id === selected_task_list_id}
            onBodyClick={() => selectTaskList(primary_list)}
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
          <Fade in={true} style={{ transitionDelay: "800ms" }}>
            <div>
              <TaskListLoader />
            </div>
          </Fade>
        )}
        <Divider />
        <ListItem
          className="pb-0 pt-3"
          dense
          button
          onClick={() => setShowOtherLists(show => !show)}
        >
          <ListItemText>
            <Text variant="subtitle2">Other Lists</Text>
          </ListItemText>
          <div style={{ color: theme.grey_text }}>
            {show_other_lists ? <ExpandLess /> : <ExpandMore />}
          </div>
        </ListItem>
        <Collapse in={show_other_lists}>
          {task_lists ? (
            task_lists
              .filter(list => !list.primary)
              .sort(comparator((l1, l2) => l1.created_at > l2.created_at))
              .map(list => (
                <TaskList
                  key={list.id}
                  task_list={list}
                  selected={list.id === selected_task_list_id}
                  onBodyClick={() => {
                    selectTaskList(list)
                  }}
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
            <ListItem>
              <ListItemText>
                <Fade in={true} style={{ transitionDelay: "800ms" }}>
                  <LinearProgress />
                </Fade>
              </ListItemText>
            </ListItem>
          )}
        </Collapse>
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
        <OptionItem
          icon={<Delete />}
          text="Trash"
          onClick={() => {
            history.push("/trash")
            toggleDrawer()
          }}
        />
        {user && (
          <OptionItem icon={<ExitToApp />} text="Sign out" onClick={signOut} />
        )}
        <OptionItem icon={<Feedback />} text="Send feedback" />
        <OptionItem icon={<Help />} text="Help" />
        <Divider />
        <ListItem className="pb-0 pt-3" dense>
          <ListItemText>
            <Text variant="subtitle2">Settings</Text>
          </ListItemText>
        </ListItem>

        <ListItem button onClick={toggleDarkMode}>
          <ListItemText>Dark mode</ListItemText>
          <ListItemSecondaryAction>
            <Switch
              checked={dark_mode}
              value="checkedB"
              color="primary"
              onChange={toggleDarkMode}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <CreateTaskListModal
        onSubmit={async values => {
          setShowCreateModal(false)
          await addTaskList({ ...values })
        }}
        open={show_create_modal}
        onClose={() => setShowCreateModal(false)}
      />

      {selected_list && selected_id ? (
        <RenameTaskListModal
          task_list={selected_list}
          onSubmit={async values => {
            setShowRenameModal(false)
            await editTaskList({
              list_id: selected_id,
              list_data: { ...values },
            })
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
            setSelectedId(null)
            setShowDeleteModal(false)
            await deleteTaskList(selected_id)
          }}
        />
      ) : null}
    </SwipeableDrawer>
  )
}

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
      <ListItemText primary={<Text>{text}</Text>} />
    </ListItem>
  )
}

const TaskListLoader: React.FunctionComponent = () => (
  <ContentLoader
    style={{ height: 67, paddingLeft: 16 }}
    height={50}
    width={250}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="0" y="10" rx="4" ry="4" width="100" height="10" />
    <rect x="0" y="30" rx="4" ry="4" width="50" height="7" />
  </ContentLoader>
)

export default withRouter(
  connect(state => ({
    theme: state.settings.theme,
    dark_mode: state.settings.user_settings.dark,
    user: state.user,
    show: state.ui.show_drawer,
    task_lists: state.task_lists,
    selected_task_list_id: state.list_view.selected_task_list_id,
  }))(Drawer),
)
