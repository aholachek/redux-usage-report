var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(["\n  background-color: ", ";\n  min-height: 100%;\n  font-size: 16.5px;\n  font-weight: normal;\n  color: ", ";\n\n  a {\n    color: ", ";\n  }\n  h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    color: ", ";\n  }\n"], ["\n  background-color: ", ";\n  min-height: 100%;\n  font-size: 16.5px;\n  font-weight: normal;\n  color: ", ";\n\n  a {\n    color: ", ";\n  }\n  h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    color: ", ";\n  }\n"]),
    _templateObject2 = _taggedTemplateLiteral(["\n  display: flex;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  li {\n    flex: 1;\n  }\n"], ["\n  display: flex;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  li {\n    flex: 1;\n  }\n"]),
    _templateObject3 = _taggedTemplateLiteral(["\n  display: block;\n  text-decoration: none !important;\n  text-align: center;\n  background-color: ", ";\n  padding: 1rem;\n  color: ", ";\n  border-bottom: 3px solid transparent;\n  border-color: ", ";\n  background-color: ", ";\n  &:hover {\n    background-color: ", ";\n  }\n"], ["\n  display: block;\n  text-decoration: none !important;\n  text-align: center;\n  background-color: ", ";\n  padding: 1rem;\n  color: ", ";\n  border-bottom: 3px solid transparent;\n  border-color: ", ";\n  background-color: ", ";\n  &:hover {\n    background-color: ", ";\n  }\n"]),
    _templateObject4 = _taggedTemplateLiteral(["\n  padding: 1.5rem;\n"], ["\n  padding: 1.5rem;\n"]);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import theme from "./theme";
import Info from "./Info";
import ReduxTree from "./ReduxTree";

var localStorageKey = "reduxUsageReportBreakpoints";

var Container = styled.div(_templateObject, function (props) {
  return props.theme.base00;
}, function (props) {
  return props.theme.base07;
}, function (props) {
  return props.theme.base0D;
}, function (props) {
  return props.theme.base07;
});

var TabContainer = styled.ul(_templateObject2);

var Tab = styled.a(_templateObject3, function (props) {
  return "fade-out(" + props.theme.base07 + ", 0.9)";
}, function (props) {
  return props.active ? props.theme.base07 + " !important" : props.theme.base0D;
}, function (props) {
  return props.active ? props.theme.base0D : props.theme.base02;
}, function (props) {
  return props.active ? "hsla(0, 0%, 100%, 0.08)" : null;
}, function (props) {
  return props.active ? "hsla(0, 0%, 100%, 0.08)" : "hsla(0, 0%, 100%, 0.03)";
});

var ContentContainer = styled.div(_templateObject4);

var ReduxUsageMonitor = function (_Component) {
  _inherits(ReduxUsageMonitor, _Component);

  function ReduxUsageMonitor() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ReduxUsageMonitor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReduxUsageMonitor.__proto__ || Object.getPrototypeOf(ReduxUsageMonitor)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      showInfo: false,
      currentBreakpoint: localStorage[localStorageKey]
    }, _this.setBreakpoint = function (breakpointPath) {
      window.reduxReport.setBreakpoint(breakpointPath);
      _this.setState({ currentBreakpoint: breakpointPath });
    }, _this.showInfo = function () {
      _this.setState({ showInfo: true });
    }, _this.hideInfo = function () {
      _this.setState({ showInfo: false });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ReduxUsageMonitor, [{
    key: "render",
    value: function render() {
      return React.createElement(
        Container,
        { theme: theme },
        React.createElement(
          TabContainer,
          null,
          React.createElement(
            "li",
            null,
            React.createElement(
              Tab,
              { href: "#", onClick: this.hideInfo, active: !this.state.showInfo, theme: theme },
              "Redux Usage"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              Tab,
              { href: "#", onClick: this.showInfo, active: this.state.showInfo, theme: theme },
              "More Info"
            )
          )
        ),
        React.createElement(
          ContentContainer,
          null,
          React.createElement(
            "div",
            { style: { display: this.state.showInfo ? "block" : "none" } },
            React.createElement(Info, {
              theme: theme,
              currentBreakpoint: this.state.currentBreakpoint,
              setBreakpoint: this.setBreakpoint,
              show: this.state.showInfo
            })
          ),
          React.createElement(
            "div",
            { style: { display: this.state.showInfo ? "none" : "block" } },
            React.createElement(ReduxTree, {
              theme: theme,
              computedStates: this.props.computedStates,
              currentBreakpoint: this.state.currentBreakpoint,
              setBreakpoint: this.setBreakpoint
            })
          )
        )
      );
    }
  }]);

  return ReduxUsageMonitor;
}(Component);

ReduxUsageMonitor.propTypes = {
  computedStates: PropTypes.array.isRequired
};

ReduxUsageMonitor.update = function () {};

export default ReduxUsageMonitor;