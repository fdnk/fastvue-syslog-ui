import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import { AuthFailModal } from 'components/Modals';

import Login from 'components/Login';
import Header from 'components/Header';
import HomePage from 'containers/HomePage/Loadable';
import InitSetupAndGlobalSetting from 'components/InitSetupAndGlobalSetting';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import GlobalStyle from './../../styles/global-styles';
import {
  login,
  fetchInitConfig,
  fetchAppVersion,
  fetchGlobalSettings,
  logout,
  fetchPorts
} from './actions';
import {
  makeSelectIsLoggedIn,
  makeSelectIsLoggingIn,
  makeSelectInitConfig,
  makeSelectAppVersion,
  makeSelectIsLoggedOut,
  makeSelectGlobalSettings,
  makeSelectListeningPorts,
  makeSelectUpdateGlobalSettingsLoading
} from './selectors';

import reducer from './reducer';
import saga from './saga';

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  state = {
    toLogin: false,
    toRoutes: false,
    toInitalSetup: false,
    toShowLogout: false
  };
  componentDidMount() {
    this.props.fetchInitConfig();
    this.props.fetchAppVersion();
    this.props.fetchGlobalSettings();

    const cookie = document.cookie.split(';');
    if (cookie[0]) {
      this.setState({ toShowLogout: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.props.fetchGlobalSettings();
      this.setState({
        toLogin: false,
        toRoutes: true,
        toInitalSetup: false,
        toShowLogout: true
      });
    }

    if (!prevProps.isLoggedOut && this.props.isLoggedOut) {
      document.cookie = 't=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      this.props.push('/');
      this.setState({
        toLogin: true,
        toRoutes: false,
        toShowLogout: false,
        toInitalSetup: false
      });
    }

    if (prevProps.initConfig === 'null' && !this.props.initConfig) {
      this.props.fetchPorts();
      this.props.push('/');
      this.setState({
        toLogin: false,
        toRoutes: false,
        toInitalSetup: true
      });
    }

    if (
      this.props.initConfig !== 'null' &&
      this.props.initConfig &&
      this.props.initConfig !== prevProps.initConfig
    ) {
      this.setState({
        toRoutes: true,
        toShowLogout: true
      });
    }

    if (
      this.state.toInitalSetup &&
      prevProps.isUpdateGlobalSettingsLoading !==
        this.props.isUpdateGlobalSettingsLoading
    ) {
      this.setState({
        toRoutes: true,
        toLogin: false,
        toInitalSetup: false,
        toShowLogout: true
      });
    }
  }
  render() {
    return (
      <Fragment>
        <Header
          appVersion={this.props.appVersion}
          toShowLogout={
            this.state.toShowLogout &&
            this.props.globalSettings.authEnabled &&
            this.state.toRoutes
          }
          toShowSettings={this.state.toRoutes}
          onLogout={this.props.logout}
        />

        {this.state.toRoutes && (
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route
              exact
              path="/source/:id/:tab(stats|files|archives)?/:subTab(size|messages)?"
              component={HomePage}
            />
            <Route
              exact
              path="/settings"
              component={InitSetupAndGlobalSetting}
            />
            <Route path="" component={NotFoundPage} />
          </Switch>
        )}

        {this.state.toInitalSetup && (
          <InitSetupAndGlobalSetting
            globalSettings={this.props.globalSettings}
            ports={this.props.listeningPorts}
            initSetup
          />
        )}

        {this.state.toLogin && (
          <Login onSubmit={(fields) => this.props.login(fields)} />
        )}
        <GlobalStyle />
      </Fragment>
    );
  }
}
App.propTypes = {
  appVersion: PropTypes.string
};

const mapDispatchToProps = (dispatch) => ({
  login: (fields) => dispatch(login(fields)),
  fetchInitConfig: () => dispatch(fetchInitConfig()),
  fetchAppVersion: () => dispatch(fetchAppVersion()),
  fetchGlobalSettings: () => dispatch(fetchGlobalSettings()),
  logout: () => dispatch(logout()),
  push: (path) => dispatch(push(path)),
  fetchPorts: () => dispatch(fetchPorts())
});

const mapStateToProps = createStructuredSelector({
  isLoggedIn: makeSelectIsLoggedIn(),
  isLoggingIn: makeSelectIsLoggingIn(),
  isLoggedOut: makeSelectIsLoggedOut(),
  initConfig: makeSelectInitConfig(),
  appVersion: makeSelectAppVersion(),
  globalSettings: makeSelectGlobalSettings(),
  listeningPorts: makeSelectListeningPorts(),
  isUpdateGlobalSettingsLoading: makeSelectUpdateGlobalSettingsLoading()
});

const withReducer = injectReducer({ key: 'app', reducer });
const withSaga = injectSaga({ key: 'app', saga });

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withReducer,
  withSaga,
  withConnect
)(App);
