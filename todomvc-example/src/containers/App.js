import React from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import Header from "../components/Header"
import MainSection from "../components/MainSection"
import * as TodoActions from "../actions"
import DevTools from "./DevTools"

const App = ({ todos, actions }) => (
  <div>
    <div style={{ padding: '1rem'}}>
      <button onClick={actions.augmentUnused}>
        Click here to update the "unused" part of the store
      </button>
    </div>
    <Header addTodo={actions.addTodo} />
    <MainSection todos={todos} actions={actions} />

    {process.env.NODE_ENV === "development" && <DevTools />}
  </div>
)

App.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  todos: state.todos
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TodoActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
