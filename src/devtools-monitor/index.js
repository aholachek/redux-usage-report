import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from './theme';
import Info from './Info';
import ReduxTree from './ReduxTree';

const localStorageKey = 'reduxUsageReportBreakpoints';

class ReduxUsageMonitor extends Component {
  static propTypes = {
    computedStates: PropTypes.array.isRequired,
  };

  static update = function() {};

  state = {
    showInfo: false,
    currentBreakpoint: localStorage[localStorageKey],
  };

  setBreakpoint = breakpointPath => {
    window.reduxReport.setBreakpoint(breakpointPath);
    this.setState({ currentBreakpoint: breakpointPath });
  };

  showInfo = () => {
    this.setState({ showInfo: true });
  };
  hideInfo = () => {
    this.setState({ showInfo: false });
  };

  render() {
    const Container = styled.div`
      background-color: ${theme.base00};
      min-height: 100%;
      font-size: 17px;
      font-weight: normal;
      color: ${theme.base07};
    `;

    const TabContainer = styled.ul`
      display: flex;
      padding: 0;
      li {
        flex: 1;
      }
    `;

    const Tab = styled.a`
      color: ${theme.base07};
      display: block;
      text-decoration: none !important;
      text-align: center;
      background-color: fade-out(${theme.base07}, 0.9);
      padding: 1rem;
      font-weight: ${props => (props.active ? 'bold' : 'normal')};
      border-bottom: 2px solid transparent;
      border-color: ${props => (props.active ? theme.base0C : theme.base02)};
      &:hover {
        background-color: hsla(0, 0%, 100%, 0.08);
      }
    `;

    const ContentContainer = styled.div`
      padding: 1.5rem;
    `;

    return (
      <Container>
        <TabContainer>
          <li>
            <Tab href="#" onClick={this.hideInfo} active={!this.state.showInfo}>
              Redux Usage
            </Tab>
          </li>
          <li>
            <Tab href="#" onClick={this.showInfo} active={this.state.showInfo}>
              More Info
            </Tab>
          </li>
        </TabContainer>

        <ContentContainer>
          {this.state.showInfo ? (
            <Info theme={theme} />
          ) : (
            <ReduxTree
              theme={theme}
              computedStates={this.props.computedStates}
              currentBreakpoint={this.state.currentBreakpoint}
              setBreakpoint={this.setBreakpoint}
            />
          )}
        </ContentContainer>
      </Container>
    );
  }
}

export default ReduxUsageMonitor;
