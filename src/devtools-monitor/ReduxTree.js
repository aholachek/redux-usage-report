import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSONTree from 'react-json-tree';
import styled from 'styled-components';

class ReduxTree extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    computedStates: PropTypes.array.isRequired,
    currentBreakpoint: PropTypes.string,
    setBreakpoint: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const generatedReport = window.reduxReport.generate();

    this.state = {
      used: generatedReport.used,
      unused: generatedReport.unused,
      stateCopy: generatedReport.stateCopy,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.computedStates.length !== this.props.computedStates.length) {
      const report = window.reduxReport.generate();
      this.setState({
        used: report.used,
        unused: report.unused,
        stateCopy: report.stateCopy,
      });
    }
  };

  isUsed(path) {
    let used = this.state.used;
    for (let i = 0; i < path.length; i++) {
      used = used[path[i]];
      if (typeof used === 'undefined') return false;
    }
    return true;
  }

  setBreakpointOnClick = breakpointPath => e => {
    if (!e.shiftKey) return;
    this.props.setBreakpoint(breakpointPath);
    e.stopPropagation();
  };

  render() {
    const FadeSpan = styled.span`
      opacity: ${props => (props.fullOpacity ? 1 : 0.35)};
      font-size: 16.5px;
      line-height: 1.4;
    `;

    const KeySpan = FadeSpan.extend`
      position: relative;
      color: ${props => (props.breakpointActive ? 'red' : null)};
      font-weight: ${props => (props.breakpointActive ? 'bold' : 'normal')};
    `;

    const getItemString = (type, data, itemType, itemString) => (
      <FadeSpan>{itemType}</FadeSpan>
    );

    const valueRenderer = (val, ...args) => {
      const isUsed = this.isUsed(args.slice(1).reverse());
      return <FadeSpan fullOpacity={isUsed}>{val}</FadeSpan>;
    };

    const labelRenderer = (keyPath, type) => {
      const isUsed = this.isUsed(keyPath.slice().reverse());
      const breakpointPath = keyPath
        .slice()
        .reverse()
        .join('.');

      const breakpointActive = breakpointPath === this.props.currentBreakpoint;

      return (
        <KeySpan
          fullOpacity={isUsed}
          breakpointActive={breakpointActive}
          onClick={this.setBreakpointOnClick(breakpointPath)}
        >
          {keyPath[0]}
        </KeySpan>
      );
    };

    return (
      <JSONTree
        data={this.state.stateCopy}
        hideRoot
        theme={this.props.theme}
        invertTheme={false}
        getItemString={getItemString}
        valueRenderer={valueRenderer}
        labelRenderer={labelRenderer}
      />
    );
  }
}

export default ReduxTree;
