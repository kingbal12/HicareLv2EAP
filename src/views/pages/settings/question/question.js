import React from "react"
import { 
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col
} from "reactstrap"
import { history } from "../../../../history"
import "../../../../assets/scss/pages/authentication.scss"
import {connect} from "react-redux"





class Question extends React.Component {
  render() {
    return (
      <Row className="pt-3 justify-content-center">
        <Col
          sm="12"
          xl="12"
          lg="12"
          md="12"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col lg="12" md="12" className="p-0 d-flex justify-content-center">
                <Card className="col-8 p-2">
                  <CardHeader>
                      <CardTitle>
                          
                      </CardTitle>
                  </CardHeader>
                  <CardBody className="pt-1 pb-50 justify-content-center">
                    <iframe src={"https://health.iot4health.co.kr/lv1/mypage.chat.1to1.php?HeaderHide=ok"}  style={{width:"100%", height:"60vh"}}/>
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

export default (Question)
