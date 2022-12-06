import React from "react"
import {Button,
  CardHeader,
  CardTitle,
  Card,
  CardBody,
  Row,
  Col
} from "reactstrap"
import { history } from "../../../../history"
import { connect } from "react-redux"
import HicareLogo from "../../../../assets/img/logo/logo1.png"
import { FormattedMessage } from "react-intl"

class RegisterComplete extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      username: props.user.register.values.registername,
      filename: "",
      file : "",
      medicalpart: "", 
      medicalable: "", 
      medicaldesc: "", 
      medicalnum: "", 
      userdesc: "",
      previewURL : "",
      registermodal: false
    }
  }

 


  handleGoSchedule = e => {
    e.preventDefault()
    history.push("/schedule")
  }


  render() {
    return (
      <Col className="m-0 p-0" style={{background:"linear-gradient(#7367f0, #dff8fc)", width:"100%",height:"100vh"}}>
        <Row className="w-100  justify-content-center" style={{paddingTop:"10%"}}>
          <h5 style={{color:"white"}}>{this.state.username} 선생님.</h5>
        </Row>
        <Row className="w-100  justify-content-center">
          <h5 style={{color:"white"}}>가입을 축하드립니다!</h5>
        </Row>
        <Row className="w-100  justify-content-center">
          <h5 style={{color:"white"}}>진료 스케쥴을 설정해주세요.</h5>
        </Row>
        <Row className=" m-0  justify-content-center">
        <Col
          sm="12"
          xl="12"
          lg="12"
          md="12" 
          className="d-flex justify-content-center  p-0 m-0"
        >
          
          
                <Card className="rounded-0 mb-0 p-2" style={{marginTop:"100px"}}>
                  <CardHeader className="pb-1 pt-50">
                    <CardTitle className="justify-content-center">
   
                      <img className="justify-content-center" src={HicareLogo} alt="HicareLogo" style={{width:"300px"}}/>
            
                    </CardTitle>
                  </CardHeader>   
                <CardBody className="pt-1 pb-50">              
                  <div className="col-12 d-flex justify-content-center mt-5">
                    <Button
                      size="lg"
                      color="primary" 
                      type="button"
                      onClick={this.handleGoSchedule}
                    >
                      <FormattedMessage id="ScheduleS"/>
                    </Button>
                  </div>
                </CardBody>
              </Card>
        </Col>
      </Row>
    </Col>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth
  }
}

export default connect(mapStateToProps)(RegisterComplete)
