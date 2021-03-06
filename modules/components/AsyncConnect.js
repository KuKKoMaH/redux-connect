import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RouterContext from 'react-router/lib/RouterContext';
import { loadAsyncConnect } from '../helpers/utils';

export default class AsyncConnect extends Component {
  static propTypes = {
    components:      PropTypes.array.isRequired,
    params:          PropTypes.object.isRequired,
    render:          PropTypes.func.isRequired,
    beginGlobalLoad: PropTypes.func.isRequired,
    endGlobalLoad:   PropTypes.func.isRequired,
    helpers:         PropTypes.any,
    onLoadEnd: PropTypes.func,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  static defaultProps = {
    render(props) {
      return <RouterContext {...props} />;
    },
    onLoadEnd: () => {},
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      propsToShow: this.isLoaded() ? props : null,
    };

    this.loadDataCounter = 0;
  }

  componentDidMount() {
    const dataLoaded = this.isLoaded();

    // we dont need it if we already made it on server-side
    if (!dataLoaded) {
      this.loadAsyncData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!this.isOnlyHashLocationChanged(nextProps) && !this.isReplace(nextProps)) {
      this.loadAsyncData(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.propsToShow !== nextState.propsToShow;
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.onLoadEnd(prevState.propsToShow, this.state.propsToShow);
  }

  isOnlyHashLocationChanged(nextProps){
    const nextLoc = nextProps.location;
    const thisLoc = this.props.location;
    if(nextLoc === thisLoc) return false;
    return nextLoc.hash !== thisLoc.hash
      && nextLoc.action === "POP"
      && nextLoc.pathname === thisLoc.pathname
      && nextLoc.search === thisLoc.search;
  }

  isReplace(nextProps) {
    return nextProps.location.action === "REPLACE";
  }

  isLoaded() {
    return this.context.store.getState().reduxAsyncConnect.loaded;
  }

  loadAsyncData(props) {
    const store = this.context.store;
    const loadResult = loadAsyncConnect({ ...props, store });

    // TODO: think of a better solution to a problem?
    this.loadDataCounter++;
    this.props.beginGlobalLoad();
    return (loadDataCounterOriginal => loadResult.then(() => {
      // We need to change propsToShow only if loadAsyncData that called this promise
      // is the last invocation of loadAsyncData method. Otherwise we can face situation
      // when user is changing route several times and we finally show him route that has
      // loaded props last time and not the last called route
      if (this.loadDataCounter === loadDataCounterOriginal) {
        this.setState({ propsToShow: props });
      }

      // TODO: investigate race conditions
      // do we need to call this if it's not last invocation?
      this.props.endGlobalLoad();
    }))(this.loadDataCounter);
  }

  render() {
    const { propsToShow } = this.state;
    return propsToShow && this.props.render(propsToShow);
  }
}
