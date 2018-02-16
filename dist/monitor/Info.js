"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(["\n  margin: 0;\n  margin-bottom: 1rem;\n  padding: 0;\n  border: 0;\n  border-radius: 3px;\n  background: none;\n  font-size: 100%;\n  vertical-align: baseline;\n  font-family: inherit;\n  font-weight: inherit;\n  color: ", ";\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  -webkit-font-smoothing: antialiased;\n  background-color: ", ";\n  padding: 8px 12px;\n  font-weight: bold;\n  cursor: pointer;\n  &:hover,\n  &:focus {\n    background-color: ", ";\n  }\n"], ["\n  margin: 0;\n  margin-bottom: 1rem;\n  padding: 0;\n  border: 0;\n  border-radius: 3px;\n  background: none;\n  font-size: 100%;\n  vertical-align: baseline;\n  font-family: inherit;\n  font-weight: inherit;\n  color: ", ";\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  -webkit-font-smoothing: antialiased;\n  background-color: ", ";\n  padding: 8px 12px;\n  font-weight: bold;\n  cursor: pointer;\n  &:hover,\n  &:focus {\n    background-color: ", ";\n  }\n"]);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require("styled-components");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var propTypes = {
  currentBreakpoint: _propTypes2.default.string,
  setBreakpoint: _propTypes2.default.func.isRequired,
  theme: _propTypes2.default.object.isRequired
};

var Button = _styledComponents2.default.button(_templateObject, function (props) {
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
  return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement(
      "h3",
      null,
      "What it shows"
    ),
    _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(
        "p",
        null,
        "This monitor shows you a view of your Redux store based on what parts of it your code has actually touched."
      ),
      _react2.default.createElement(
        "p",
        null,
        "Values that have not been accessed are faded out."
      ),
      _react2.default.createElement(
        "p",
        null,
        "To learn more, check out ",
        _react2.default.createElement(
          "a",
          { href: "" },
          " the README."
        )
      )
    ),
    _react2.default.createElement(
      "h3",
      null,
      "Setting a breakpoint"
    ),
    _react2.default.createElement(
      "div",
      null,
      !!currentBreakpoint && _react2.default.createElement(
        "div",
        null,
        "There is currently a breakpoint set at",
        " ",
        _react2.default.createElement(
          "pre",
          null,
          _react2.default.createElement(
            "code",
            null,
            currentBreakpoint
          )
        ),
        _react2.default.createElement(
          Button,
          { onClick: removeBreakpoint, theme: theme },
          "Remove breakpoint"
        )
      ),
      _react2.default.createElement(
        "p",
        null,
        "Shift + click a key in the \"Redux Usage\" view to set a breakpoint."
      ),
      _react2.default.createElement(
        "p",
        null,
        "You can reload the page with your devtools open and execution will stop whenever that value in your store is accessed by your app."
      )
    )
  );
};

Info.propTypes = propTypes;

exports.default = Info;