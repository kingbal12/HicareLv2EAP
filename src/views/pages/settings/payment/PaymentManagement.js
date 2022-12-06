import React from "react";
import { CardHeader, CardTitle, Card, CardBody, Row, Col } from "reactstrap";
import "../../../../assets/scss/pages/authentication.scss";
import DataListConfig from "./DataListConfig";
import queryString from "query-string";
import { FormattedMessage } from "react-intl";

class PaymentManagement extends React.Component {
  render() {
    return (
      <DataListConfig
        parsedFilter={queryString.parse(this.props.location.search)}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
  };
};
export default PaymentManagement;
