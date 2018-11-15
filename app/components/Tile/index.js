import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToggleButton from 'components/ToggleButton';

import './style.scss';

const Tile = (props) => (
  <Col className="tile" onClick={(e) => props.onClick(e)} xs="6" md="6" lg="6">
    <Col className="iconBox">
      {props.variant === 'autoDiscover' && (
        <div className="toggle"><ToggleButton isButtonOn={props.isAutoDiscoverOn} /></div>
      )}
      {props.variant === 'listeningPort' && (
        <FontAwesomeIcon icon="headphones" />
      )}
      {props.variant === 'addSource' && <FontAwesomeIcon icon="plus" />}
    </Col>
    <span className="tileLabel">{props.label}</span>
  </Col>
);

Tile.propTypes = {
  variant: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  isAutoDiscoverOn: PropTypes.bool
};

export default Tile;
