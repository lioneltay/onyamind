// import React, { useState } from "react"
// import styled from "styled-components"
// import { Transition } from "react-spring"

// import {Text} from "lib/components"
// import Button from "@material-ui/core/Button"
// import Clear from "@material-ui/icons/Clear"
// import Modal from "lib/components/Modal"
// import { connect } from "services/state"
// import { signIn } from "services/state/modules/user"
// import { toggleWarningFooter } from "services/state/modules/ui"

// const Container = styled.div`
//   position: fixed;
//   width: 100%;
//   bottom: 0;
//   left: 0;
//   background: ${({ theme }) => theme.error_color};
//   color: white;
//   padding: 5px;
// `

// const Action = styled.span`
//   cursor: pointer;
//   text-decoration: underline;
//   font-weight: 500;
// `

// const X = styled(Clear)`
//   cursor: pointer;
//   position: absolute;
//   right: 10px;
//   top: 50%;
//   transform: translateY(-50%);
// ` as typeof Clear

// type Props = {
//   theme: Theme
//   show: boolean
// }

// const WarningFooter: React.FunctionComponent<Props> = ({ show, theme }) => {
//   const [show_modal, setShowModal] = useState(false)

//   return (
//     <Transition
//       // items={show_warning_footer && !user}
//       items={show}
//       from={{ transform: "translateY(100%)" }}
//       enter={{ transform: "translateY(0)" }}
//       leave={{ transform: "translateY(100%)" }}
//     >
//       {show => style =>
//         show ? (
//           <Container style={style}>
//             <Text variant="caption" color="inherit" align="center">
//               <Action onClick={signIn}>Sign in</Action> to backup and sync your
//               notes across devices.{" "}
//               <Action onClick={() => setShowModal(true)}>Learn more.</Action>
//             </Text>
//             <X fontSize="small" onClick={toggleWarningFooter} />

//             <Modal
//               style={{ width: 500, maxWidth: "100%" }}
//               open={show_modal}
//               onClose={() => setShowModal(false)}
//               actions={
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Got it
//                 </Button>
//               }
//               title="You are not signed in"
//             >
//               <Text style={{ color: theme.grey_text }}>
//                 As you are not signed in your tasks are stored and only
//                 accessible directly on your device. Your data could be lost if
//                 you delete the app or lose your phone.
//                 <div className="my-2">
//                   <Action onClick={signIn}>Sign in</Action> now to enable:
//                 </div>
//                 <ul className="my-2" style={{ listStyle: "disc inside" }}>
//                   <li>Access to your tasks across all your devices</li>
//                   <li>Automatic backups of your tasks so they won't be lost</li>
//                 </ul>
//               </Text>
//             </Modal>
//           </Container>
//         ) : null}
//     </Transition>
//   )
// }

// export default connect(state => ({
//   theme: state.settings.theme,
//   show: state.ui.show_warning_footer,
// }))(WarningFooter)
