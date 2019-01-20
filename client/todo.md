# Tasks

- [x] Double loading of list on page load
  - caused by stream getting tasks when list_id is null

- [x] Responsive, drawer should be 100% screen on mobile

- [ ] only allow multiple check if selecting all completed or all incomplete

- [ ] Swipeable drawer

* [ ] polish readme

* [ ] animate saving text in edit modal

- [ ] rethink state management (context? redux? observables?)

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
  - [ ] distinguish between completed and incompleted task counts

- [ ] Performance review/analysis

- [ ] security

- [ ] drag and drop

  - [ ] drag doesnt work on mobile
  - [ ] lock drag to vertical only
