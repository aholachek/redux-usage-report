import { combineReducers } from "redux"
import todos from "./todos"

const rootReducer = combineReducers({
  todos,
  unused: () => ["here", "is", "some", "unused", "data"]
})

export default rootReducer
