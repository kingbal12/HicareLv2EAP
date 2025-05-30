import React from "react";
import {
  CardBody,
  FormGroup,
  Form,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Select from "react-select";
import { history } from "../../../../history";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import AES256 from "aes-everywhere";
import { SERVER_URL2 } from "../../../../config";
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

class FindId extends React.Component {
  state = {
    f_name: "",
    l_name: "",
    bt_date: "",
    nationalNum: "82",
    phone: "",
    docnum: "",
    modal: false,
    modalmsg: "",
    nomodal: false,
  };

  handleLogin = (e) => {
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    let value = AES256.encrypt(
      JSON.stringify({
        f_name: this.state.f_name,
        l_name: this.state.l_name,
        birth_dt: this.state.bt_date,
        national_num: this.state.nationalNum,
        mobile_num: this.state.phone,
        medical_num: this.state.docnum,
      }),
      AESKey
    );
    e.preventDefault();
    axios
      .get(`${SERVER_URL2}/doctor/account/user-id`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let resdata;
        try {
          resdata = decryptByAES(response.data.data);
        } catch (error) {
          this.setState({
            nomodal: true,
          });
        }

        console.log(resdata);
        if (response.data.status === "200") {
          this.setState({
            modal: true,
            modalmsg: resdata.USER_ID,
          });
        } else {
          this.setState({
            nomodal: true,
          });
        }
      });
  };

  findidModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  noModal = () => {
    this.setState((prevState) => ({
      nomodal: !prevState.nomodal,
    }));
  };

  go = (e) => {
    e.preventDefault();
    this.noModal();
    history.push("/pages/register1");
  };

  render() {
    return (
      <React.Fragment>
        <CardBody className="pt-1">
          <Form action="/" onSubmit={this.handleLogin}>
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
            <div className="d-flex justify-content-center">
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
        <Modal
          isOpen={this.state.modal}
          toggle={this.findidModal}
          className="modal-dialog-centered modal-sm"
        >
          <ModalHeader toggle={this.findidModal}></ModalHeader>
          <ModalBody>
            <FormattedMessage id="사용중인 아이디1" /> {this.state.modalmsg}{" "}
            <FormattedMessage id="사용중인 아이디2" />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.findidModal}>
              <FormattedMessage id="확인" />
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.nomodal}
          toggle={this.noModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={this.noModal}></ModalHeader>
          <ModalBody>
            <FormattedMessage id="아이디없음1" />
            <br />
            {/* <FormattedMessage id="아이디없음2"/> */}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.noModal}>
              {/* <FormattedMessage id="회원가입 시작"/> */}
              <FormattedMessage id="확인" />
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cipher: state.auth.cipher,
  };
};
export default connect(mapStateToProps)(FindId);
