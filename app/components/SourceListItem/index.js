import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToggleButton from 'components/ToggleButton';
import SourceEditor from 'components/SourceEditor';

import './style.scss';

const SourceListItem = (props) => (
  // <Link to=>
  <Col
    xs="12"
    lg="12"
    className={`sourceListItem ${props.id ===
      (props.match.params && props.match.params.id) && 'highlights'}`}
    onClick={(e) => props.history.push(`/source/${props.id}`)}
  >
    <Row>
      <Col xs="10" md="10">
        <h1 className="h1 title"> {props.sourceHost} </h1>
        <div>
          <ToggleButton
            isButtonOn={props.enabled}
            onClick={(e) => props.onToggleButtonClick(props.id)}
          />
        </div>
      </Col>
      <Col xs="2" md="2">
        <div className="actions">
          <Button>
            <FontAwesomeIcon icon="cog" />
          </Button>
          <Button>
            <FontAwesomeIcon icon="eye" />
          </Button>
          <Button>
            <FontAwesomeIcon icon="times" />
          </Button>
          {!!props.error && (
            <Button color="danger">
              <FontAwesomeIcon icon="exclamation-circle" />
            </Button>
          )}
        </div>
      </Col>
    </Row>
    {/* <Row>
      <SourceEditor {...props} />
    </Row> */}
  </Col>
  // </Link>
);

SourceListItem.propTypes = {
  id: PropTypes.string,
  sourceHost: PropTypes.string,
  enabled: PropTypes.bool,
  error: PropTypes.string,
  onToggleButtonClick: PropTypes.func,
  activeSourceId: PropTypes.string
};

export default withRouter(SourceListItem);
