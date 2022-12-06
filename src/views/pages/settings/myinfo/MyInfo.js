import React from "react";
import {
  InputGroup,
  Form,
  FormGroup,
  Input,
  Button,
  CustomInput,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import "../../../../assets/scss/pages/authentication.scss";
import {
  putmyinfo,
  putmyinfonfile,
  putMyInfoNonFile,
} from "../../../../redux/actions/auth/registerActions";
import { connect } from "react-redux";
import axios from "axios";
import previmg from "../../../../assets/img/portrait/small/Sample_User_Icon.png";
import { saveMyinfo, saveImage } from "../../../../redux/actions/cookies";
import { FormattedMessage } from "react-intl";
import AES256 from "aes-everywhere";
import { SERVER_URL, SERVER_URL2, SERVER_URL_TEST } from "../../../../config";
import {
  encryptByPubKey,
  decryptByAES,
  AESKey,
} from "../../../../redux/actions/auth/cipherActions";
import { history } from "../../../../history";

class MyInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      birthday: "",
      gender: "",
      phonenumber: "",
      userid: props.user.login.values.loggedInUser.username,
      filename: "",
      file: "",
      medicalpart: props.cookiemyinfo.medicalpart,
      medicalable: props.cookiemyinfo.medicalable,
      medicaldesc: props.cookiemyinfo.medicaldesc,
      userdesc: props.cookiemyinfo.userdesc,
      previewURL: "",
      previewmodal: false,
      getfilepath: "",
      getfilename: "",
      phonenumtoggle: false,
      vfauth: "N",
      mdfphonenum: "",
      authnum: "",
    };
  }

  saveRe4 = (e) => {
    e.preventDefault();
    this.props.saveMyinfo(
      this.state.medicalpart,
      this.state.medicalable,
      this.state.medicaldesc,
      this.state.userdesc
    );
    alert("임시저장되었습니다.");
  };

  previewModal = (e) => {
    this.setState((prevState) => ({
      previewmodal: !prevState.previewmodal,
    }));
  };

  togglePhonenum = (e) => {
    this.setState((prevState) => ({
      phonenumtoggle: !prevState.phonenumtoggle,
    }));
  };

  postPhone = (e) => {
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    e.preventDefault();
    axios
      .post(`${SERVER_URL}/signup-sms`, {
        c_key: encryptedrsapkey,
        c_value: AES256.encrypt(
          JSON.stringify({
            mobile_num: this.state.mdfphonenum,
          }),
          AESKey
        ),
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === "200") {
          alert(response.data.message);
        } else {
          alert(response.data.message);
        }
      });
  };

  auth = (e) => {
    e.preventDefault();
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    let value = AES256.encrypt(
      JSON.stringify({
        mobile_num: this.state.mdfphonenum,
        auth_code: Number(this.state.authnum),
      }),
      AESKey
    );
    axios
      .get(`${SERVER_URL}/signup-sms`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === "200") {
          alert(response.data.message);
          this.setState({ vfauth: "Y" });
        } else {
          alert(response.data.message);
        }
      });
  };

  componentDidMount() {
    if (this.props.cookiemyinfo.medicalable === "") {
      let encryptedrsapkey = encryptByPubKey(
        this.props.cipher.rsapublickey.publickey
      );
      let value = AES256.encrypt(
        JSON.stringify({
          user_id: this.state.userid,
        }),
        AESKey
      );
      axios
        .get(`${SERVER_URL2}/doctor/account/user-info`, {
          params: {
            c_key: encryptedrsapkey,
            c_value: value,
          },
        })

        .then((response) => {
          console.log(response);
          if (response.data.status === "200") {
            let resdata = decryptByAES(response.data.data);

            if (resdata.GENDER === "1" || resdata.GENDER === "3") {
              this.setState({ gender: "M" });
            } else if (resdata.GENDER === "2" || resdata.GENDER === "4") {
              this.setState({ gender: "F" });
            } else {
              this.setState({ gender: "성별정보가 저장되어있지 않습니다." });
            }
            this.setState({
              name: resdata.F_NAME,
              phonenumber: resdata.MOBILE_NUM,
              birthday: resdata.BIRTH_DT,
              getfilepath: resdata.FILE_PATH,
              getfilename: resdata.FILE_NAME,
              medicalpart: resdata.MEDICAL_PART,
              medicalable: resdata.MEDICAL_ABLE,
              medicaldesc: resdata.MEDICAL_DESC,
              medicalnum: resdata.MEDICAL_NUM,
              userdesc: resdata.USER_DESC,
            });
          } else {
            alert("고객정보를 불러오지 못하였습니다.");
          }
        });
    }
  }

  handleFileOnChange = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    let filename = event.target.files[0].name;
    reader.onloadend = () => {
      this.setState({
        file: file,
        previewURL: reader.result,
        filename: filename,
      });
    };
    reader.readAsDataURL(file);
  };

  handleRegister = (e) => {
    e.preventDefault();
    if (this.state.vfauth === "Y") {
      if (this.state.filename === "") {
        this.props.putMyInfoNonFile(
          this.state.mdfphonenum,
          this.state.userid,
          this.state.medicalpart,
          this.state.medicalable,
          this.state.medicaldesc,
          this.state.medicalnum,
          this.state.userdesc
        );
        if (localStorage.getItem("firstyn") === "y") {
          history.push("/pages/modifyschedule");
        }
      } else {
        this.props.putmyinfonfile(
          this.state.mdfphonenum,
          this.state.userid,
          this.state.filename,
          this.state.file,
          this.state.medicalpart,
          this.state.medicalable,
          this.state.medicaldesc,
          this.state.medicalnum,
          this.state.userdesc
        );
        if (localStorage.getItem("firstyn") === "y") {
          history.push("/pages/modifyschedule");
        }
      }
    } else {
      if (this.state.filename === "") {
        this.props.putMyInfoNonFile(
          this.state.phonenumber,
          this.state.userid,
          this.state.medicalpart,
          this.state.medicalable,
          this.state.medicaldesc,
          this.state.medicalnum,
          this.state.userdesc
        );
        if (localStorage.getItem("firstyn") === "y") {
          history.push("/pages/modifyschedule");
        }
      } else {
        this.props.putmyinfo(
          this.state.phonenumber,
          this.state.userid,
          this.state.filename,
          this.state.file,
          this.state.medicalpart,
          this.state.medicalable,
          this.state.medicaldesc,
          this.state.medicalnum,
          this.state.userdesc
        );
        if (localStorage.getItem("firstyn") === "y") {
          history.push("/pages/modifyschedule");
        }
      }
      this.props.saveImage(this.state.previewURL);
    }
  };

  render() {
    let profile_preview = null;
    if (
      this.props.user.login.values.loggedInUser.file_path !== "" &&
      this.state.file === "" &&
      this.state.filename === ""
    ) {
      profile_preview = (
        <img
          width="150px"
          height="150px"
          src={
            "https://teledoc.hicare.net:546" +
            this.state.getfilepath +
            this.state.getfilename
          }
          className="dz-img"
          alt=""
        />
      );
    }
    // else if (this.props.user.login.values.loggedInUser.file_name!==this.props.user.login.values.loggedInUser.username+"-"+this.state.filename
    //   && this.state.file !== "" && this.state.filename !== ""){
    //   profile_preview =
    //     <img
    //       width="150px"
    //       height="150px"
    //       src={"https://teledoc.hicare.net:446/images/doc-img/"
    //           +this.props.user.login.values.loggedInUser.username+"-"+this.state.filename }
    //       className="dz-img"
    //       alt=""
    //     />
    // }
    else if (this.state.file !== "" && this.state.filename !== "") {
      profile_preview = (
        <img
          width="150px"
          height="150px"
          src={this.state.previewURL}
          className="dz-img"
          alt=""
        />
      );
    } else {
      profile_preview = (
        <img
          width="150px"
          height="150px"
          src={previmg}
          className="dz-img"
          style={{ borderRadius: "100%" }}
          alt=""
        />
      );
    }
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
                  <CardHeader className="pt-50">
                    <CardTitle>
                      <h3 className="text-bold-600">
                        <FormattedMessage id="개인정보" />
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="pt-1 pb-50">
                    <Row>
                      <Col lg="2" md="12"></Col>
                      <Col lg="8" md="12">
                        <div className="form-label-group d-flex">
                          <div className="col-2 align-self-center">
                            <b>
                              <FormattedMessage id="ID" />
                            </b>
                          </div>
                          <div className="col-3">{this.state.userid}</div>
                          <div className="col-1"></div>
                          <div className="col-1 align-self-center">
                            <b>
                              <FormattedMessage id="Name" />
                            </b>
                          </div>
                          <div className="align-self-center">
                            {this.state.name}
                          </div>
                        </div>
                        <div className="form-label-group d-flex">
                          <div className="col-2 align-self-center">
                            <b>
                              <FormattedMessage id="생년월일" />
                            </b>
                          </div>
                          <div className="col-3">{this.state.birthday}</div>
                          <div className="col-1"></div>
                          <div className="col-1 align-self-center">
                            <b>
                              <FormattedMessage id="성별" />
                            </b>
                          </div>
                          <div>{this.state.gender}</div>
                        </div>
                        <div className="form-label-group d-flex">
                          <div className="col-2 align-self-center">
                            <b>
                              <FormattedMessage id="License" />
                            </b>
                          </div>
                          <div className="col-3">{this.state.medicalnum}</div>
                        </div>
                        <div className="form-label-group d-flex">
                          <div className="col-2 align-self-center">
                            <b>
                              <FormattedMessage id="PH" />
                            </b>
                          </div>
                          <div className="col-2 align-self-center">
                            {this.state.phonenumber}
                          </div>

                          <Button
                            className="ml-1"
                            color="primary"
                            onClick={this.togglePhonenum}
                          >
                            {this.state.phonenumtoggle === false ? (
                              <FormattedMessage id="변경" />
                            ) : (
                              <FormattedMessage id="취소" />
                            )}
                          </Button>
                        </div>
                        {this.state.phonenumtoggle === false ? null : (
                          <div className="form-label-group d-flex">
                            <div className="col-2 align-self-center">
                              <b>
                                <FormattedMessage id="변경정보" />
                              </b>
                            </div>
                            <FormattedMessage id="enterchnagephone">
                              {(enterchnagephone) => (
                                <Input
                                  className="col-2"
                                  type="number"
                                  placeholder={enterchnagephone}
                                  required
                                  value={this.state.mdfphonenum}
                                  onChange={(e) =>
                                    this.setState({
                                      mdfphonenum: e.target.value,
                                    })
                                  }
                                />
                              )}
                            </FormattedMessage>
                            <Button
                              className="ml-1"
                              color="primary"
                              onClick={this.postPhone}
                            >
                              <FormattedMessage id="Verification" />
                            </Button>
                            <FormattedMessage id="enterverification">
                              {(enterverification) => (
                                <Input
                                  className="col-2 ml-1"
                                  type="number"
                                  placeholder={enterverification}
                                  required
                                  value={this.state.authnum}
                                  onChange={(e) =>
                                    this.setState({ authnum: e.target.value })
                                  }
                                />
                              )}
                            </FormattedMessage>
                            <Button
                              className="ml-1"
                              color="primary"
                              onClick={this.auth}
                            >
                              <FormattedMessage id="VerificationC" />
                            </Button>
                          </div>
                        )}
                        <Form action="/" onSubmit={this.handleRegister}>
                          <FormGroup className="form-label-group d-flex justify-content-between">
                            <div className="col-2">
                              <b>
                                <FormattedMessage id="Add Image" />
                                <span className="text-danger">
                                  <FormattedMessage id="Required" />
                                </span>
                              </b>
                            </div>
                            <InputGroup>
                              <CustomInput
                                className="col-11"
                                type="file"
                                accept="image/gif,image/jpeg,image/png"
                                id="exampleCustomFileBrowser"
                                name="customFile"
                                label="  "
                                onChange={this.handleFileOnChange}
                              />
                            </InputGroup>
                            <div>{profile_preview}</div>
                          </FormGroup>
                          <FormGroup className="form-label-group d-flex justify-content-between">
                            <div className="col-2 align-self-center">
                              <b>
                                <FormattedMessage id="Department" />
                                <span className="text-danger">
                                  <FormattedMessage id="Required" />
                                </span>
                              </b>
                            </div>
                            <Input
                              type="select"
                              name="select"
                              value={this.state.medicalpart}
                              onChange={(e) =>
                                this.setState({ medicalpart: e.target.value })
                              }
                            >
                              <FormattedMessage id="familymedicine">
                                {(familymedicine) => (
                                  <option value="01">{familymedicine}</option>
                                )}
                              </FormattedMessage>
                              <FormattedMessage id="internalmedicine">
                                {(internalmedicine) => (
                                  <option value="02">{internalmedicine}</option>
                                )}
                              </FormattedMessage>
                              <FormattedMessage id="gynecologyobsterics">
                                {(gynecologyobsterics) => (
                                  <option value="03">
                                    {gynecologyobsterics}
                                  </option>
                                )}
                              </FormattedMessage>
                              <FormattedMessage id="dermatology">
                                {(dermatology) => (
                                  <option value="04">{dermatology}</option>
                                )}
                              </FormattedMessage>
                              <FormattedMessage id="urology">
                                {(urology) => (
                                  <option value="05">{urology}</option>
                                )}
                              </FormattedMessage>
                              <FormattedMessage id="etc">
                                {(etc) => <option value="99">{etc}</option>}
                              </FormattedMessage>
                            </Input>
                          </FormGroup>

                          <FormGroup className="form-label-group d-flex justify-content-between">
                            <div className="col-2 align-self-center">
                              <b>
                                <FormattedMessage id="Specialty" />
                                <span className="text-danger">
                                  <FormattedMessage id="Required" />
                                </span>
                              </b>
                            </div>
                            <InputGroup>
                              <FormattedMessage id="Text">
                                {(Text) => (
                                  <Input
                                    type="text"
                                    placeholder={Text}
                                    required
                                    value={this.state.medicalable}
                                    onChange={(e) =>
                                      this.setState({
                                        medicalable: e.target.value,
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
                                  <FormattedMessage id="EMPE" />
                                  <span className="text-danger">
                                    <FormattedMessage id="Required" />
                                  </span>
                                </b>
                              </div>
                              <InputGroup>
                                <FormattedMessage id="Text">
                                  {(Text) => (
                                    <Input
                                      type="textarea"
                                      placeholder={Text}
                                      required
                                      rows="3"
                                      value={this.state.medicaldesc}
                                      onChange={(e) =>
                                        this.setState({
                                          medicaldesc: e.target.value,
                                        })
                                      }
                                    />
                                  )}
                                </FormattedMessage>
                              </InputGroup>
                            </div>
                            <small
                              className={`counter-value float-right ${
                                this.state.medicaldesc.length > 400
                                  ? "bg-danger"
                                  : ""
                              }`}
                            >
                              {`${this.state.medicaldesc.length}/400`}
                            </small>
                          </FormGroup>

                          <FormGroup className="form-label-group pt-1">
                            <div className="d-flex justify-content-between">
                              <div className="col-2 align-self-start">
                                <b>
                                  <FormattedMessage id="Introduction" />
                                </b>
                              </div>
                              <InputGroup>
                                <FormattedMessage id="Text">
                                  {(Text) => (
                                    <Input
                                      type="textarea"
                                      placeholder={Text}
                                      required
                                      rows="3"
                                      value={this.state.userdesc}
                                      onChange={(e) =>
                                        this.setState({
                                          userdesc: e.target.value,
                                        })
                                      }
                                    />
                                  )}
                                </FormattedMessage>
                              </InputGroup>
                            </div>
                            <small
                              className={`counter-value float-right ${
                                this.state.userdesc.length > 400
                                  ? "bg-danger"
                                  : ""
                              }`}
                            >
                              {`${this.state.userdesc.length}/400`}
                            </small>
                          </FormGroup>

                          <div className="text-right">
                            <Button
                              className="mr-1"
                              outline
                              color="primary"
                              type="button"
                              onClick={this.saveRe4}
                            >
                              <FormattedMessage id="Drafts" />
                            </Button>
                            <Button
                              className="mr-1"
                              outline
                              color="primary"
                              type="button"
                              onClick={this.previewModal}
                            >
                              <FormattedMessage id="Preview" />
                            </Button>
                            <Button color="primary" type="submit">
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
        <Modal
          isOpen={this.state.previewmodal}
          toggle={this.previewModal}
          className="modal-dialog-centered modal-sm"
        >
          <ModalBody className="mx-1">
            <Row className="d-flex justify-content-center">
              {profile_preview}
            </Row>
            <Row className="d-flex justify-content-center">
              <h5 className="text-bold-600">{this.state.name}</h5>
            </Row>
            <Row className="d-flex justify-content-center">
              {this.state.medicalpart === "01" ? (
                <FormattedMessage id="가정의학과" />
              ) : this.state.medicalpart === "02" ? (
                <FormattedMessage id="내과" />
              ) : this.state.medicalpart === "03" ? (
                <FormattedMessage id="산부인과" />
              ) : this.state.medicalpart === "04" ? (
                <FormattedMessage id="피부과" />
              ) : this.state.medicalpart === "05" ? (
                <FormattedMessage id="비뇨기과" />
              ) : this.state.medicalpart === "99" ? (
                <FormattedMessage id="기타" />
              ) : null}
            </Row>
            <Card className="mt-1">
              <CardBody className="pt-1">
                <Row>
                  <h5 className="text-bold-400 ">
                    <FormattedMessage id="Specialty" />
                  </h5>
                </Row>
                <Row>{this.state.medicalable}</Row>
              </CardBody>
            </Card>
            <Card className="mt-1">
              <CardBody className="pt-1">
                <Row>
                  <h5 className="text-bold-400 ">
                    <FormattedMessage id="EMPE" />
                  </h5>
                </Row>
                <Row>
                  <pre>{this.state.medicaldesc}</pre>
                </Row>
              </CardBody>
            </Card>
            <Card className="mt-1">
              <CardBody className="pt-1">
                <Row>
                  <h5 className="text-bold-400 ">
                    <FormattedMessage id="Introduction" />
                  </h5>
                </Row>
                <Row>
                  <pre>{this.state.userdesc}</pre>
                </Row>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.previewModal}>
              확인
            </Button>
          </ModalFooter>
        </Modal>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cipher: state.auth.cipher,
    user: state.auth,
    cookiemyinfo: state.cookies.myinfo,
  };
};
export default connect(mapStateToProps, {
  putmyinfo,
  putmyinfonfile,
  putMyInfoNonFile,
  saveMyinfo,
  saveImage,
})(MyInfo);
