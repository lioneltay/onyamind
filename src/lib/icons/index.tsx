import React from "react"

import {
  Clear,
  ArrowBack,
  Menu,
  MoreVert,
  Delete,
  Check,
  Assignment,
  ExpandMore,
  MoreVertOutlined,
  Add,
  DeleteSweep,
  SwapHoriz,
  Restore,
  Help,
  Feedback,
  AccountCircle,
  Notifications,
  Close,
  ChevronLeft,
  ExitToApp,
  Settings,
  SvgIconComponent,
} from "@material-ui/icons"

const iconFromMaterialIcon = (
  name: string,
  Icon: SvgIconComponent,
): SvgIconComponent => {
  return (props: any) => <Icon data-icon-name={name.toLowerCase()} {...props} />
}

export const ClearIcon = iconFromMaterialIcon("Clear", Clear)
export const CloseIcon = iconFromMaterialIcon("Close", Close)
export const ArrowBackIcon = iconFromMaterialIcon("ArrowBack", ArrowBack)
export const MenuIcon = iconFromMaterialIcon("Menu", Menu)
export const MoreVertIcon = iconFromMaterialIcon("MoreVert", MoreVert)
export const DeleteIcon = iconFromMaterialIcon("Delete", Delete)
export const CheckIcon = iconFromMaterialIcon("Check", Check)
export const AssignmentIcon = iconFromMaterialIcon("Assignment", Assignment)
export const ExpandMoreIcon = iconFromMaterialIcon("ExpandMore", ExpandMore)
export const MoreVertOutlinedIcon = iconFromMaterialIcon(
  "MoreVertOutlined",
  MoreVertOutlined,
)
export const AddIcon = iconFromMaterialIcon("Add", Add)
export const DeleteSweepIcon = iconFromMaterialIcon("DeleteSweep", DeleteSweep)
export const SwapHorizIcon = iconFromMaterialIcon("SwapHoriz", SwapHoriz)
export const RestoreIcon = iconFromMaterialIcon("Restore", Restore)
export const HelpIcon = iconFromMaterialIcon("Help", Help)
export const FeedbackIcon = iconFromMaterialIcon("Feedback", Feedback)
export const AccountCircleIcon = iconFromMaterialIcon(
  "AccountCircle",
  AccountCircle,
)
export const NotificationsIcon = iconFromMaterialIcon(
  "Notifications",
  Notifications,
)
export const ChevronLeftIcon = iconFromMaterialIcon("ChevronLeft", ChevronLeft)
export const ExitToAppIcon = iconFromMaterialIcon("ExitToApp", ExitToApp)
export const SettingsIcon = iconFromMaterialIcon("Settings", Settings)

export * from "./provider-icons"
