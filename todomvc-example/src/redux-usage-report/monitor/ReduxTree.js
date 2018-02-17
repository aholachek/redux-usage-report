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

var _templateObject = (0, _taggedTemplateLiteral3.default)(["\n  opacity: ", ";\n  font-size: 16.5px;\n  line-height: 1.4;\n"], ["\n  opacity: ", ";\n  font-size: 16.5px;\n  line-height: 1.4;\n"]),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(["\n  position: relative;\n  color: ", ";\n  font-weight: ", ";\n  cursor: pointer;\n"], ["\n  position: relative;\n  color: ", ";\n  font-weight: ", ";\n  cursor: pointer;\n"]);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactJsonTreeModified = require("./react-json-tree-modified");

var _reactJsonTreeModified2 = _interopRequireDefault(_reactJsonTreeModified);

var _styledComponents = require("styled-components");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FadeSpan = _styledComponents2.default.span(_templateObject, function (props) {
  return props.fullOpacity ? 1 : 0.35;
});

var KeySpan = FadeSpan.extend(_templateObject2, function (props) {
  return props.breakpointActive ? "red" : null;
}, function (props) {
  return props.breakpointActive ? "bold" : "normal";
});

var ReduxTree = function (_Component) {
  (0, _inherits3.default)(ReduxTree, _Component);

  function ReduxTree(props) {
    (0, _classCallCheck3.default)(this, ReduxTree);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ReduxTree.__proto__ || (0, _getPrototypeOf2.default)(ReduxTree)).call(this, props));

    _this.componentDidUpdate = function (prevProps, prevState) {
      if (prevProps.computedStates.length !== _this.props.computedStates.length) {
        var report = window.reduxReport.generate();
        _this.setState({
          used: report.used,
          unused: report.unused,
          stateCopy: report.stateCopy
        });
      }
    };

    _this.setBreakpointOnClick = function (breakpointPath) {
      return function (e) {
        if (!e.shiftKey) return;
        _this.props.setBreakpoint(breakpointPath);
        e.stopPropagation();
      };
    };

    _this.getItemString = function (type, data, itemType, itemString) {
      return _react2.default.createElement(
        FadeSpan,
        null,
        itemType
      );
    };

    _this.valueRenderer = function (val) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var isUsed = _this.isUsed(args.slice(1).reverse());
      return _react2.default.createElement(
        FadeSpan,
        { fullOpacity: isUsed },
        val
      );
    };

    _this.labelRenderer = function (keyPath, type) {
      var isUsed = _this.isUsed(keyPath.slice().reverse());
      var breakpointPath = keyPath.slice().reverse().join(".");

      var breakpointActive = breakpointPath === _this.props.currentBreakpoint;

      return _react2.default.createElement(
        KeySpan,
        {
          fullOpacity: isUsed,
          breakpointActive: breakpointActive,
          onClick: _this.setBreakpointOnClick(breakpointPath)
        },
        keyPath[0]
      );
    };

    var _window$reduxReport$g = window.reduxReport.generate(),
        used = _window$reduxReport$g.used,
        unused = _window$reduxReport$g.unused,
        stateCopy = _window$reduxReport$g.stateCopy;

    _this.state = {
      used: used,
      unused: unused,
      stateCopy: stateCopy,
      expandedPaths: []
    };
    return _this;
  }

  (0, _createClass3.default)(ReduxTree, [{
    key: "isUsed",
    value: function isUsed(path) {
      var used = this.state.used;
      for (var i = 0; i < path.length; i++) {
        used = used[path[i]];
        if (typeof used === "undefined") return false;
      }
      return true;
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement(_reactJsonTreeModified2.default, {
        data: this.state.stateCopy,
        hideRoot: true,
        theme: this.props.theme,
        invertTheme: false,
        getItemString: this.getItemString,
        valueRenderer: this.valueRenderer,
        labelRenderer: this.labelRenderer
        // force re-rendering when breakpoint changes
        , currentBreakpoint: this.props.currentBreakpoint
      });
    }
  }]);
  return ReduxTree;
}(_react.Component);

ReduxTree.propTypes = {
  theme: _propTypes2.default.object.isRequired,
  computedStates: _propTypes2.default.array.isRequired,
  currentBreakpoint: _propTypes2.default.string,
  setBreakpoint: _propTypes2.default.func.isRequired
};
exports.default = ReduxTree;