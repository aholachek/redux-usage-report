import React, { Component } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import theme from "./theme"
import Info from "./Info"
import ReduxTree from "./ReduxTree"

const localStorageKey = "reduxUsageReportBreakpoints"

const Container = styled.div`
  background-color: ${props => props.theme.base00};
  min-height: 100%;
  font-size: 16.5px;
  font-weight: normal;
  color: ${props => props.theme.base07};

  a {
    color: ${props => props.theme.base0D};
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${props => props.theme.base07};
  }
`

const TabContainer = styled.ul`
  display: flex;
  padding: 0;
  margin: 0;
  list-style: none;
  li {
    flex: 1;
  }
`

const Tab = styled.a`
  display: block;
  text-decoration: none !important;
  text-align: center;
  background-color: ${props => `fade-out(${props.theme.base07}, 0.9)`};
  padding: 1rem;
  color: ${props => (props.active ? `${props.theme.base07} !important` : props.theme.base0D)};
  border-bottom: 3px solid transparent;
  border-color: ${props => (props.active ? props.theme.base0D : props.theme.base02)};
  background-color: ${props => (props.active ? "hsla(0, 0%, 100%, 0.08)" : null)};
  &:hover {
    background-color: ${props =>
      props.active ? "hsla(0, 0%, 100%, 0.08)" : "hsla(0, 0%, 100%, 0.03)"};
  }
`

const ContentContainer = styled.div`
  padding: 1.5rem;
`

class ReduxUsageMonitor extends Component {
  static propTypes = {
    computedStates: PropTypes.array
  }

  static update = function() {}

  state = {
    showInfo: false,
    currentBreakpoint: localStorage[localStorageKey]
  }

  setBreakpoint = breakpointPath => {
    window.reduxReport.setBreakpoint(breakpointPath)
    this.setState({ currentBreakpoint: breakpointPath })
  }

  showInfo = () => {
    this.setState({ showInfo: true })
  }
  hideInfo = () => {
    this.setState({ showInfo: false })
  }

  render() {
    return (
      <Container theme={theme}>
        <TabContainer>
          <li>
            <Tab href="#" onClick={this.hideInfo} active={!this.state.showInfo} theme={theme}>
              Redux Usage
            </Tab>
          </li>
          <li>
            <Tab href="#" onClick={this.showInfo} active={this.state.showInfo} theme={theme}>
              More Info
            </Tab>
          </li>
        </TabContainer>

        <ContentContainer>
          <div style={{ display: this.state.showInfo ? "block" : "none" }}>
            <Info
              theme={theme}
              currentBreakpoint={this.state.currentBreakpoint}
              setBreakpoint={this.setBreakpoint}
              show={this.state.showInfo}
            />
          </div>
          <div style={{ display: this.state.showInfo ? "none" : "block" }}>
            <ReduxTree
              theme={theme}
              computedStates={this.props.computedStates}
              currentBreakpoint={this.state.currentBreakpoint}
              setBreakpoint={this.setBreakpoint}
            />
          </div>
        </ContentContainer>
      </Container>
    )
  }
}

export default ReduxUsageMonitor
