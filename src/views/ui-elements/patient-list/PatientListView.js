import React from "react";
import { Row, Col } from "reactstrap";
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb";
import ListViewConfig from "./DataListConfig";
import queryString from "query-string";
class PatientListView extends React.Component {
  componentDidUpdate() {
    if (this.props.location.search === "") {
      window.location.reload();
    }
  }
  render() {
    return (
      <ListViewConfig
        parsedFilter={queryString.parse(this.props.location.search)}
      />
    );
  }
}

export default PatientListView;
