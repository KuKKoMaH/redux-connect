'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _RouterContext = require('react-router/lib/RouterContext');

var _RouterContext2 = _interopRequireDefault(_RouterContext);

var _utils = require('../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AsyncConnect = function (_Component) {
  (0, _inherits3.default)(AsyncConnect, _Component);

  function AsyncConnect(props, context) {
    (0, _classCallCheck3.default)(this, AsyncConnect);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props, context));

    _this.state = {
      propsToShow: _this.isLoaded() ? props : null
    };

    _this.loadDataCounter = 0;
    return _this;
  }

  AsyncConnect.prototype.componentDidMount = function componentDidMount() {
    var dataLoaded = this.isLoaded();

    // we dont need it if we already made it on server-side
    if (!dataLoaded) {
      this.loadAsyncData(this.props);
    }
  };

  AsyncConnect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (!this.isOnlyHashLocationChanged(nextProps) && !this.isReplace(nextProps)) {
      this.loadAsyncData(nextProps);
    }
  };

  AsyncConnect.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return this.state.propsToShow !== nextState.propsToShow;
  };

  AsyncConnect.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    this.props.onLoadEnd(prevState.propsToShow, this.state.propsToShow);
  };

  AsyncConnect.prototype.isOnlyHashLocationChanged = function isOnlyHashLocationChanged(nextProps) {
    var nextLoc = nextProps.location;
    var thisLoc = this.props.location;
    if (nextLoc === thisLoc) return false;
    return nextLoc.hash !== thisLoc.hash && nextLoc.action === "POP" && nextLoc.pathname === thisLoc.pathname && nextLoc.search === thisLoc.search;
  };

  AsyncConnect.prototype.isReplace = function isReplace(nextProps) {
    return nextProps.location.action === "REPLACE";
  };

  AsyncConnect.prototype.isLoaded = function isLoaded() {
    return this.context.store.getState().reduxAsyncConnect.loaded;
  };

  AsyncConnect.prototype.loadAsyncData = function loadAsyncData(props) {
    var _this2 = this;

    var store = this.context.store;
    var loadResult = (0, _utils.loadAsyncConnect)((0, _extends3.default)({}, props, { store: store }));

    // TODO: think of a better solution to a problem?
    this.loadDataCounter++;
    this.props.beginGlobalLoad();
    return function (loadDataCounterOriginal) {
      return loadResult.then(function () {
        // We need to change propsToShow only if loadAsyncData that called this promise
        // is the last invocation of loadAsyncData method. Otherwise we can face situation
        // when user is changing route several times and we finally show him route that has
        // loaded props last time and not the last called route
        if (_this2.loadDataCounter === loadDataCounterOriginal) {
          _this2.setState({ propsToShow: props });
        }

        // TODO: investigate race conditions
        // do we need to call this if it's not last invocation?
        _this2.props.endGlobalLoad();
      });
    }(this.loadDataCounter);
  };

  AsyncConnect.prototype.render = function render() {
    var propsToShow = this.state.propsToShow;

    return propsToShow && this.props.render(propsToShow);
  };

  return AsyncConnect;
}(_react.Component);

AsyncConnect.contextTypes = {
  store: _propTypes2.default.object.isRequired
};
AsyncConnect.defaultProps = {
  render: function render(props) {
    return _react2.default.createElement(_RouterContext2.default, props);
  },

  onLoadEnd: function onLoadEnd() {}
};
exports.default = AsyncConnect;