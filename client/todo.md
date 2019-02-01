# Tasks

- [x] remove observable by ensuring state changes like login go through the state instead of just firebase
  - [x] Refactor state management to use observables where it makes sense in order to take advantage of firebase's reactive queries
- [x] use material ui
- [x] Drawer menu

  - [x] Account details
  - [x] login
  - [x] Multiple lists
  - [x] set primary list
  - [x] Set current viewing list
  - [x] If no list, create primary task list by default
  - [x] when items are added, add them to the current list
    - [x] increment task count
  - [x] modify list observable to fetch a certain list
  - [x] when auth status changes, need to refresh current selected list id

* [x] remove gap between adder and header on mobile
* [x] use sticky instead of fixed postition
* [x] styled components babel plugin
* [x] hambuger not aligned with list icons
* [x] icons in header need right padding
* [x] drawer doesn't need to be full screen
* [x] clear text button to input
* [x] on mobile rename modal is too big
* [x] selecting list should close modal
* [x] remove drag handlers
* [x] fix hmr
* [x] more space above drawer list headers
* [x] other lists should be collapsable
* [x] edit modal has different style than list modals
* [x] primary list tool tip in drawer
* [x] remove login button from header
* [x] show warning at bottom when not logged in(like the cookies warning)
* [x] animate the warning footer
* [x] update number_of_tasks with actual number instead of incrementing
* [x] loader componenets
* [x] readme / package.json
* [x] select all should become deselect all if everything is selected
* [x] bug: clicking on task adder selects all items
* [x] refactor state to rxjs reducer style
* [x] toggle row MoreVert icons are misaligned

* [x] hmr is a bit dodgy with new state system
  - [x] we were just causing the useEffect at the root to retrigger

- [x] when creating a new list it should be selected as well
  - [x] solved state bug, new state was being pushed onto stream before the new state was actually updated
- [x] delete modal has too much space above text
- [x] creat elist modal too big

- [x] laggy
  - [x] optimisation
  - [x] Header should not rely on props it doesnt use (tasks)
  - [x] add memo to connect

# TODAY

- [x] Gestures for task delete/check
- [x] undo snackbar for deleting tasks

- [x] add routes

  - [x] / needs to get primary list and redirect to /list
  - [x] /trash
  - [x] /list/3/rando-list

- [x] subscribe to current tasks stream, if number is different, edit current task list
- [x] distinguish between complete and incomplete tasks

- [x] optimise gesture animation compnents (children)

  - [x] separate gesture from task
    - [x] reusable for trash task

- [x] when list unmounts, deselect tasklist (eg going to trash)

- [x] multi select for trash items

- [x] empty trash
- [x] delete selected trash tasks

* [x] Need to have a different header for trash
  - [x] or header needs to adapt to route

- [x] why does undo bar vanish when leaving, and then reappear for ever?

- [x] Check that header/taskadder is still fixed
- [x] change favicon to pencil

- [x] add dark theme

  - [x] put theme in store
    - [x] Whenever settings (dark mode for now) change, update theme
  - [x] mui theme (takes dark/light prop)
  - [x] styled componenets theme (takes dark/light prop)

* [x] text colors
* [x] background colors
* [x] add settings state in store
* [x] add theme toggle button in drawer

- [x] refactor again!

  - [x] modularise headers

- [x] add settings collection

  - [x] store what theme the user is using

- [x] task needs a background color otherwise it shoulds gesture background color

- [x] move task to another list

  - [x] 3rd option in editing header
  - [x] 3rd option in hover

- [x] could predefine the AppState type in createDispatcher

# Goal

- [ ] useGesture should take pointerup from document not item

- [ ] Moving items to other list should increment task counts appropriately (there was never a way to affect anything but the current task list previously)

* [ ] pull should not trigger edit modal

# TODO

- [ ] add notification to kill service worker
- [ ] firegure out how to make modals and drawers work on mobile with back button (you can block back button, add an event handgler instead?)

* [ ] shared lists

- [ ] ensure service worker clears cache when initialising
- [ ] security
- [ ] feedback

* [ ] deleted tasks should go to trash and be automatically deleted after a week

  - [ ] save feedback to firebase
  - [ ] screenshots

- [ ] handle non logged in user
  - [ ] don't show anything, just prompt to log in? OR
  - [ ] non logged in version should store data localy
    - [ ] when signing in, if there are local notes ask if they would like them to be transfered, then delete the local notes

* [ ] multiselect

  - [ ] drag on mobile
  - [ ] shift click on keyboard

- [ ] implement max number of tasks per list

- [ ] firegout how to put app on app store (pwa builder)
- [ ] tests

* [ ] rich text editor

- [ ] seo

- [ ] code splitting

- [ ] bundle optimisation with webpack

  - [ ] tree shaking
  - [ ] minification

- [ ] Performance review/analysis

* [ ] drag and drop

  - [ ] drag doesnt work on mobile
  - [ ] lock drag to vertical only

* [ ] advertisements

- [ ] add created date to edit modal

- [ ] order by fields

  - [ ] date added
  - [ ] last updated
  - [ ] priority
  - [ ] due date

- [ ] pinned tasks

- [ ] due dates

- [ ] pwa push notifications on due dates
  - [ ] 1 hour before notification

# Future

- [ ] hooks api?

  - Not feasible since we want to also impletement shouldcomponentupdate for you although there is an issue around it

- [ ] Stop the connect component from rerendering
  - [ ] Not possbile at the moment since there is not way to stop the rendering triggered by a context update.
