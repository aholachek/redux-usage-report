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

const InfoContainer = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
`

class ReduxTree extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    currentBreakpoint: PropTypes.string,
    setBreakpoint: PropTypes.func.isRequired,
    used: PropTypes.object.isRequired,
    stateCopy: PropTypes.object.isRequired
  }

  isUsed(path) {
    let used = this.props.used
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
    const { used, stateCopy, theme, currentBreakpoint } = this.props
    const usedLength = JSON.stringify(used).length
    const totalLength = JSON.stringify(stateCopy).length
    const percentUsed = usedLength > 2 ? `${Math.round(usedLength / totalLength * 100)}%` : "N/A"

    return (
      <div>
        <InfoContainer>
          Estimated percentage used: <span style={{ color: theme.base0D }}>{percentUsed}</span>
        </InfoContainer>
        <JSONTree
          data={stateCopy}
          hideRoot
          theme={theme}
          invertTheme={false}
          getItemString={this.getItemString}
          valueRenderer={this.valueRenderer}
          labelRenderer={this.labelRenderer}
          // force re-rendering when breakpoint changes
          currentBreakpoint={currentBreakpoint}
          // force re-rendering when "used" report key changes
          used={used}
        />
      </div>
    )
  }
}

export default ReduxTree
