import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "./DataListConfig"
import queryString from "query-string"
class PatientListView extends React.Component {
  render() {
    return (
      <React.Fragment>
        {/* <Breadcrumbs
          breadCrumbTitle="List View"
          breadCrumbParent="Data List"
          breadCrumbActive="List View"
        /> */}
        <Row>
          <Col sm="12">
            <ListViewConfig className="p-0 m-0"  parsedFilter={queryString.parse(this.props.location.search)}/>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default PatientListView
