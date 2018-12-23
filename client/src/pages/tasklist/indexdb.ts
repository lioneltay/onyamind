import idb, { DB } from "idb"

console.log("INDEX DB YE!")

export const open = idb.open

type Key = string | number

export function getObjectStore(db_promise: Promise<DB>, store_name: string) {
  return {
    get(key: Key) {
      return db_promise.then(db => {
        return db
          .transaction(store_name)
          .objectStore(store_name)
          .get(key)
      })
    },

    getAll() {
      return db_promise.then(db => {
        return db
          .transaction(store_name)
          .objectStore(store_name)
          .getAll()
      })
    },

    set(key: Key, val: any) {
      return db_promise.then(db => {
        const tx = db.transaction(store_name, "readwrite")
        tx.objectStore(store_name).put(val, key)
        return tx.complete
      })
    },

    delete(key: Key) {
      return db_promise.then(db => {
        const tx = db.transaction(store_name, "readwrite")
        tx.objectStore(store_name).delete(key)
        return tx.complete
      })
    },

    clear() {
      return db_promise.then(db => {
        const tx = db.transaction(store_name, "readwrite")
        tx.objectStore(store_name).clear()
        return tx.complete
      })
    },

    keys() {
      return db_promise.then(db => {
        const tx = db.transaction(store_name)
        // const keys = []
        const store = tx.objectStore(store_name)

        return store.getAllKeys()

        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // openKeyCursor isn't supported by Safari, so we fall back
        // ;(store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
        //   if (!cursor) return
        //   keys.push(cursor.key)
        //   cursor.continue()
        // })

        // return tx.complete.then(() => keys)
      })
    },
  }
}
