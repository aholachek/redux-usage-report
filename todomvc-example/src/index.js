import React from "react"
import { render } from "react-dom"
import { createStore, compose } from "redux"
import { persistState } from "redux-devtools"
import { Provider } from "react-redux"
import App from "./containers/App"
import reducer from "./reducers"
import "todomvc-app-css/index.css"

import generateReduxReport from "./redux-usage-report"
import DevTools from "./containers/DevTools"

const enhancer = compose(
  generateReduxReport(),
  DevTools.instrument(),
  persistState(window.location.href.match(/[?&]debug_session=([^&#]+)\b/))
)

const store = createStore(reducer, enhancer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
)
