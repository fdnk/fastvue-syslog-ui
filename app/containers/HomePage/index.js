import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header';
import SideBar from 'containers/SideBar/Loadable';
import MainContent from 'components/MainContent';
import { Row, Container } from 'reactstrap';
import { login } from './actions';
// import {  } from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

class HomePage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    // this.props.login();
  }
  render() {
    return (
      <Fragment>
        <Header appVersion="2.0.0.3" />
        <Container fluid style={{ display: 'table' }}>
          <Row>
            <SideBar
              activeSourceId={
                this.props.match.params && this.props.match.params.id
              }
            />
            <MainContent />
          </Row>
        </Container>
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  login: PropTypes.func,
  match: PropTypes.any
};

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(login())
});

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(HomePage);
export { mapDispatchToProps };
