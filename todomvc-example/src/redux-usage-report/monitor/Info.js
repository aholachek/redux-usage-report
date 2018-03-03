"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require("babel-runtime/helpers/taggedTemplateLiteral");

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(["\n  font-size: 1.1rem;\n  margin-top: 1.5rem;\n  line-height: 1.3;\n  margin-bottom: 1rem;\n  font-weight: bold;\n  color: ", ";\n"], ["\n  font-size: 1.1rem;\n  margin-top: 1.5rem;\n  line-height: 1.3;\n  margin-bottom: 1rem;\n  font-weight: bold;\n  color: ", ";\n"]),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(["\n  margin: 0 0 1rem 0;\n  padding: 0;\n  border: 0;\n  border-radius: 3px;\n  background: none;\n  font-size: 100%;\n  vertical-align: baseline;\n  font-family: inherit;\n  font-weight: inherit;\n  color: ", ";\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  -webkit-font-smoothing: antialiased;\n  background-color: ", ";\n  padding: 8px 12px;\n  font-weight: bold;\n  cursor: pointer;\n  &:hover,\n  &:focus {\n    background-color: ", ";\n  }\n"], ["\n  margin: 0 0 1rem 0;\n  padding: 0;\n  border: 0;\n  border-radius: 3px;\n  background: none;\n  font-size: 100%;\n  vertical-align: baseline;\n  font-family: inherit;\n  font-weight: inherit;\n  color: ", ";\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  -webkit-font-smoothing: antialiased;\n  background-color: ", ";\n  padding: 8px 12px;\n  font-weight: bold;\n  cursor: pointer;\n  &:hover,\n  &:focus {\n    background-color: ", ";\n  }\n"]),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(["\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n"], ["\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n"]);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require("styled-components");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  currentBreakpoint: _propTypes2.default.string,
  setBreakpoint: _propTypes2.default.func.isRequired,
  theme: _propTypes2.default.object.isRequired
};

var Header = _styledComponents2.default.h3(_templateObject, function (props) {
  return props.theme.base05;
});

var Button = _styledComponents2.default.button(_templateObject2, function (props) {
  return props.theme.base00;
}, function (props) {
  return props.theme.base0D;
}, function (props) {
  return props.theme.base0D;
});

var SpacingWrapper = _styledComponents2.default.div(_templateObject3);

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
      Header,
      { theme: theme },
      "About this tool"
    ),
    _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(
        "p",
        null,
        "This monitor shows you a view of your Redux store based on what parts of it your code has actually touched. Values that have not been accessed are faded out. To learn more, check out",
        " ",
        _react2.default.createElement(
          "a",
          { href: "https://github.com/aholachek/redux-usage-report#redux-usage-report" },
          "the README."
        )
      )
    ),
    _react2.default.createElement(
      Header,
      { theme: theme },
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
          SpacingWrapper,
          null,
          _react2.default.createElement(
            "pre",
            null,
            _react2.default.createElement(
              "code",
              null,
              currentBreakpoint
            )
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