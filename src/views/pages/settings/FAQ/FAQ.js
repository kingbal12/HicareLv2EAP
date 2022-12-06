import React from "react"
import {
  CardHeader,
  CardTitle,
  Card,
  CardBody,
  Row,
  Col
} from "reactstrap"
import "../../../../assets/scss/pages/authentication.scss"
import DataListConfig from "./DataListConfig"
import queryString from "query-string"



class PaymentManagement extends React.Component {

  componentDidUpdate(){
    if(this.props.location.search==="") {
      window.location.reload()
    }
  }
  
  render() {
    return (
      <Row className="m-0 justify-content-center">
      <Col
        sm="12"
        xl="12"
        lg="12"
        md="12"
        className="d-flex justify-content-center m-0 p-0"
      >
        
        <Card className="bg-authentication rounded-0 mb-0 w-100">
          <Row className="m-0">
            <Col lg="12" md="12" className="p-0">
              <Card className="rounded-0 mb-0 p-2">
                <CardHeader className="pt-50">
                  <CardTitle>
                  </CardTitle>
                </CardHeader>   
              <CardBody className="px-6 pb-50">
                <Row>
                  <Col lg="2" md="12">
                  </Col>
                  <Col lg="8" md="12">
                    <div className="col-12">
                      <DataListConfig parsedFilter={queryString.parse(this.props.location.search)}/>
                    </div>              
                  </Col>
                  <Col lg="2" md="12">
                  </Col>
                </Row>    
              </CardBody>
            </Card>
            </Col>
          </Row>    
        </Card>
      </Col>
    </Row>

    
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth
  }
}
export default (PaymentManagement)
