export var isObjectOrArray = function isObjectOrArray(x) {
  return x === Object(x) && typeof x !== 'function';
};
export var isUndefined = function isUndefined(x) {
  return x === undefined;
};