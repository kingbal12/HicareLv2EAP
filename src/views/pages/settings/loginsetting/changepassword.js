import React from "react";
import {
  InputGroup,
  Form,
  FormGroup,
  Input,
  Button,
  CustomInput,
  CardHeader,
  CardTitle,
  Card,
  CardBody,
  Row,
  Col,
  CardImg,
} from "reactstrap";

import "../../../../assets/scss/pages/authentication.scss";
import { changepassword } from "../../../../redux/actions/auth/registerActions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

class ChagePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: props.user.login.values.loggedInUser.username,
      password: "",
      newpassword: "",
      confirmnewpassword: "",
    };
  }

  handlechangepassword = (e) => {
    e.preventDefault();
    let pwcheck =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,14}$/;
    if (pwcheck.test(this.state.newpassword)) {
      if (this.state.newpassword === this.state.confirmnewpassword) {
        this.props.changepassword(
          this.state.userid,
          this.state.password,
          this.state.newpassword,
          this.props.cipher.rsapublickey.publickey
        );
      } else {
        alert("설정된 새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      }
    } else {
      alert(
        "비밀번호 형식이 올바르지 않습니다.\n비밀번호 형식은 영어, 숫자, 특수문자 포함 6자~14자 이내 입니다."
      );
    }
  };

  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Col
          sm="12"
          xl="12"
          lg="12"
          md="12"
          className="d-flex justify-content-center  m-0 p-0"
        >
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col lg="12" md="12" className="p-0">
                <Card className="rounded-0 mb-0 p-2">
                  <CardHeader className="pb-1 pt-50">
                    <CardTitle>
                      <h3 className="text-bold-600">
                        <FormattedMessage id="비밀번호 변경" />
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="pt-1 pb-50">
                    <Row>
                      <Col lg="2" md="12"></Col>
                      <Col lg="8" md="12">
                        <Form action="/" onSubmit={this.handlechangepassword}>
                          <div className="form-label-group d-flex">
                            <div className="col-2 align-self-center">
                              <b>
                                <FormattedMessage id="ID" />
                              </b>
                            </div>
                            <div className="text-primary">
                              {this.state.userid}
                            </div>
                          </div>
                          <FormGroup className="form-label-group d-flex justify-content-between">
                            <div className="col-2 align-self-center">
                              <b>
                                <FormattedMessage id="현재 비밀번호" />
                              </b>
                            </div>
                            <InputGroup>
                              <FormattedMessage id="entercurrent">
                                {(entercurrent) => (
                                  <Input
                                    type="password"
                                    placeholder={entercurrent}
                                    required
                                    value={this.state.password}
                                    onChange={(e) =>
                                      this.setState({
                                        password: e.target.value,
                                      })
                                    }
                                  />
                                )}
                              </FormattedMessage>
                            </InputGroup>
                          </FormGroup>
                          <div
                            className="ml-1 pb-2 mt-2"
                            style={{ borderBottom: "solid silver 1px" }}
                          >
                            <FormattedMessage id="becareful1" />
                            <span className="text-primary">
                              {this.state.userid}
                            </span>
                            <FormattedMessage id="becareful2" />
                            <br />
                            <FormattedMessage id="becareful3" />
                          </div>

                          <FormGroup className="form-label-group d-flex justify-content-between mt-2">
                            <div className="col-2 align-self-center">
                              <b>
                                <FormattedMessage id="새 비밀번호" />
                              </b>
                            </div>
                            <InputGroup>
                              <FormattedMessage id="Characters">
                                {(Characters) => (
                                  <Input
                                    type="password"
                                    placeholder={Characters}
                                    required
                                    value={this.state.newpassword}
                                    onChange={(e) =>
                                      this.setState({
                                        newpassword: e.target.value,
                                      })
                                    }
                                  />
                                )}
                              </FormattedMessage>
                            </InputGroup>
                          </FormGroup>

                          <FormGroup className="form-label-group">
                            <div className="d-flex justify-content-between">
                              <div className="col-2 align-self-start">
                                <b>
                                  <FormattedMessage id="새 비밀번호 확인" />
                                </b>
                              </div>
                              <InputGroup>
                                <FormattedMessage id="reenterpass">
                                  {(reenterpass) => (
                                    <Input
                                      type="password"
                                      placeholder={reenterpass}
                                      required
                                      value={this.state.confirmnewpassword}
                                      onChange={(e) =>
                                        this.setState({
                                          confirmnewpassword: e.target.value,
                                        })
                                      }
                                    />
                                  )}
                                </FormattedMessage>
                              </InputGroup>
                            </div>
                          </FormGroup>

                          <div className="text-right">
                            <Button size="lg" color="primary" type="submit">
                              <FormattedMessage id="Save" />
                            </Button>
                          </div>
                        </Form>
                      </Col>
                      <Col lg="2" md="12"></Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cipher: state.auth.cipher,
    user: state.auth,
  };
};
export default connect(mapStateToProps, { changepassword })(ChagePassword);
