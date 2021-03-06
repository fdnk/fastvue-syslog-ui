import React, { Component, Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
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
  fetchPorts,
  resetLoginFail
} from './actions';
import {
  makeSelectIsLoggedIn,
  makeSelectIsLoggingIn,
  makeSelectInitConfig,
  makeSelectAppVersion,
  makeSelectIsLoggedOut,
  makeSelectGlobalSettings,
  makeSelectListeningPorts,
  makeSelectUpdateGlobalSettingsLoading,
  makeSelectIsLoginFail
} from './selectors';

import reducer from './reducer';
import saga from './saga';

class App extends Component {
  state = {
    show: null,
    toShowLogout: false
  };
  componentDidMount() {
    this.props.fetchGlobalSettings();
    this.props.fetchInitConfig();
    this.props.fetchAppVersion();

    const cookie = document.cookie.split(';');
    if (cookie[0]) {
      this.setState({ toShowLogout: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.setState({
        show: 'routes',
        toShowLogout: true
      });
    }

    if (!prevProps.isLoggedOut && this.props.isLoggedOut) {
      document.cookie = 't=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      this.props.history.push('/');
      this.setState({
        show: 'login',
        toShowLogout: false
      });
    }

    if (prevProps.initConfig === 'null' && !this.props.initConfig) {
      this.props.fetchPorts();
      this.props.history.push('/');

      this.setState({
        show: 'initialSetup'
      });
    }

    if (
      this.props.initConfig !== 'null' &&
      this.props.initConfig &&
      this.props.initConfig !== prevProps.initConfig
    ) {
      this.setState({
        show: 'routes',
        toShowLogout: true
      });
    }

    if (
      this.state.show === 'initialSetup' &&
      prevProps.isUpdateGlobalSettingsLoading !==
        this.props.isUpdateGlobalSettingsLoading
    ) {
      this.setState({
        show: 'routes',
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
            this.state.show === 'routes'
          }
          toShowSettings={this.state.show === 'routes'}
          onLogout={this.props.logout}
        />
        {this.state.show === 'routes' && (
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route
              exact
              path="/source/:id/:tab(stats|files|archives)?/:subTab(size|messages)?"
              component={HomePage}
            />
            <Route exact path="/settings" component={HomePage} />
            <Route path="" component={NotFoundPage} />
          </Switch>
        )}
        {this.state.show === 'initialSetup' && (
          <InitSetupAndGlobalSetting
            globalSettings={this.props.globalSettings}
            ports={this.props.listeningPorts}
            initSetup
          />
        )}
        {this.state.show === 'login' && (
          <Login onSubmit={(fields) => this.props.login(fields)} />
        )}
        {this.props.isLoginFail && (
          <AuthFailModal onClose={this.props.resetLoginFail} />
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
  fetchPorts: () => dispatch(fetchPorts()),
  resetLoginFail: () => dispatch(resetLoginFail())
});

const mapStateToProps = createStructuredSelector({
  isLoggedIn: makeSelectIsLoggedIn(),
  isLoggingIn: makeSelectIsLoggingIn(),
  isLoggedOut: makeSelectIsLoggedOut(),
  initConfig: makeSelectInitConfig(),
  appVersion: makeSelectAppVersion(),
  globalSettings: makeSelectGlobalSettings(),
  listeningPorts: makeSelectListeningPorts(),
  isUpdateGlobalSettingsLoading: makeSelectUpdateGlobalSettingsLoading(),
  isLoginFail: makeSelectIsLoginFail()
});

const withReducer = injectReducer({ key: 'app', reducer });
const withSaga = injectSaga({ key: 'app', saga });

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

App.propTypes = {
  fetchInitConfig: PropTypes.func,
  fetchAppVersion: PropTypes.func,
  fetchGlobalSettings: PropTypes.func,
  history: PropTypes.object,
  globalSettings: PropTypes.object,
  logout: PropTypes.func,
  listeningPorts: PropTypes.string,
  isLoginFail: PropTypes.bool,
  login: PropTypes.func,
  isUpdateGlobalSettingsLoading: PropTypes.bool,
  resetLoginFail: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  isLoggedOut: PropTypes.bool,
  initConfig: PropTypes.any,
  fetchPorts: PropTypes.func
};

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withRouter
)(App);
