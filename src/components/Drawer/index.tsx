import React, { useState } from "react"
import ContentLoader from "react-content-loader"

import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Collapse,
  Avatar,
  Divider,
  Button,
  IconButton,
  LinearProgress,
  Fade,
  Switch,
} from "@material-ui/core"

import { Text } from "lib/components"

import {
  Help,
  ExpandMore,
  ExpandLess,
  Feedback,
  Clear,
  AccountCircle,
  ExitToApp,
  Delete,
} from "@material-ui/icons"

import Modal from "lib/components/Modal"

import CreateTaskListModal from "./CreateTaskListModal"
import RenameTaskListModal from "./RenameTaskListModal"
import DeleteTaskListModal from "./DeleteTaskListModal"

import { comparator } from "ramda"
import { GoogleSignInButton } from "components"
import TaskList from "./TaskList"
import { useHistory } from "react-router-dom"

import { useActions, useSelector } from "services/store"

import { useTheme } from "theme"
import { listPageUrl } from "pages/lists/routing"

export default () => {
  const history = useHistory()
  const theme = useTheme()
  const {
    toggleDrawer,
    closeDrawer,
    signin,
    signout,
    deleteTaskList,
    createTaskList,
    editTaskList,
    setPrimaryTaskList,
    toggleDarkMode,
  } = useActions()

  const { show, taskLists, selectedTaskListId, user, darkMode } = useSelector(
    (state, s) => ({
      show: state.ui.showDrawer,
      taskLists: s.listPage.taskLists(state),
      selectedTaskListId: s.listPage.selectedTaskListId(state),
      user: state.auth.user,
      darkMode: state.settings.darkMode,
    }),
  )

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null as ID | null)
  const [showOtherLists, setShowOtherLists] = useState(true)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const selectedList =
    selectedId && taskLists
      ? taskLists.find(list => list.id === selectedId)
      : null

  const primaryList = taskLists ? taskLists.find(list => list.primary) : null

  const selectTaskList = (list: TaskList) => {
    history.push(listPageUrl(list.id))
  }

  return (
    <SwipeableDrawer
      open={show}
      onOpen={toggleDrawer}
      onClose={() => {
        closeDrawer()
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
          backgroundColor: darkMode
            ? theme.backgroundFadedColor
            : theme.backgroundColor,
        }}
      >
        {user ? (
          <ListItem
            style={{
              backgroundColor: darkMode
                ? theme.backgroundColor
                : theme.backgroundFadedColor,
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
          <ListItem style={{ backgroundColor: theme.backgroundColor }}>
            <ListItemText>
              <GoogleSignInButton onClick={signin} />
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
                style={{ color: theme.iconColor }}
                onClick={() => setShowHelpModal(true)}
              />
            </Text>
          </ListItemText>
        </ListItem>
        <Modal
          open={showHelpModal}
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
        {primaryList ? (
          <TaskList
            key={primaryList.id}
            taskList={primaryList}
            selected={primaryList.id === selectedTaskListId}
            onBodyClick={() => selectTaskList(primaryList)}
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
          <div style={{ color: theme.greyText }}>
            {showOtherLists ? <ExpandLess /> : <ExpandMore />}
          </div>
        </ListItem>
        <Collapse in={showOtherLists}>
          {taskLists ? (
            taskLists
              .filter(list => !list.primary)
              .sort(comparator((l1, l2) => l1.createdAt > l2.createdAt))
              .map(list => (
                <TaskList
                  key={list.id}
                  taskList={list}
                  selected={list.id === selectedTaskListId}
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
                  onMakePrimary={listId => {
                    setPrimaryTaskList({ listId, userId: user?.uid ?? null })
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
          <OptionItem icon={<ExitToApp />} text="Sign out" onClick={signout} />
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
              checked={darkMode}
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
          await createTaskList({
            name: values.name,
            primary: values.primary,
          })
        }}
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {selectedList && selectedId ? (
        <RenameTaskListModal
          taskList={selectedList}
          onSubmit={async values => {
            setShowRenameModal(false)
            await editTaskList({
              listId: selectedId,
              data: { ...values },
            })
          }}
          open={showRenameModal}
          onClose={() => setShowRenameModal(false)}
        />
      ) : null}

      {selectedId && selectedList ? (
        <DeleteTaskListModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          taskListName={selectedList.name}
          onConfirmDelete={async () => {
            setSelectedId(null)
            setShowDeleteModal(false)
            await deleteTaskList(selectedId)
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
