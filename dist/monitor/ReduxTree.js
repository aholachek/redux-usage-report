var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(["\n  opacity: ", ";\n  font-size: 16.5px;\n  line-height: 1.4;\n"], ["\n  opacity: ", ";\n  font-size: 16.5px;\n  line-height: 1.4;\n"]),
    _templateObject2 = _taggedTemplateLiteral(["\n  position: relative;\n  color: ", ";\n  font-weight: ", ";\n  cursor: pointer;\n"], ["\n  position: relative;\n  color: ", ";\n  font-weight: ", ";\n  cursor: pointer;\n"]);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React, { Component } from "react";
import PropTypes from "prop-types";
import JSONTree from "react-json-tree";
import styled from "styled-components";

var FadeSpan = styled.span(_templateObject, function (props) {
  return props.fullOpacity ? 1 : 0.35;
});

var KeySpan = FadeSpan.extend(_templateObject2, function (props) {
  return props.breakpointActive ? "red" : null;
}, function (props) {
  return props.breakpointActive ? "bold" : "normal";
});

var ReduxTree = function (_Component) {
  _inherits(ReduxTree, _Component);

  function ReduxTree(props) {
    _classCallCheck(this, ReduxTree);

    var _this = _possibleConstructorReturn(this, (ReduxTree.__proto__ || Object.getPrototypeOf(ReduxTree)).call(this, props));

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
      return React.createElement(
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
      return React.createElement(
        FadeSpan,
        { fullOpacity: isUsed },
        val
      );
    };

    _this.labelRenderer = function (keyPath, type) {
      var isUsed = _this.isUsed(keyPath.slice().reverse());
      var breakpointPath = keyPath.slice().reverse().join(".");

      var breakpointActive = breakpointPath === _this.props.currentBreakpoint;

      return React.createElement(
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

  _createClass(ReduxTree, [{
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
      return React.createElement(JSONTree, {
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
}(Component);

ReduxTree.propTypes = {
  theme: PropTypes.object.isRequired,
  computedStates: PropTypes.array.isRequired,
  currentBreakpoint: PropTypes.string,
  setBreakpoint: PropTypes.func.isRequired
};


export default ReduxTree;