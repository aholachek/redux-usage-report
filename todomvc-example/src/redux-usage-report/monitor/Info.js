var _templateObject = _taggedTemplateLiteral(["\n  margin: 0;\n  margin-bottom: 1rem;\n  padding: 0;\n  border: 0;\n  border-radius: 3px;\n  background: none;\n  font-size: 100%;\n  vertical-align: baseline;\n  font-family: inherit;\n  font-weight: inherit;\n  color: ", ";\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  -webkit-font-smoothing: antialiased;\n  background-color: ", ";\n  padding: 8px 12px;\n  font-weight: bold;\n  cursor: pointer;\n  &:hover,\n  &:focus {\n    background-color: ", ";\n  }\n"], ["\n  margin: 0;\n  margin-bottom: 1rem;\n  padding: 0;\n  border: 0;\n  border-radius: 3px;\n  background: none;\n  font-size: 100%;\n  vertical-align: baseline;\n  font-family: inherit;\n  font-weight: inherit;\n  color: ", ";\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  -webkit-font-smoothing: antialiased;\n  background-color: ", ";\n  padding: 8px 12px;\n  font-weight: bold;\n  cursor: pointer;\n  &:hover,\n  &:focus {\n    background-color: ", ";\n  }\n"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

var propTypes = {
  currentBreakpoint: PropTypes.string,
  setBreakpoint: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

var Button = styled.button(_templateObject, function (props) {
  return props.theme.base00;
}, function (props) {
  return props.theme.base0D;
}, function (props) {
  return props.theme.base0D;
});

var Info = function Info(_ref) {
  var currentBreakpoint = _ref.currentBreakpoint,
      setBreakpoint = _ref.setBreakpoint,
      theme = _ref.theme;

  var removeBreakpoint = function removeBreakpoint() {
    return setBreakpoint("");
  };
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h3",
      null,
      "What it shows"
    ),
    React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "This monitor shows you a view of your Redux store based on what parts of it your code has actually touched."
      ),
      React.createElement(
        "p",
        null,
        "Values that have not been accessed are faded out."
      ),
      React.createElement(
        "p",
        null,
        "To learn more, check out ",
        React.createElement(
          "a",
          { href: "" },
          " the README."
        )
      )
    ),
    React.createElement(
      "h3",
      null,
      "Setting a breakpoint"
    ),
    React.createElement(
      "div",
      null,
      !!currentBreakpoint && React.createElement(
        "div",
        null,
        "There is currently a breakpoint set at",
        " ",
        React.createElement(
          "pre",
          null,
          React.createElement(
            "code",
            null,
            currentBreakpoint
          )
        ),
        React.createElement(
          Button,
          { onClick: removeBreakpoint, theme: theme },
          "Remove breakpoint"
        )
      ),
      React.createElement(
        "p",
        null,
        "Shift + click a key in the \"Redux Usage\" view to set a breakpoint."
      ),
      React.createElement(
        "p",
        null,
        "You can reload the page with your devtools open and execution will stop whenever that value in your store is accessed by your app."
      )
    )
  );
};

Info.propTypes = propTypes;

export default Info;