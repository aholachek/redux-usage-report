const initialState = ["here", "is", "some", "unused", "data"]

export default function unused(state = initialState, action) {
  switch (action.type) {
    case "AUGMENT_UNUSED":
      return [...state, Math.random().toString()]
    default:
      return state
  }
}
