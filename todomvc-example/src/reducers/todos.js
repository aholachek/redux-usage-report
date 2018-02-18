import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  COMPLETE_TODO,
  COMPLETE_ALL,
  CLEAR_COMPLETED
} from "../constants/ActionTypes"

const initialState = [
  {
    text: "Twas brillig and the slithy toves",
    completed: false,
    id: 0,
    someExtraData: {
      thisObj: "isUnused",
      thisObj2: 'isAccessedWhenCompletedIsToggled'

    }
  },
  {
    text: "Did gyre and gimbel in the wabe",
    completed: false,
    someExtraData: {
      thisObj: "isUnused",
      thisObj2: 'isAccessedWhenCompletedIsToggled'

    },
    id: 1
  },
  {
    text: "All mimsy were the borogroves",
    completed: false,
    someExtraData: {
      thisObj: "isUnused",
      thisObj2: 'isAccessedWhenCompletedIsToggled'
    },
    id: 3
  }
]

export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: action.text,
          thisObjectIsntAccessed: {
            a: Math.random().toFixed(3),
            b: Math.random().toFixed(4)
          },
          thisValueIsntAccessed: "foo",
          thisObj2: 'isAccessedWhenCompletedIsToggled'

        }
      ]

    case DELETE_TODO:
      return state.filter(todo => todo.id !== action.id)

    case EDIT_TODO:
      return state.map(todo => (todo.id === action.id ? { ...todo, text: action.text } : todo))

    case COMPLETE_TODO:
      return state.map(
        todo => (todo.id === action.id ? { ...todo, completed: !todo.completed } : todo)
      )

    case COMPLETE_ALL:
      const areAllMarked = state.every(todo => todo.completed)
      return state.map(todo => ({
        ...todo,
        completed: !areAllMarked
      }))

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.completed === false)

    default:
      return state
  }
}
