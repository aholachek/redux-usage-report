import React, { Component } from "react"
import PropTypes from "prop-types"
import JSONTree from "react-json-tree"
import styled from "styled-components"

const FadeSpan = styled.span`
  opacity: ${props => (props.fullOpacity ? 1 : 0.3)};
  font-size: 16.5px;
  line-height: 1.4;
`

const KeySpan = FadeSpan.extend`
  position: relative;
  color: ${props => (props.breakpointActive ? "red" : null)};
  font-weight: ${props => (props.breakpointActive ? "bold" : "normal")};
  cursor: pointer;
`

class ReduxTree extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    computedStates: PropTypes.array.isRequired,
    currentBreakpoint: PropTypes.string,
    setBreakpoint: PropTypes.func.isRequired
  }

  state = {}

  componentDidMount() {
    const { used, unused, stateCopy } = window.reduxReport.generate()

    this.setState({
      used,
      unused,
      stateCopy
    })
    window.reduxReport.setOnChangeCallback(this.updateReport)
  }

  componentWillUnmount() {
    window.reduxReport.removeOnChangeCallback()
  }

  updateReport = () => {
    const report = window.reduxReport.generate()
    this.setState({
      used: report.used,
      unused: report.unused,
      stateCopy: report.stateCopy
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.computedStates.length !== this.props.computedStates.length) {
      this.updateReport()
    }
  }

  isUsed(path) {
    let used = this.state.used
    for (let i = 0; i < path.length; i++) {
      used = used[path[i]]
      if (typeof used === "undefined") return false
    }
    return true
  }

  setBreakpointOnClick = breakpointPath => e => {
    if (!e.shiftKey) return
    if (breakpointPath === this.props.currentBreakpoint) {
      this.props.setBreakpoint("")
    } else {
      this.props.setBreakpoint(breakpointPath)
    }
    e.stopPropagation()
  }

  getItemString = (type, data, itemType, itemString) => <FadeSpan>{itemType}</FadeSpan>

  valueRenderer = (val, ...args) => {
    const isUsed = this.isUsed(args.slice(1).reverse())
    return <FadeSpan fullOpacity={isUsed}>{val}</FadeSpan>
  }

  labelRenderer = (keyPath, type) => {
    const isUsed = this.isUsed(keyPath.slice().reverse())
    const breakpointPath = keyPath
      .slice()
      .reverse()
      .join(".")

    const breakpointActive = breakpointPath === this.props.currentBreakpoint

    return (
      <KeySpan
        fullOpacity={isUsed}
        breakpointActive={breakpointActive}
        onClick={this.setBreakpointOnClick(breakpointPath)}
      >
        {keyPath[0]}
      </KeySpan>
    )
  }

  render() {
    return (
      <JSONTree
        data={this.state.stateCopy}
        hideRoot
        theme={this.props.theme}
        invertTheme={false}
        getItemString={this.getItemString}
        valueRenderer={this.valueRenderer}
        labelRenderer={this.labelRenderer}
        // force re-rendering when breakpoint changes
        currentBreakpoint={this.props.currentBreakpoint}
        // force re-rendering when "used" report key changes
        used={this.state.used}
      />
    )
  }
}

export default ReduxTree
