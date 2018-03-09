import { combineReducers } from "redux"
import todos from "./todos"
import demoArray from "./demoArray"

const rootReducer = combineReducers({
  todos,
  demo: demoArray
})

export default rootReducer
