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
import {logoutWithJWT} from "../../../../redux/actions/auth/loginActions"



class LoginSetting extends React.Component {
  componentDidMount() {
    this.props.logoutWithJWT()
  }

  render() {
    return (
      <Row className="pt-3 justify-content-center">
        <Col
          sm="6"
          xl="6"
          lg="6"
          md="6"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col lg="12" md="12" className="p-0">
                <Card className="rounded-0 mb-0 p-2">
                  <CardHeader>
                      <CardTitle>
                          <h2>로그인 설정</h2>
                      </CardTitle>
                  </CardHeader>
                  <CardBody className="pt-1 pb-50 justify-content-center">
                    <div className="d-flex justify-content-center">
                      <Button
                      color="primary"
                      type="button"
                      size="lg"
                      block
                      outline
                      >
                      로그아웃중입니다.
                      </Button>
                    </div>
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

export default connect(mapStateToProps, {
    logoutWithJWT,

  }) (LoginSetting)
