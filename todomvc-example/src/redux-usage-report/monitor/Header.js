"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require("babel-runtime/helpers/taggedTemplateLiteral");

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(["\n  font-size: 1.1rem;\n  margin-top: 1.5rem;\n  line-height: 1.3;\n  margin-bottom: 1rem;\n  font-weight: bold;\n  color: ", ";\n"], ["\n  font-size: 1.1rem;\n  margin-top: 1.5rem;\n  line-height: 1.3;\n  margin-bottom: 1rem;\n  font-weight: bold;\n  color: ", ";\n"]);

var _styledComponents = require("styled-components");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _styledComponents2.default.h3(_templateObject, function (props) {
  return props.theme.base05;
});