import React from "react";
import {
  Form,
  FormGroup,
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
} from "reactstrap";
import axios from "axios";
import "../../../../assets/scss/pages/authentication.scss";
import { connect } from "react-redux";
import { Check } from "react-feather";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { history } from "../../../../history";
import { FormattedMessage } from "react-intl";
import AES256 from "aes-everywhere";
import { SERVER_URL2 } from "../../../../config";
import {
  encryptByPubKey,
  decryptByAES,
  AESKey,
} from "../../../../redux/actions/auth/cipherActions";
import { IntlContext } from "../../../../utility/context/Internationalization";
class Withdrawal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: props.user.login.values.loggedInUser.username,
      checkwithdrawal: false,
      modal: false,
      checkmodal: false,
    };
  }

  handleChkWithdrawal = (e) => {
    this.setState({
      checkwithdrawal: e.target.checked,
    });
  };

  handlewithdrawal = () => {
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    let value = AES256.encrypt(
      JSON.stringify({
        user_id: this.state.userid,
        user_state: "9",
      }),
      AESKey
    );
    if (this.state.checkwithdrawal === true) {
      axios
        .post("https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php", {
          url: `${SERVER_URL2}/doctor/account/user-state`,
          c_key: encryptedrsapkey,
          c_value: value,
          method: "PUT",
        })
        .then((response) => {
          console.log(response);
          if (response.data.status === "200") {
            this.setState({ modal: true });
          } else {
            alert(response.data.message);
          }
        });
    }
  };
  Modal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  checkModal = () => {
    this.setState((prevState) => ({
      checkmodal: !prevState.checkmodal,
    }));
  };

  confirmWithdrawal = () => {
    this.handlewithdrawal();
    this.Modal();
  };

  goLogin = (e) => {
    e.preventDefault();
    history.push("/");
  };

  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Modal
          isOpen={this.state.modal}
          toggle={this.Modal}
          className="modal-dialog-centered modal-sm"
        >
          <ModalHeader toggle={this.Modal}></ModalHeader>
          <ModalBody>
            <FormattedMessage id="cancel_membership1" />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.goLogin}>
              <FormattedMessage id="확인" />
            </Button>{" "}
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.checkmodal}
          toggle={this.checkModal}
          className="modal-dialog-centered modal-sm"
        >
          <ModalHeader toggle={this.checkModal}></ModalHeader>
          <ModalBody>
            <FormattedMessage id="cancel_membership2" />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" outline onClick={this.checkModal}>
              <FormattedMessage id="Cancellation" />
            </Button>
            <Button color="primary" onClick={this.confirmWithdrawal}>
              <FormattedMessage id="확인" />
            </Button>
          </ModalFooter>
        </Modal>
        <Col
          sm="12"
          xl="12"
          lg="12"
          md="12"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col lg="12" md="12" className="p-0">
                <Card className="rounded-0 mb-0 p-2">
                  <CardHeader className="pb-1 pt-50">
                    <CardTitle>
                      <h3 className="text-bold-600">
                        <FormattedMessage id="회원탈퇴" />
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="pt-1 pb-50">
                    <Row>
                      <Col lg="2" md="12"></Col>
                      <Col lg="8" md="12">
                        <Form>
                          <div>
                            <div>
                              <strong>
                                <FormattedMessage id="기록삭제" />
                              </strong>
                            </div>
                            <IntlContext.Consumer>
                              {(context) => {
                                return (
                                  <div>
                                    {context.state.locale === "en" ? (
                                      <iframe
                                        src="https://teledoc.hicare.net:450/lv1/_agree/agree.all.en.php?ids=secession"
                                        width="100%"
                                        height="600px"
                                        style={{ border: "1px solid silver" }}
                                      />
                                    ) : (
                                      <iframe
                                        src="https://health.iot4health.co.kr/lv1/_agree/agree.all.php?ids=secession"
                                        width="100%"
                                        height="600px"
                                        style={{ border: "1px solid silver" }}
                                      />
                                    )}
                                  </div>
                                );
                              }}
                            </IntlContext.Consumer>
                          </div>
                          <FormGroup className="form-label-group mt-2">
                            <FormattedMessage id="checkall">
                              {(checkall) => (
                                <Checkbox
                                  color="primary"
                                  icon={<Check className="vx-icon" size={16} />}
                                  label={checkall}
                                  defaultChecked={false}
                                  onChange={this.handleChkWithdrawal}
                                />
                              )}
                            </FormattedMessage>
                          </FormGroup>

                          <div className="text-right">
                            <Button
                              size="lg"
                              color="primary"
                              type="button"
                              disabled={
                                this.state.checkwithdrawal === true
                                  ? false
                                  : true
                              }
                              onClick={this.checkModal}
                            >
                              <FormattedMessage id="회원탈퇴" />
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
export default connect(mapStateToProps)(Withdrawal);
