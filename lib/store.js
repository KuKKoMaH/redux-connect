'use strict';

exports.__esModule = true;
exports.loadFail = exports.loadSuccess = exports.load = exports.endGlobalLoad = exports.beginGlobalLoad = exports.clearKey = exports.reducer = exports.END_GLOBAL_LOAD = exports.BEGIN_GLOBAL_LOAD = exports.CLEAR = exports.LOAD_FAIL = exports.LOAD_SUCCESS = exports.LOAD = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _handleActions;

var _reduxActions = require('redux-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOAD = exports.LOAD = '@reduxAsyncConnect/LOAD';
var LOAD_SUCCESS = exports.LOAD_SUCCESS = '@reduxAsyncConnect/LOAD_SUCCESS';
var LOAD_FAIL = exports.LOAD_FAIL = '@reduxAsyncConnect/LOAD_FAIL';
var CLEAR = exports.CLEAR = '@reduxAsyncConnect/CLEAR';
var BEGIN_GLOBAL_LOAD = exports.BEGIN_GLOBAL_LOAD = '@reduxAsyncConnect/BEGIN_GLOBAL_LOAD';
var END_GLOBAL_LOAD = exports.END_GLOBAL_LOAD = '@reduxAsyncConnect/END_GLOBAL_LOAD';

var initialState = {
  loaded: false,
  loadState: {}
};

var reducer = exports.reducer = (0, _reduxActions.handleActions)((_handleActions = {}, _handleActions[BEGIN_GLOBAL_LOAD] = function (state) {
  return (0, _extends3.default)({}, state, {
    loaded: false
  });
}, _handleActions[END_GLOBAL_LOAD] = function (state) {
  return (0, _extends3.default)({}, state, {
    loaded: true
  });
}, _handleActions), initialState);

var clearKey = exports.clearKey = (0, _reduxActions.createAction)(CLEAR);

var beginGlobalLoad = exports.beginGlobalLoad = (0, _reduxActions.createAction)(BEGIN_GLOBAL_LOAD);

var endGlobalLoad = exports.endGlobalLoad = (0, _reduxActions.createAction)(END_GLOBAL_LOAD);

var load = exports.load = (0, _reduxActions.createAction)(LOAD, function (key) {
  return {
    key: key
  };
});

var loadSuccess = exports.loadSuccess = (0, _reduxActions.createAction)(LOAD_SUCCESS, function (key, data, options) {
  return {
    key: key,
    data: data,
    options: options
  };
});

var loadFail = exports.loadFail = (0, _reduxActions.createAction)(LOAD_FAIL, function (key, error, options) {
  return {
    key: key,
    error: error,
    options: options
  };
});