'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// main
var subtract = function subtract(rgs, block) {
  var list = [];
  var start = block.x;
  var end = void 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = rgs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var rg = _step.value;

      if (rg.x < block.y && rg.y > block.x) {
        if (rg.x > start) {
          end = rg.x;
          list.push({ x: start, y: end });
        }

        start = rg.y;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (start < block.y) {
    list.push({ x: start, y: block.y });
  }
  return list;
};

// concat
var concat = function concat(r1, r2) {
  var rgs = [].concat(_toConsumableArray(r1), _toConsumableArray(r2)).sort(function (_ref, _ref2) {
    var ax = _ref.x;
    var bx = _ref2.x;
    return ax - bx;
  });

  var list = [];
  var _rgs$ = rgs[0];
  var start = _rgs$.x;
  var end = _rgs$.y;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = rgs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var rg = _step2.value;

      if (rg.x > end) {
        list.push({ x: start, y: end });
        start = rg.x;
      }
      end = rg.y;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  list.push({ x: start, y: end });

  return list;
};

// sorted array
var arr = [{ x: 1, y: 3 }, { x: 5, y: 8 }, { x: 10, y: 12 }, { x: 15, y: 19 }];

var d = { x: 4, y: 11 };
var result = subtract(arr, d);
console.log('subtract', result);
console.log('concat', concat(arr, [{ x: 12, y: 17 }]));