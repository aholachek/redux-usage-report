const initialState = [
  "here",
  "is",
  "some",
  "unused",
  "data",
  "to",
  "demonstrate",
  "how",
  "the",
  "monitor",
  "works",
  "for",
  "arrays"
]

export default function demoArray(state = initialState, action) {
  switch (action.type) {
    case "AUGMENT_DEMO":
      return [...state, Math.random().toString()]
    default:
      return state
  }
}
