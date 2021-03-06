import styled from 'styled-components';
import { Col } from 'reactstrap';

const StyledTile = styled(Col)`
  height: 100%;
  text-align: center;
  color: #565672;
  padding: 6px 0;
  cursor: pointer;
  .iconBox {
    font-size: 20px;
    height: 35px;
    text-align: center;
    margin: 0 auto;
    .toggle {
      display: table;
      margin: 0 auto;
      width: 75px;
    }
  }
  &:hover {
    background-color: #7baf37;
    color: white;
  }
`;
export default StyledTile;
