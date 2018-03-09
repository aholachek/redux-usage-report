import React from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import Header from "../components/Header"
import MainSection from "../components/MainSection"
import * as TodoActions from "../actions"
import DevTools from "./DevTools"

const App = ({ todos, actions, demo }) => (
  <div>
    <div style={{ padding: "1rem" }}>
      <button onClick={actions.augmentDemoArray} style={{ display: "block"}}>
        Click to add to "demo" array
      </button>
      <span>Second to last item in the demo array:</span>
      <b>{demo[demo.length - 2]}</b>
    </div>
    <Header addTodo={actions.addTodo} />
    <MainSection todos={todos} actions={actions} />

    {process.env.NODE_ENV === "development" && <DevTools />}
  </div>
)

App.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  demo: PropTypes.array
}

const mapStateToProps = state => ({
  todos: state.todos,
  demo: state.demo
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TodoActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
