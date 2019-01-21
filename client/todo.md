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

# TODAY

- [x] remove gap between adder and header on mobile
- [x] use sticky instead of fixed postition
- [x] styled components babel plugin
- [x] hambuger not aligned with list icons
- [x] icons in header need right padding
- [x] drawer doesn't need to be full screen
- [x] clear text button to input
- [x] on mobile rename modal is too big
- [x] selecting list should close modal
- [x] remove drag handlers
- [x] fix hmr
- [x] more space above drawer list headers
- [x] other lists should be collapsable
- [x] edit modal has different style than list modals
- [x] primary list tool tip in drawer
- [x] remove login button from header
- [x] show warning at bottom when not logged in(like the cookies warning)
- [x] animate the warning footer
- [x] update number_of_tasks with actual number instead of incrementing
- [x] loader componenets
- [x] readme / package.json
- [x] select all should become deselect all if everything is selected

- [ ] add created date to edit modal

- [ ] undo snackbar
- [ ] implement max number of tasks per list

- [ ] firegure out how to make modals and drawers work on mobile with back button
- [ ] firegout how to put app on app store
- [ ] tests

- [ ] non logged in version should store data localy
- [ ] when signing in, if there are local notes ask if they would like them to be transfered, then delete the local notes

* [ ] animate saving text in edit modal

- [ ] rethink state management (context? redux? observables?)

- [ ] add search

- [ ] animated new item with temporary background color

- [ ] swipre ofr actions

- [ ] move task to another list

- [ ] due dates

- [ ] pinned tasks

- [ ] rich text editor

- [ ] shared lists

* [ ] distinguish between completed and incompleted task counts in list's task count

* [ ] ensure service worker clears cache when initialising

* [ ] feedback

  - [ ] save feedback to firebase
  - [ ] screenshots

* [ ] seo

* [ ] code splitting

* [ ] bundle optimisation with webpack

  - [ ] tree shaking
  - [ ] minification

* [ ] Performance review/analysis

* [ ] security

* [ ] drag and drop

  - [ ] drag doesnt work on mobile
  - [ ] lock drag to vertical only

* [ ] advertisements
