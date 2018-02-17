"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require("babel-runtime/helpers/taggedTemplateLiteral");

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(["\n  background-color: ", ";\n  min-height: 100%;\n  font-size: 16.5px;\n  font-weight: normal;\n  color: ", ";\n\n  a {\n    color: ", ";\n  }\n  h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    color: ", ";\n  }\n"], ["\n  background-color: ", ";\n  min-height: 100%;\n  font-size: 16.5px;\n  font-weight: normal;\n  color: ", ";\n\n  a {\n    color: ", ";\n  }\n  h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    color: ", ";\n  }\n"]),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(["\n  display: flex;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  li {\n    flex: 1;\n  }\n"], ["\n  display: flex;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  li {\n    flex: 1;\n  }\n"]),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(["\n  display: block;\n  text-decoration: none !important;\n  text-align: center;\n  background-color: ", ";\n  padding: 1rem;\n  color: ", ";\n  border-bottom: 3px solid transparent;\n  border-color: ", ";\n  background-color: ", ";\n  &:hover {\n    background-color: ", ";\n  }\n"], ["\n  display: block;\n  text-decoration: none !important;\n  text-align: center;\n  background-color: ", ";\n  padding: 1rem;\n  color: ", ";\n  border-bottom: 3px solid transparent;\n  border-color: ", ";\n  background-color: ", ";\n  &:hover {\n    background-color: ", ";\n  }\n"]),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(["\n  padding: 1.5rem;\n"], ["\n  padding: 1.5rem;\n"]);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require("styled-components");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _theme = require("./theme");

var _theme2 = _interopRequireDefault(_theme);

var _Info = require("./Info");

var _Info2 = _interopRequireDefault(_Info);

var _ReduxTree = require("./ReduxTree");

var _ReduxTree2 = _interopRequireDefault(_ReduxTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var localStorageKey = "reduxUsageReportBreakpoints";

var Container = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.base00;
}, function (props) {
  return props.theme.base07;
}, function (props) {
  return props.theme.base0D;
}, function (props) {
  return props.theme.base07;
});

var TabContainer = _styledComponents2.default.ul(_templateObject2);

var Tab = _styledComponents2.default.a(_templateObject3, function (props) {
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

var ContentContainer = _styledComponents2.default.div(_templateObject4);

var ReduxUsageMonitor = function (_Component) {
  (0, _inherits3.default)(ReduxUsageMonitor, _Component);

  function ReduxUsageMonitor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ReduxUsageMonitor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ReduxUsageMonitor.__proto__ || (0, _getPrototypeOf2.default)(ReduxUsageMonitor)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      showInfo: false,
      currentBreakpoint: localStorage[localStorageKey]
    }, _this.setBreakpoint = function (breakpointPath) {
      window.reduxReport.setBreakpoint(breakpointPath);
      _this.setState({ currentBreakpoint: breakpointPath });
    }, _this.showInfo = function () {
      _this.setState({ showInfo: true });
    }, _this.hideInfo = function () {
      _this.setState({ showInfo: false });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ReduxUsageMonitor, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        Container,
        { theme: _theme2.default },
        _react2.default.createElement(
          TabContainer,
          null,
          _react2.default.createElement(
            "li",
            null,
            _react2.default.createElement(
              Tab,
              { href: "#", onClick: this.hideInfo, active: !this.state.showInfo, theme: _theme2.default },
              "Redux Usage"
            )
          ),
          _react2.default.createElement(
            "li",
            null,
            _react2.default.createElement(
              Tab,
              { href: "#", onClick: this.showInfo, active: this.state.showInfo, theme: _theme2.default },
              "More Info"
            )
          )
        ),
        _react2.default.createElement(
          ContentContainer,
          null,
          _react2.default.createElement(
            "div",
            { style: { display: this.state.showInfo ? "block" : "none" } },
            _react2.default.createElement(_Info2.default, {
              theme: _theme2.default,
              currentBreakpoint: this.state.currentBreakpoint,
              setBreakpoint: this.setBreakpoint,
              show: this.state.showInfo
            })
          ),
          _react2.default.createElement(
            "div",
            { style: { display: this.state.showInfo ? "none" : "block" } },
            _react2.default.createElement(_ReduxTree2.default, {
              theme: _theme2.default,
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
}(_react.Component);

ReduxUsageMonitor.propTypes = {
  computedStates: _propTypes2.default.array
};

ReduxUsageMonitor.update = function () {};

exports.default = ReduxUsageMonitor;