"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

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
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(["\n  position: relative;\n  color: ", ";\n  font-weight: ", ";\n  cursor: pointer;\n"], ["\n  position: relative;\n  color: ", ";\n  font-weight: ", ";\n  cursor: pointer;\n"]),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(["\n  margin-bottom: 1rem;\n"], ["\n  margin-bottom: 1rem;\n"]);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactJsonTree = require("react-json-tree");

var _reactJsonTree2 = _interopRequireDefault(_reactJsonTree);

var _styledComponents = require("styled-components");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FadeSpan = _styledComponents2.default.span(_templateObject, function (props) {
  return props.fullOpacity ? 1 : 0.3;
});

var KeySpan = FadeSpan.extend(_templateObject2, function (props) {
  return props.breakpointActive ? "red" : null;
}, function (props) {
  return props.breakpointActive ? "bold" : "normal";
});

var InfoContainer = _styledComponents2.default.div(_templateObject3);

var ReduxTree = function (_Component) {
  (0, _inherits3.default)(ReduxTree, _Component);

  function ReduxTree() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ReduxTree);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ReduxTree.__proto__ || (0, _getPrototypeOf2.default)(ReduxTree)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ReduxTree, [{
    key: "isUsed",
    value: function isUsed(path) {
      var used = this.props.used;
      for (var i = 0; i < path.length; i++) {
        used = used[path[i]];
        if (typeof used === "undefined") return false;
      }
      return true;
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          used = _props.used,
          stateCopy = _props.stateCopy,
          theme = _props.theme,
          currentBreakpoint = _props.currentBreakpoint;

      var usedLength = (0, _stringify2.default)(used).length;
      var totalLength = (0, _stringify2.default)(stateCopy).length;
      var percentUsed = usedLength > 2 ? Math.ceil(usedLength / totalLength * 100) + "%" : "N/A";

      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(
          InfoContainer,
          null,
          "Percent of store used so far: ",
          _react2.default.createElement(
            "b",
            null,
            percentUsed
          )
        ),
        _react2.default.createElement(_reactJsonTree2.default, {
          data: stateCopy,
          hideRoot: true,
          theme: theme,
          invertTheme: false,
          getItemString: this.getItemString,
          valueRenderer: this.valueRenderer,
          labelRenderer: this.labelRenderer
          // force re-rendering when breakpoint changes
          , currentBreakpoint: currentBreakpoint
          // force re-rendering when "used" report key changes
          , used: used
        })
      );
    }
  }]);
  return ReduxTree;
}(_react.Component);

ReduxTree.propTypes = {
  theme: _propTypes2.default.object.isRequired,
  currentBreakpoint: _propTypes2.default.string,
  setBreakpoint: _propTypes2.default.func.isRequired,
  used: _propTypes2.default.object.isRequired,
  stateCopy: _propTypes2.default.object.isRequired
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.setBreakpointOnClick = function (breakpointPath) {
    return function (e) {
      if (!e.shiftKey) return;
      if (breakpointPath === _this2.props.currentBreakpoint) {
        _this2.props.setBreakpoint("");
      } else {
        _this2.props.setBreakpoint(breakpointPath);
      }
      e.stopPropagation();
    };
  };

  this.getItemString = function (type, data, itemType, itemString) {
    return _react2.default.createElement(
      FadeSpan,
      null,
      itemType
    );
  };

  this.valueRenderer = function (val) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var isUsed = _this2.isUsed(args.slice(1).reverse());
    return _react2.default.createElement(
      FadeSpan,
      { fullOpacity: isUsed },
      val
    );
  };

  this.labelRenderer = function (keyPath, type) {
    var isUsed = _this2.isUsed(keyPath.slice().reverse());
    var breakpointPath = keyPath.slice().reverse().join(".");

    var breakpointActive = breakpointPath === _this2.props.currentBreakpoint;

    return _react2.default.createElement(
      KeySpan,
      {
        fullOpacity: isUsed,
        breakpointActive: breakpointActive,
        onClick: _this2.setBreakpointOnClick(breakpointPath)
      },
      keyPath[0]
    );
  };
};

exports.default = ReduxTree;