import { combineReducers } from "redux"
import todos from "./todos"
import unused from "./unused"

const rootReducer = combineReducers({
  todos,
  unused
})

export default rootReducer
