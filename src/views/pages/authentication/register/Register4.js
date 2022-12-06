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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "../../../../assets/scss/pages/authentication.scss";
import { saveRegister4 } from "../../../../redux/actions/cookies";
import { connect } from "react-redux";
import { history } from "../../../../history";
import axios from "axios";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import HicareLogo from "../../../../assets/img/logo/logo1.png";
import { FormattedMessage } from "react-intl";
import previewimage from "../../../../assets/img/elements/mypage_profile_de.png";

//  '01' : 가정의학과, '02' : 내과
//  '03' : 산부인과, '04' : 피부과
//  '05' : 비뇨기과, '99' : 기타
// const medicalpartOptions = [
//   { value: "01", label: "가정의학과" },
//   { value: "02", label: "내과" },
//   { value: "03", label: "산부인과" },
//   { value: "04", label: "피부과" },
//   { value: "05", label: "비뇨기과" },
//   { value: "99", label: "기타"}
// ]

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // userid: "king@king",
      // name: "강주형",
      userid: props.user.register.values.registeruser,
      name: props.user.register.values.registername,
      filename: "",
      file: "",
      medicalpart: props.cookiere4.medicalpart,
      medicalable: props.cookiere4.medicalable,
      medicaldesc: props.cookiere4.medicaldesc,
      medicalnum: props.cookiere4.medicalnum,
      userdesc: props.cookiere4.userdesc,
      previewURL: props.cookiere4.previewURL,
      phonenum: props.user.register.values.phone,
      registermodal: false,
      previewmodal: false,
    };
  }

  handleFileOnChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    let filename = e.target.files[0].name;
    reader.onloadend = () => {
      this.setState({
        file: file,
        previewURL: reader.result,
        filename: filename,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  handleRegister = (e) => {
    e.preventDefault();
    let regexp = /^[0-9]*$/;
    if (regexp.test(this.state.medicalnum)) {
      this.register4(
        this.state.userid,
        this.state.filename,
        this.state.file,
        this.state.medicalpart,
        this.state.medicalable,
        this.state.medicaldesc,
        this.state.medicalnum,
        this.state.userdesc,
        this.state.phonenum
      );
    } else {
      alert("의사 면허번호는 숫자로만 입력하여 주십시오");
    }
  };

  saveRe4 = (e) => {
    e.preventDefault();
    this.props.saveRegister4(
      this.state.medicalpart,
      this.state.medicalable,
      this.state.medicaldesc,
      this.state.medicalnum,
      this.state.userdesc,
      this.state.previewURL
    );
    alert("의사정보가 저장되었습니다.");
  };

  register4 = (
    userid,
    filename,
    file,
    medicalpart,
    medicalable,
    medicaldesc,
    medicalnum,
    userdesc,
    phonenum
  ) => {
    let data = new FormData();
    data.append("user_id", userid);
    data.append("file_name", file);
    data.append("medical_part", medicalpart);
    data.append("medical_able", medicalable);
    data.append("medical_desc", medicaldesc);
    data.append("medical_num", medicalnum);
    data.append("user_desc", userdesc);
    data.append("mobile_num", phonenum);

    axios
      .put("https://teledoc.hicare.net:446/v1/doctor/account/user-info", data)
      .then((response) => {
        let register4status;

        if (response.data.status === "200") {
          register4status = response.data.status;
          this.registerModal();
        } else {
          alert(response.data.message);
        }
      });
  };

  viewlog = (e) => {
    e.preventDefault();
    console.log(this.state);
  };

  registerModal = () => {
    this.setState((prevState) => ({
      registermodal: !prevState.registermodal,
    }));
  };

  goRegisterComplete = (e) => {
    e.preventDefault();
    history.push("/schedule");
  };

  previewModal = (e) => {
    this.setState((prevState) => ({
      previewmodal: !prevState.previewmodal,
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
    let profile_preview = null;
    if (this.state.file !== "") {
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
          src={previewimage}
          className="dz-img"
          // style={{borderRadius:"50px"}}
          alt=""
        />
      );
    }
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
            <Card className="shadow-none rounded-0 mb-0 w-100">
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
              <Row className="m-0 ">
                <Col lg="3" md="12"></Col>
                <Col lg="6" md="12">
                  <Card className="rounded-0 mb-0 p-2">
                    <CardHeader className="pb-1 pt-50">
                      <CardTitle>
                        <h4 className="text-bold-600">
                          <FormattedMessage id="PI" />
                        </h4>
                      </CardTitle>
                    </CardHeader>
                    <CardBody className="pt-1 pb-50">
                      <Form action="/" onSubmit={this.handleRegister}>
                        <FormGroup className="form-label-group">
                          <Row className="pl-1">
                            <Col lg="2" md="12" className="align-self-start">
                              <b>
                                <FormattedMessage id="Add Image" />
                                <span className="text-danger">
                                  <FormattedMessage id="Required" />
                                </span>
                              </b>
                            </Col>
                            <Col lg="7" md="12" className="p-0 m-0">
                              <InputGroup>
                                <CustomInput
                                  type="file"
                                  accept="image/gif,image/jpeg,image/png"
                                  id="exampleCustomFileBrowser"
                                  name="customFile"
                                  onChange={this.handleFileOnChange}
                                />
                              </InputGroup>
                            </Col>
                            <Col lg="2" md="12" className="text-left">
                              {profile_preview}
                            </Col>
                          </Row>
                        </FormGroup>
                        <FormGroup className="form-label-group d-flex justify-content-between no-gutters">
                          <div className="col-2 align-self-center">
                            <b className="ml-1">
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
                          {/* 차후 적용시킬 select 
                      <Col>
                        <Select
                          classNamePrefix="select"
                          defaultValue={medicalpartOptions[0]}
                          name="loading"
                          options={medicalpartOptions}
                          // isLoading={true}
                        />
                      </Col>
                       */}
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
                              <FormattedMessage id="EnterSpecialty">
                                {(EnterSpecialty) => (
                                  <Input
                                    maxLength="400"
                                    type="textarea"
                                    placeholder={EnterSpecialty}
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
                          {/* <small
                        className={`counter-value float-right ${
                          this.state.medicaldesc.length > 400 ? "bg-danger" : ""
                        }`}
                      >
                        {`${this.state.medicaldesc.length}/400`}
                      </small> */}
                        </FormGroup>

                        <FormGroup className="form-label-group pt-1">
                          <div className="d-flex justify-content-between">
                            <div className="col-2 align-self-start">
                              <b>
                                <FormattedMessage id="Introduction" />
                                <span className="text-danger">
                                  <FormattedMessage id="Required" />
                                </span>
                              </b>
                            </div>
                            <InputGroup>
                              <FormattedMessage id="Text">
                                {(Text) => (
                                  <Input
                                    maxLength="400"
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
                          {/* <small
                        className={`counter-value float-right ${
                          this.state.userdesc.length > 400 ? "bg-danger" : ""
                        }`}
                      >
                        {`${this.state.userdesc.length}/400`}
                      </small> */}
                        </FormGroup>

                        <FormGroup className="form-label-group d-flex justify-content-between pt-1">
                          <div className="col-2 align-self-center">
                            <b>
                              <FormattedMessage id="License" />
                              <br />
                              <span className="text-danger">
                                <FormattedMessage id="Required" />
                              </span>
                            </b>
                          </div>
                          <InputGroup>
                            <FormattedMessage id="EnterDocLicense">
                              {(EnterDocLicense) => (
                                <Input
                                  type="number"
                                  maxLength="5"
                                  placeholder={EnterDocLicense}
                                  required
                                  value={this.state.medicalnum}
                                  onInput={this.maxLengthCheck}
                                  onChange={(e) =>
                                    this.setState({
                                      medicalnum: e.target.value,
                                    })
                                  }
                                />
                              )}
                            </FormattedMessage>
                          </InputGroup>
                        </FormGroup>

                        <div className="col-12 d-flex justify-content-between mt-5  pr-0">
                          <Button
                            outline
                            color="dark"
                            type="button"
                            onClick={() => {
                              history.push("/pages/register3");
                            }}
                          >
                            <FormattedMessage id="Previous" />
                          </Button>
                          <Button
                            outline
                            color="dark"
                            type="button"
                            onClick={this.saveRe4}
                          >
                            <FormattedMessage id="Drafts" />
                          </Button>
                          <Button
                            outline
                            color="dark"
                            type="button"
                            onClick={this.previewModal}
                          >
                            <FormattedMessage id="Preview" />
                          </Button>
                          <Button color="primary" type="submit">
                            <FormattedMessage id="AtA" />
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
            isOpen={this.state.registermodal}
            toggle={this.registerModal}
            className="modal-dialog-centered modal-sm"
          >
            <ModalHeader toggle={this.registerModal}></ModalHeader>
            <ModalBody>진료승인을 요청하였습니다.</ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.goRegisterComplete}>
                확인
              </Button>{" "}
            </ModalFooter>
          </Modal>

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
      </PerfectScrollbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    cookiere4: state.cookies.register4,
  };
};
export default connect(mapStateToProps, { saveRegister4 })(Register);
