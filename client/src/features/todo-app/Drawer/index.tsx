import React from "react"
import MDrawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Typography from "@material-ui/core/Typography"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"

import Feedback from "@material-ui/icons/Feedback"
import Help from "@material-ui/icons/Help"
import AccountCircle from "@material-ui/icons/AccountCircle"
import ExitToApp from "@material-ui/icons/ExitToApp"

import LoginWidget from "../LoginWidget"

import { useAppState } from "../state"
import { background_color } from "../constants"

import { firebase } from "services/firebase"

const Drawer: React.FunctionComponent = () => {
  const {
    user,
    show_drawer,
    actions: { setShowDrawer },
  } = useAppState()

  return (
    <MDrawer open={show_drawer} onClose={() => setShowDrawer(false)}>
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

        <ListItem>
          <ListItemText>
            <Typography variant="h6">Lists</Typography>
          </ListItemText>
        </ListItem>

        <ListItem>
          <ListItemText primary="Tasks" secondary="4 items" />
        </ListItem>

        <Divider />
        <ListItem className="fj-c fa-st p-0">
          <Button
            fullWidth
            color="primary"
            variant="text"
            style={{ height: 64 }}
          >
            CREATE NEW LIST
          </Button>
        </ListItem>
        <Divider />

        {user ? (
          <ListItem
            className="cursor-pointer"
            onClick={() => firebase.auth().signOut()}
          >
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary={<Typography>Sign out</Typography>} />
          </ListItem>
        ) : null}

        <ListItem>
          <ListItemIcon>
            <Feedback />
          </ListItemIcon>
          <ListItemText primary={<Typography>Send feedback</Typography>} />
        </ListItem>

        <ListItem>
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
