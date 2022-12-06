import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  Form,
  FormGroup,
  Input,
  Button,
  CardHeader,
  CardTitle,
  Card,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { Check } from "react-feather";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import "../../../../assets/scss/pages/authentication.scss";
import {
  register2,
  authemail,
  postTerms,
} from "../../../../redux/actions/auth/registerActions";
import { connect } from "react-redux";
import axios from "axios";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import HicareLogo from "../../../../assets/img/logo/logo1.png";
import { FormattedMessage, injectIntl } from "react-intl";
import { history } from "../../../../history";
import Loader from "react-loading";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      email: "",
      idnumber: "",
      name: "",
      phone: "",
      password: "",
      chkpassword: "",
      btdate: "",
      gender: "",
      otheremail: false,
      idmodal: false,
      vfemodal: false,
      verifyemailyn: "N",
      chkpasswordmodal: false,
      loadingmodal: false,
    };
  }

  idModal = () => {
    this.setState((prevState) => ({
      idmodal: !prevState.idmodal,
    }));
  };

  emailauth = (e) => {
    const { intl } = this.props;
    e.preventDefault();
    if (this.state.userid === this.state.email) {
      alert(intl.formatMessage({ id: "enterotheremail" }));
    } else {
      this.setState({ loadingmodal: true });
      if (this.state.otheremail === false) {
        this.authemail(this.state.userid, this.state.userid);
      } else {
        this.authemail(this.state.userid, this.state.email);
      }
    }
  };

  authemail = (userid, email) => {
    axios
      .post("https://teledoc.hicare.net:446/signup-email", {
        user_id: userid,
        email: email,
      })

      .then((response) => {
        if (response.data.status === "200") {
          this.setState({ loadingmodal: false }, () =>
            alert(response.data.message)
          );
        } else {
          this.setState({ loadingmodal: false }, () =>
            alert(response.data.message)
          );
        }
      });
  };

  verifyauth = (e) => {
    e.preventDefault();
    // if(this.state.otheremail===false) {
    this.verifyemail(this.state.userid, this.state.idnumber);
    // } else {
    //   this.verifyemail(
    //     this.state.email,
    //     this.state.idnumber
    //   )
    // }
  };

  verifyemail = (email, idnumber) => {
    axios
      .post("https://teledoc.hicare.net:446/signup-verify", {
        user_id: email,
        auth_code: idnumber,
      })

      .then((response) => {
        console.log(response.data.status);
        if (response.data.status === "200") {
          this.verifyEmailModal();
          this.setState({
            verifyemailyn: "Y",
          });
        } else {
          alert(response.data.message);
        }
      });
  };

  handleRegister1 = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    if (this.state.verifyemailyn === "Y") {
      let pwcheck =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,14}$/;
      let btdatecheck = /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/;
      if (!pwcheck.test(this.state.password)) {
        alert(
          intl.formatMessage({ id: "checkpassword1" }) +
            "\n" +
            intl.formatMessage({ id: "checkpassword2" })
        );
      } else if (!btdatecheck.test(this.state.btdate)) {
        alert(intl.formatMessage({ id: "enterdob" }));
      } else {
        if (this.state.password === this.state.chkpassword) {
          if (this.state.otheremail === false) {
            this.props.register2(
              this.state.userid,
              this.state.name,
              this.state.phone,
              this.state.password,
              this.state.btdate,
              this.state.gender,
              this.state.userid
            );
            this.props.postTerms(
              this.state.userid,
              this.props.terms.national_id,
              this.props.terms.term1,
              this.props.terms.term2,
              "Y",
              "Y",
              "Y",
              "Y",
              this.props.terms.six,
              "Y",
              this.props.terms.eight,
              "Y",
              "Y",
              "Y",
              "Y"
            );
          } else {
            this.props.register2(
              this.state.userid,
              this.state.name,
              this.state.phone,
              this.state.password,
              this.state.btdate,
              this.state.gender,
              this.state.email
            );
            this.props.postTerms(
              this.state.userid,
              this.props.terms.national_id,
              this.props.terms.term1,
              this.props.terms.term2,
              "Y",
              "Y",
              "Y",
              "Y",
              this.props.terms.six,
              "Y",
              this.props.terms.eight,
              "Y",
              "Y",
              "Y",
              "Y"
            );
          }
        } else {
          this.setState({ chkpasswordmodal: true });
        }
      }
    } else {
      alert(intl.formatMessage({ id: "emailvfc" }));
    }
  };

  handleOtheremail = (e) => {
    this.setState({
      otheremail: e.target.checked,
    });
  };

  verifyEmailModal = () => {
    this.setState((prevState) => ({
      vfemodal: !prevState.vfemodal,
    }));
  };

  chkpasswordModal = () => {
    this.setState((prevState) => ({
      chkpasswordmodal: !prevState.chkpasswordmodal,
    }));
  };

  maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };

  render() {
    return (
      <PerfectScrollbar
        style={{ display: "flex", height: "100vh", alignItems: "center" }}
      >
        <Row className="m-0 w-100 justify-content-center">
          <Col
            sm="12"
            xl="12"
            lg="12"
            md="12"
            className="d-flex justify-content-center p-0 m-0"
          >
            <Card className="rounded-0 mb-0 w-100 shadow-none">
              <Row className="m-0 d-flex">
                <Col lg="3" md="12">
                  <h3 className="mt-5 pl-2 text-bold-600">
                    <img
                      className="px-2"
                      onClick={() => history.push("/")}
                      src={HicareLogo}
                      alt="HicareLogo"
                      style={{
                        width: "150px",
                        paddingBottom: "0.7rem",
                        cursor: "pointer",
                      }}
                    />
                    <FormattedMessage id="Sign In" />
                  </h3>
                </Col>
              </Row>
              <Row>
                <Col lg="3" md="12"></Col>
                <Col lg="6" md="12">
                  <Card className="rounded-0 mb-0 p-2">
                    <CardHeader className="pb-1 pt-50">
                      <CardTitle>
                        <h4 className="text-bold-600">
                          <FormattedMessage id="Sign In" />
                        </h4>
                      </CardTitle>
                    </CardHeader>
                    <CardBody className="pt-1 pb-50">
                      <Form onSubmit={this.handleRegister1}>
                        <FormGroup className="form-label-group">
                          <div className="d-flex justify-content-between">
                            <div className="col-3 align-self-center">
                              <h5 className="text-bold-600">
                                <FormattedMessage id="ID" />
                              </h5>
                            </div>
                            <InputGroup>
                              <FormattedMessage id="EnterAvailableEmail">
                                {(EnterAvailableEmail) => (
                                  <Input
                                    type="email"
                                    placeholder={EnterAvailableEmail}
                                    required
                                    value={this.state.userid}
                                    onChange={(e) =>
                                      this.setState({ userid: e.target.value })
                                    }
                                    // invalid={this.state.useemail.length === 0 ? true : false}
                                  />
                                )}
                              </FormattedMessage>
                              <InputGroupAddon addonType="append">
                                <Button
                                  disabled={
                                    this.state.otheremail === true
                                      ? true
                                      : false
                                  }
                                  color="primary"
                                  type="button"
                                  onClick={this.emailauth}
                                >
                                  <FormattedMessage id="Check" />
                                </Button>
                              </InputGroupAddon>
                            </InputGroup>
                          </div>
                          <div className="col-12 mt-1">
                            <h5 className="text-bold-600">
                              <FormattedMessage id="SecureEmail" />
                              &nbsp;
                              <span className="text-primary">
                                <FormattedMessage id="UsedChnge" />
                              </span>
                            </h5>
                          </div>
                          <div className="d-flex flex-row-reverse">
                            <small>
                              <Checkbox
                                color="primary"
                                icon={<Check className="vx-icon" size={16} />}
                                label="사용 가능한 이메일 입력"
                                defaultChecked={false}
                                onChange={this.handleOtheremail}
                              />
                            </small>
                          </div>
                        </FormGroup>
                        <FormGroup className="form-label-group d-flex justify-content-between">
                          <div className="col-3"></div>
                          <InputGroup>
                            <FormattedMessage id="EnterAvailableEmail">
                              {(EnterAvailableEmail) => (
                                <Input
                                  disabled={
                                    this.state.otheremail === true
                                      ? false
                                      : true
                                  }
                                  type="email"
                                  placeholder={EnterAvailableEmail}
                                  required
                                  value={this.state.email}
                                  onChange={(e) =>
                                    this.setState({ email: e.target.value })
                                  }
                                />
                              )}
                            </FormattedMessage>
                            <InputGroupAddon addonType="append">
                              <Button
                                disabled={
                                  this.state.otheremail === true ? false : true
                                }
                                color="primary"
                                type="button"
                                onClick={this.emailauth}
                              >
                                <FormattedMessage id="Check" />
                              </Button>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>

                        <FormGroup className="form-label-group d-flex justify-content-between">
                          <div className="col-3"></div>
                          <InputGroup>
                            <FormattedMessage id="EnterCode">
                              {(EnterCode) => (
                                <Input
                                  type="number"
                                  placeholder={EnterCode}
                                  required
                                  value={this.state.idnumber}
                                  onChange={(e) =>
                                    this.setState({ idnumber: e.target.value })
                                  }
                                />
                              )}
                            </FormattedMessage>
                            <InputGroupAddon addonType="append">
                              <Button
                                color="primary"
                                type="button"
                                onClick={this.verifyauth}
                              >
                                인증 확인
                              </Button>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>

                        <FormGroup className="form-label-group d-flex justify-content-between">
                          <div className="col-3 align-self-center">
                            <h5 className="text-bold-600">
                              <FormattedMessage id="Name" />
                            </h5>
                          </div>
                          <InputGroup>
                            <Input
                              type="text"
                              // placeholder="이름"
                              required
                              value={this.state.name}
                              onChange={(e) =>
                                this.setState({ name: e.target.value })
                              }
                            />
                          </InputGroup>
                        </FormGroup>

                        <FormGroup className="form-label-group d-flex justify-content-between">
                          <div className="col-3 align-self-center">
                            <h5 className="text-bold-600">
                              <FormattedMessage id="PH" />
                            </h5>
                          </div>
                          <InputGroup>
                            <Input
                              type="number"
                              maxLength="15"
                              onInput={this.maxLengthCheck}
                              required
                              value={this.state.phone}
                              onChange={(e) =>
                                this.setState({ phone: e.target.value })
                              }
                            />
                          </InputGroup>
                        </FormGroup>

                        <FormGroup className="form-label-group d-flex justify-content-between">
                          <div className="col-3 align-self-center">
                            <h5 className="text-bold-600">
                              <FormattedMessage id="Password" />
                            </h5>
                          </div>
                          <InputGroup>
                            <FormattedMessage id="Characters">
                              {(Characters) => (
                                <Input
                                  maxLength="14"
                                  type="password"
                                  placeholder={Characters}
                                  required
                                  value={this.state.password}
                                  onChange={(e) =>
                                    this.setState({ password: e.target.value })
                                  }
                                />
                              )}
                            </FormattedMessage>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup className="form-label-group d-flex justify-content-between">
                          <div className="col-3"></div>
                          <InputGroup>
                            <FormattedMessage id="ConfirmPW">
                              {(ConfirmPW) => (
                                <Input
                                  maxLength="14"
                                  type="password"
                                  placeholder={ConfirmPW}
                                  required
                                  value={this.state.chkpassword}
                                  onChange={(e) =>
                                    this.setState({
                                      chkpassword: e.target.value,
                                    })
                                  }
                                />
                              )}
                            </FormattedMessage>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup className="form-label-group d-flex justify-content-between">
                          <div className="col-3 align-self-center">
                            <h5 className="text-bold-600">
                              <FormattedMessage id="DOB" />
                            </h5>
                          </div>
                          <InputGroup>
                            <FormattedMessage id="Yymmdd">
                              {(Yymmdd) => (
                                <Input
                                  type="number"
                                  maxLength="6"
                                  placeholder={Yymmdd}
                                  required
                                  value={this.state.btdate}
                                  onInput={this.maxLengthCheck}
                                  onChange={(e) =>
                                    this.setState({ btdate: e.target.value })
                                  }
                                />
                              )}
                            </FormattedMessage>
                            <div className="align-self-center">
                              <b>&nbsp;-&nbsp;</b>
                            </div>
                            <Input
                              maxLength="1"
                              className="col-1"
                              type="number"
                              placeholder="1,or2"
                              required
                              value={this.state.gender}
                              onInput={this.maxLengthCheck}
                              onChange={(e) =>
                                this.setState({ gender: e.target.value })
                              }
                            />
                            <div className="align-self-center">
                              <h2>
                                &nbsp;&nbsp;&nbsp;&#42;&nbsp;&nbsp;&#42;&nbsp;&nbsp;&#42;&nbsp;&nbsp;&#42;&nbsp;&nbsp;&#42;&nbsp;&nbsp;&#42;&nbsp;&nbsp;&nbsp;
                              </h2>
                            </div>
                          </InputGroup>
                        </FormGroup>
                        <div className="text-right">
                          <Button color="primary" type="submit">
                            <FormattedMessage id="Next" />
                          </Button>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="3" md="12"></Col>
              </Row>
            </Card>
          </Col>

          <Modal
            isOpen={this.state.loadingmodal}
            className="modal-dialog-centered modal-sm"
          >
            <ModalBody className="d-flex justify-content-center">
              <Loader
                type={"spin"}
                color={"silver"}
                height={"30%"}
                width={"30%"}
              />
            </ModalBody>
          </Modal>
          <Modal
            isOpen={this.state.idmodal}
            toggle={this.idModal}
            className="modal-dialog-centered modal-sm"
          >
            <ModalHeader toggle={this.idModal}></ModalHeader>
            <ModalBody>
              <FormattedMessage id="availalbleid" />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.idModal}>
                <FormattedMessage id="확인" />
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.vfemodal}
            toggle={this.verifyEmailModal}
            className="modal-dialog-centered modal-sm"
          >
            <ModalHeader toggle={this.verifyEmailModal}></ModalHeader>
            <ModalBody>
              <FormattedMessage id="vfc" />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.verifyEmailModal}>
                <FormattedMessage id="확인" />
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.chkpasswordmodal}
            toggle={this.chkpasswordModal}
            className="modal-dialog-centered modal-sm"
          >
            <ModalHeader toggle={this.chkpasswordModal}></ModalHeader>
            <ModalBody>
              <FormattedMessage id="notmatch1" />
              <br />
              <FormattedMessage id="notmatch2" />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.chkpasswordModal}>
                <FormattedMessage id="확인" />
              </Button>
            </ModalFooter>
          </Modal>
        </Row>
      </PerfectScrollbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    terms: state.auth.register.terms,
    // vfemail: state.auth.register.verify
  };
};
export default injectIntl(
  connect(mapStateToProps, { register2, authemail, postTerms })(Register)
);
