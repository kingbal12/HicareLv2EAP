import React from "react";
import {
  CardBody,
  FormGroup,
  Form,
  Input,
  Button,
  Modal,
  Row,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Select from "react-select";
import axios from "axios";
import Radio from "../../../../components/@vuexy/radio/RadioVuexy";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import AES256 from "aes-everywhere";
import { SERVER_URL2 } from "../../../../config";
import { history } from "../../../../history";
import {
  encryptByPubKey,
  decryptByAES,
  AESKey,
} from "../../../../redux/actions/auth/cipherActions";
import "../../../../assets/scss/pages/authentication.scss";

const colourOptions = [
  {
    value: <FormattedMessage id="privmem" />,
    label: <FormattedMessage id="privmem" />,
  },
];

class FindPw extends React.Component {
  state = {
    userid: "",
    f_name: "",
    l_name: "",
    bt_date: "",
    nationalNum: "82",
    phone: "",
    docnum: "",
    modal: false,
    verifymodal: false,
    useridchecked: false,
    emailchecked: true,
    email: "",
    emaillabel: "",
    modalmsg: "",
  };

  searchemail = (e) => {
    e.preventDefault();
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    axios
      .get(`${SERVER_URL2}/doctor/account/password`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: AES256.encrypt(
            JSON.stringify({
              user_id: this.state.userid,
              f_name: this.state.f_name,
              l_name: this.state.l_name,
              birth_dt: this.state.bt_date,
              national_num: this.state.nationalNum,
              mobile_num: this.state.phone,
              medical_num: this.state.docnum,
            }),
            AESKey
          ),
        },
      })
      .then((response) => {
        let resdata = decryptByAES(response.data.data);
        console.log(response);
        if (response.data.status === "200") {
          this.setState({
            email: resdata.EMAIL,
            emaillabel: resdata.EMAIL,
          });
          if (resdata.USER_ID === resdata.EMAIL) {
            let value = AES256.encrypt(
              JSON.stringify({
                user_id: this.state.userid,
                email: this.state.email,
                f_name: this.state.f_name,
                l_name: this.state.l_name,
                birth_dt: this.state.bt_date,
                national_num: this.state.nationalNum,
                mobile_num: this.state.phone,
                medical_num: this.state.docnum,
              }),
              AESKey
            );
            axios
              .post(
                "https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php",
                {
                  url: `${SERVER_URL2}/doctor/account/password`,
                  c_key: encryptedrsapkey,
                  c_value: value,
                  method: "POST",
                }
              )

              .then((response) => {
                if (response.data.status === "200") {
                  this.setState({
                    modal: true,
                    modalmsg: <FormattedMessage id="비밀번호 전송 성공" />,
                  });
                } else {
                  this.setState({
                    modal: true,
                    modalmsg: <FormattedMessage id="비밀번호 전송 실패" />,
                  });
                }
              });
          } else {
            this.setState({
              userid: resdata.USER_ID,
              email: resdata.EMAIL,
              emaillabel: resdata.EMAIL,
              verifymodal: true,
            });
          }
        } else {
          this.setState({
            modal: true,
            modalmsg: response.data.message,
          });
        }
      });
  };

  findEmailModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  verifyModal = () => {
    this.setState((prevState) => ({
      verifymodal: !prevState.verifymodal,
    }));
    console.log(this.state);
  };

  onSiteChanged = (e) => {
    this.setState({
      site: e.currentTarget.value,
    });
  };

  onAddressChanged = (e) => {
    this.setState({
      address: e.currentTarget.value,
    });
  };

  changePassword = () => {
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    let value = AES256.encrypt(
      JSON.stringify({
        user_id: this.state.userid,
        email: this.state.email,
        f_name: this.state.f_name,
        l_name: this.state.l_name,
        birth_dt: this.state.bt_date,
        national_num: this.state.nationalNum,
        mobile_num: this.state.phone,
        medical_num: this.state.docnum,
      }),
      AESKey
    );
    axios
      .post("https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php", {
        url: `${SERVER_URL2}/doctor/account/password`,
        c_key: encryptedrsapkey,
        c_value: value,
        method: "POST",
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === "200") {
          this.setState({
            modal: true,
            modalmsg: <FormattedMessage id="선택 비밀번호 전송 성공" />,
          });
        } else {
          this.setState({
            modal: true,
            modalmsg: <FormattedMessage id="비밀번호 전송 실패" />,
          });
        }
      });

    this.setState((prevState) => ({
      verifymodal: !prevState.verifymodal,
    }));
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          isOpen={this.state.modal}
          toggle={this.findEmailModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={this.findEmailModal}></ModalHeader>
          <ModalBody>{this.state.modalmsg}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.findEmailModal}>
              <FormattedMessage id="확인" />
            </Button>{" "}
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.verifymodal}
          toggle={this.verifyModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={this.verifyModal}>
            <FormattedMessage id="이메일 선택" />
          </ModalHeader>
          <ModalBody>
            <Row className="d-flex">
              <h6 className="align-self-center ml-1">
                <FormattedMessage id="ID" />:{" "}
              </h6>
              <Radio
                label={this.state.userid}
                defaultChecked={
                  this.state.userid === "" || this.state.userid ? true : false
                }
                name="exampleRadioSizes"
                value={this.state.userid}
                onChange={(e) => this.setState({ email: e.target.value })}
                color="primary"
                // defaultChecked={this.state.useridchecked}
                className="ml-1"
              />
            </Row>

            <Row className="d-flex">
              <h6 className="align-self-center ml-1">
                <FormattedMessage id="보안이메일" />:{" "}
              </h6>
              <Radio
                label={this.state.emaillabel}
                color="primary"
                value={this.state.email}
                defaultChecked={this.state.emailchecked}
                onChange={(e) => this.setState({ email: e.target.value })}
                name="exampleRadioSizes"
                className="ml-1"
              />
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.changePassword}>
              확인
            </Button>{" "}
          </ModalFooter>
        </Modal>
        <CardBody className="pt-1">
          <Form action="/" onSubmit={this.searchemail}>
            <FormGroup className="form-label-group position-relative">
              <Select
                className="React"
                classNamePrefix="select"
                defaultValue={colourOptions[0]}
                name="color"
                options={colourOptions}
              />
            </FormGroup>
            <FormGroup className="form-label-group position-relative">
              <FormattedMessage id="EnterID">
                {(EnterID) => (
                  <Input
                    placeholder={EnterID}
                    value={this.state.userid}
                    onChange={(e) => this.setState({ userid: e.target.value })}
                    required
                  />
                )}
              </FormattedMessage>
            </FormGroup>
            <FormGroup className="form-label-group position-relative">
              <FormattedMessage id="EnterFirstName">
                {(EnterFirstName) => (
                  <Input
                    placeholder={EnterFirstName}
                    value={this.state.f_name}
                    onChange={(e) => this.setState({ f_name: e.target.value })}
                    required
                  />
                )}
              </FormattedMessage>
            </FormGroup>
            <FormGroup className="form-label-group position-relative">
              <FormattedMessage id="EnterLastName">
                {(EnterLastName) => (
                  <Input
                    placeholder={EnterLastName}
                    value={this.state.l_name}
                    onChange={(e) => this.setState({ l_name: e.target.value })}
                    required
                  />
                )}
              </FormattedMessage>
            </FormGroup>
            <FormGroup className="form-label-group position-relative">
              <FormattedMessage id="EnterDOB">
                {(EnterDOB) => (
                  <Input
                    onInput={(e) => {
                      if (e.target.value.length > e.target.maxLength)
                        e.target.value = e.target.value.slice(
                          0,
                          e.target.maxLength
                        );
                    }}
                    maxLength={6}
                    type="number"
                    onKeyDown={(e) =>
                      e.keyCode === 69 || e.keyCode === 189
                        ? e.preventDefault()
                        : true
                    }
                    placeholder={EnterDOB}
                    value={this.state.bt_date}
                    onChange={(e) => this.setState({ bt_date: e.target.value })}
                    required
                  />
                )}
              </FormattedMessage>
            </FormGroup>
            <FormGroup>
              <Input
                type="select"
                name="select"
                id="select"
                defaultValue={this.state.nationalNum}
                onChange={(e) => this.setState({ nationalNum: e.target.value })}
              >
                <option value="82">대한민국 (+82)</option>
                <option value="976">몽골 (+976)</option>
                <option value="1">미국 (+1)</option>
                <option value="39">이탈리아 (+39)</option>
                <option value="62">인도네시아 (+62)</option>
                <option value="1">캐나다 (+1)</option>
              </Input>
            </FormGroup>
            <FormGroup className="form-label-group position-relative">
              <FormattedMessage id="EnterPhonenum">
                {(EnterPhonenum) => (
                  <Input
                    onInput={(e) => {
                      if (e.target.value.length > e.target.maxLength)
                        e.target.value = e.target.value.slice(
                          0,
                          e.target.maxLength
                        );
                    }}
                    maxLength={30}
                    type="number"
                    onKeyDown={(e) =>
                      e.keyCode === 69 || e.keyCode === 189
                        ? e.preventDefault()
                        : true
                    }
                    placeholder={EnterPhonenum}
                    value={this.state.phone}
                    onChange={(e) => this.setState({ phone: e.target.value })}
                    required
                  />
                )}
              </FormattedMessage>
            </FormGroup>
            <FormGroup className="form-label-group position-relative">
              <FormattedMessage id="EnterLicense">
                {(EnterLicense) => (
                  <Input
                    onInput={(e) => {
                      if (e.target.value.length > e.target.maxLength)
                        e.target.value = e.target.value.slice(
                          0,
                          e.target.maxLength
                        );
                    }}
                    maxLength={20}
                    type="number"
                    onKeyDown={(e) =>
                      e.keyCode === 69 || e.keyCode === 189
                        ? e.preventDefault()
                        : true
                    }
                    placeholder={EnterLicense}
                    value={this.state.docnum}
                    onChange={(e) => this.setState({ docnum: e.target.value })}
                    required
                  />
                )}
              </FormattedMessage>
            </FormGroup>
            <div className="d-flex justify-content-center pt-0">
              <Button color="primary" type="submit" size="lg" block>
                <FormattedMessage id="Continue" />
              </Button>
            </div>
            <div className="d-flex justify-content-center pt-1">
              <button
                className="cancelbutton"
                onClick={() => history.push("/")}
                size="lg"
                block
              >
                <FormattedMessage className="text-primary" id="Cancel" />
              </button>
            </div>
          </Form>
        </CardBody>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cipher: state.auth.cipher,
  };
};
export default connect(mapStateToProps)(FindPw);
