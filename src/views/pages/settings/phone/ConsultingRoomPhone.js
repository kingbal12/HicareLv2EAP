import React from "react";
import {
  FormGroup,
  InputGroup,
  Input,
  CustomInput,
  Button,
  Card,
  CardTitle,
  CardBody,
  Row,
  Col,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  mPCL,
  resetVitalData,
  postMDNoteData,
  postPrescriptionData,
  postPayData,
  putStateComplete,
} from "../../../../redux/actions/data-list";
import axios from "axios";
import { saveCookieConsult } from "../../../../redux/actions/cookies/";
import { Check } from "react-feather";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { history } from "../../../../history";
import "../../../../assets/scss/pages/authentication.scss";
import { connect } from "react-redux";
import { Fragment } from "react";
import previmg from "../../../../assets/img/dashboard/ID13_11_file.png";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import "../../../../assets/scss/plugins/extensions/recharts.scss";
import moment from "moment";
import dot from "../../../../assets/img/dashboard/ID13_11_icon.png";
import VitalDataM from "../../../ui-elements/patient-list/PatientInfo/VitalDataM";
import PastConsultList from "../../../ui-elements/patient-list/PatientInfo/DataListConfigMP";
import queryString from "query-string";
import Countdown from "react-countdown";
import { FormattedMessage } from "react-intl";

class Cslist extends React.Component {
  render() {
    return (
      <tr>
        <th className="text-center">
          {this.props.row.PART_NAME} / {this.props.row.F_NAME}
        </th>
        <th className="text-center">{this.props.row.NOTE_DX}</th>
        <th className="text-center">
          {this.props.row.APPOINT_TIME.substring(0, 10)}
        </th>
      </tr>
    );
  }
}

class PatientInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cc: "",
      diagnosis: "",
      txrx: "",
      recommendation: "",
      pcode: props.pharmacy.P_CODE,
      pname: props.pharmacy.P_NAME,
      paddress: props.pharmacy.P_ADDRESS,
      telnum: props.pharmacy.TEL_NUM,
      faxnum: props.pharmacy.FAX_NUM,
      filename: "",
      file: "",
      paypatient: "",
      mdnotemodal: false,
      paytotal: 0,
      paypatient: 0,
      pharmacy: false,
      App: false,
      viewfilemodal: false,
      viewfilemodal2: false,
      vitaldatamodal: false,
      gohomemodal: false,
      pclmodal: false,
      disableswitch: false,
    };
  }

  componentDidMount() {
    axios
      .get("https://teledoc.hicare.net:446/v1/doctor/treatment/history", {
        params: {
          user_id: this.props.user.login.values.loggedInUser.username,
          appoint_num: this.props.appo.APPOINT_NUM,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        let history = response.data.data;
        if (response.data.status === "200") {
          console.log("history succes");

          this.setState({
            cc: history.NOTE_CC,
            diagnosis: history.NOTE_DX,
            txrx: history.NOTE_RX,
            recommendation: history.NOTE_VITAL,
            paytotal: history.PAY_TOTAL,
            paypatient: history.PAY_TOTAL,
          });
          axios
            .get(
              "https://teledoc.hicare.net:446/v1/doctor/treatment/involve-state",
              {
                params: {
                  user_id: this.props.user.login.values.loggedInUser.username,
                  appoint_num: this.props.appo.APPOINT_NUM,
                },
              }
            )
            .then((response) => {
              console.log(response.data.data.STATE_DOC, "docstate");
              if (response.data.data.STATE_DOC === "2") {
                if (
                  history.NOTE_CC !== "" ||
                  history.NOTE_DX !== "" ||
                  history.NOTE_CC !== "" ||
                  history.NOTE_RX !== "" ||
                  history.NOTE_VITAL !== "" ||
                  history.RX_NAME !== "" ||
                  history.PAY_TOTAL !== 0
                ) {
                  this.setState({
                    disableswitch: true,
                  });
                }
              } else {
              }
            })
            .catch((err) => console.log(err));
        } else {
          alert(response.data.message);
        }
      })

      .catch((err) => console.log(err));
  }

  viewFileModal = () => {
    this.setState((prevState) => ({
      viewfilemodal: !prevState.viewfilemodal,
    }));
  };

  viewFileModal2 = () => {
    this.setState((prevState) => ({
      viewfilemodal2: !prevState.viewfilemodal2,
    }));
  };

  goPastConsultList(pid) {
    this.props.mPCL(pid);
    this.pclModal();
  }

  pclModal = () => {
    this.setState((prevState) => ({
      pclmodal: !prevState.pclmodal,
    }));
  };

  goVitalData = (e) => {
    e.preventDefault();
    this.vitaldataModal();
  };

  vitaldataModal = () => {
    this.setState((prevState) => ({
      vitaldatamodal: !prevState.vitaldatamodal,
    }));
  };

  startconsult = (e) => {
    e.preventDefault();
    alert("전화진료를 시작합니다.");
  };

  mdNoteModal = () => {
    this.setState((prevState) => ({
      mdnotemodal: !prevState.mdnotemodal,
    }));
  };

  postMdNote = () => {
    alert("수정이 불가하오니 다시 한번 확인해주세요");
    if (
      this.state.cc === "" ||
      this.state.diagnosis === "" ||
      this.state.txrx === "" ||
      this.state.recommendation === "" ||
      this.state.filename === "" ||
      this.state.filename === null ||
      this.state.filename === undefined
    ) {
      alert("tx & rx에 공란이 있습니다 다시 한번 확인해주세요");
    } else {
      this.props.postMDNoteData(
        this.props.user.login.values.loggedInUser.username,
        this.props.appo.APPOINT_NUM,
        this.state.cc,
        this.state.diagnosis,
        this.state.txrx,
        this.state.recommendation,
        this.props.cipher.rsapublickey.publickey
      );

      this.postPrescription();
    }
  };

  goHome = (e) => {
    e.preventDefault();
    this.goHomeModal();
  };

  goHomeModal = () => {
    this.setState((prevState) => ({
      gohomemodal: !prevState.gohomemodal,
    }));
  };

  pushGoHome = () => {
    this.props.putStateComplete(
      this.props.user.login.values.loggedInUser.username,
      this.props.appo.APPOINT_NUM,
      this.props.cipher.rsapublickey.publickey
    );
    history.push("/analyticsDashboard");
  };

  presModal = () => {
    this.setState((prevState) => ({
      presmodal: !prevState.presmodal,
    }));
  };

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

  postPrescription = () => {
    this.props.postPrescriptionData(
      this.props.user.login.values.loggedInUser.username,
      this.props.appo.APPOINT_NUM,
      this.state.filename,
      this.state.file
    );

    this.setState((prevState) => ({
      mdnotemodal: !prevState.mdnotemodal,
    }));
  };

  setpharmacy = () => {
    this.setState((prevState) => ({
      pharmacy: !prevState.pharmacy,
    }));
  };

  setApp = () => {
    this.setState((prevState) => ({
      App: !prevState.App,
    }));
  };

  payModal = () => {
    this.setState((prevState) => ({
      paymodal: !prevState.paymodal,
    }));
  };

  postPayment = () => {
    if (this.state.paypatient === 0 || this.state.paypatient >= 1000) {
      this.props.postPayData(
        this.props.user.login.values.loggedInUser.username,
        this.props.appo.APPOINT_NUM,
        this.state.paypatient,
        this.state.paypatient,
        this.props.cipher.rsapublickey.publickey
      );

      this.setState((prevState) => ({
        paymodal: !prevState.paymodal,
      }));
    } else {
      alert("금액은 0원 이나 1000원 이상으로 입력하십시오.");
    }
  };

  parentFunction = (data) => {
    this.setState({ onsubscribe: data });
  };

  Completionist = () => (
    <span>
      <h5 className="text-primary" style={{ paddingTop: "0.2rem" }}>
        0
      </h5>
    </span>
  );
  Completephone = () => (
    <span>
      <h5 className="text-primary" style={{ marginTop: "1px" }}>
        <FormattedMessage id="진료시간종료" />
      </h5>
    </span>
  );

  render() {
    let file_preview = null;

    {
      this.props.appo === null ||
      this.props.appo.FILE_NAME === "" ||
      this.props.appo.FILE_NAME === "blob"
        ? (file_preview = <img src={previmg} className="dz-img" alt="" />)
        : (file_preview = (
            <img
              width="70px"
              height="70px"
              src={
                "https://teledoc.hicare.net:446" +
                this.props.appo.FILE_PATH +
                this.props.appo.FILE_NAME
              }
              className="dz-img"
              alt=""
              style={{ cursor: "pointer" }}
              onClick={this.viewFileModal}
            />
          ));
    }

    let file_preview2 = null;

    {
      this.props.appo === null ||
      this.props.appo.FILE_NAME2 === "" ||
      this.props.appo.FILE_NAME2 === "blob"
        ? (file_preview2 = <img src={previmg} className="dz-img" alt="" />)
        : (file_preview2 = (
            <img
              width="70px"
              height="70px"
              src={
                "https://teledoc.hicare.net:446" +
                this.props.appo.FILE_PATH +
                this.props.appo.FILE_NAME2
              }
              className="dz-img ml-1"
              alt=""
              style={{ cursor: "pointer" }}
              onClick={this.viewFileModal2}
            />
          ));
    }

    return (
      <Fragment>
        <Modal
          style={{
            position: "absolute",
            right: "4%",
            top: "10%",
            width: "45%",
          }}
          backdrop={false}
          isOpen={this.state.pclmodal}
          toggle={this.pclModal}
          className="modal-lg"
        >
          <ModalHeader toggle={this.pclModal}>
            <b>Consulting</b>
          </ModalHeader>
          <ModalBody>
            <PastConsultList
              parsedFilter={queryString.parse(this.props.location.search)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.pclModal}>
              닫기
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          style={{ position: "absolute", right: "4%", top: "10%" }}
          backdrop={false}
          isOpen={this.state.vitaldatamodal}
          toggle={this.vitaldataModal}
          className="modal-lg"
        >
          <ModalHeader toggle={this.vitaldataModal}>
            <b>Vital Data</b>
          </ModalHeader>
          <ModalBody>
            <VitalDataM />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.vitaldataModal}>
              닫기
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.viewfilemodal}
          toggle={this.viewFileModal}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={this.viewFileModal}></ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              {this.props.appo === null ||
              this.props.appo.FILE_NAME === "" ? null : (
                <img
                  maxwidth="500px"
                  src={
                    "https://teledoc.hicare.net:446" +
                    this.props.appo.FILE_PATH +
                    this.props.appo.FILE_NAME
                  }
                  className="dz-img"
                  alt=""
                  style={{ cursor: "pointer" }}
                  onClick={this.viewFileModal}
                />
              )}
            </Row>
          </ModalBody>
          <ModalFooter className="justify-content-center">
            <Button color="primary" onClick={this.viewFileModal}>
              확인
            </Button>{" "}
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.viewfilemodal2}
          toggle={this.viewFileModal2}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={this.viewFileModal2}></ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              {this.props.appo === null ||
              this.props.appo.FILE_NAME2 === "" ? null : (
                <img
                  maxwidth="500px"
                  src={
                    "https://teledoc.hicare.net:446" +
                    this.props.appo.FILE_PATH +
                    this.props.appo.FILE_NAME2
                  }
                  className="dz-img"
                  alt=""
                  style={{ cursor: "pointer" }}
                  onClick={this.viewFileModal2}
                />
              )}
            </Row>
          </ModalBody>
          <ModalFooter className="justify-content-center">
            <Button color="primary" onClick={this.viewFileModal2}>
              확인
            </Button>{" "}
          </ModalFooter>
        </Modal>

        <Modal
          style={{
            position: "absolute",
            right: "4%",
            top: "8%",
            width: "45%",
          }}
          backdrop={false}
          isOpen={this.state.mdnotemodal}
          toggle={this.mdNoteModal}
          className="modal-lg"
        >
          <ModalHeader toggle={this.mdNoteModal}>
            <b>MD Note</b>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col lg="3" md="12" className="align-self-center pt-0">
                <h6 className="text-bold-600">C.C</h6>
              </Col>
              <Col lg="9" md="12">
                <FormGroup className="align-self-center pt-1">
                  <Input
                    type="text"
                    placeholder="C.C"
                    value={this.state.cc}
                    onChange={(e) => this.setState({ cc: e.target.value })}
                    disabled={this.state.disableswitch === false ? false : true}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg="3" md="12" className="align-self-center pt-0">
                <h6 className="text-bold-600">Diagnosis</h6>
              </Col>
              <Col lg="9" md="12">
                <FormGroup className="align-self-center pt-1">
                  <Input
                    type="text"
                    placeholder="Diagnosis"
                    value={this.state.diagnosis}
                    onChange={(e) =>
                      this.setState({ diagnosis: e.target.value })
                    }
                    disabled={this.state.disableswitch === false ? false : true}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg="3" md="12" className="align-self-center pt-0">
                <h6 className="text-bold-600">Tx &amp; Rx</h6>
              </Col>
              <Col lg="9" md="12">
                <FormGroup className="align-self-center pt-1">
                  <Input
                    type="text"
                    placeholder="Tx &amp; Rx"
                    value={this.state.txrx}
                    onChange={(e) => this.setState({ txrx: e.target.value })}
                    disabled={this.state.disableswitch === false ? false : true}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg="3" md="12" className="pt-1">
                <h6 className="text-bold-600">Vital Data Recommendation</h6>
              </Col>
              <Col lg="9" md="12">
                <FormGroup className="align-self-center pt-1">
                  <InputGroup>
                    <Input
                      type="textarea"
                      placeholder="Vital Data recommendation"
                      rows="3"
                      value={this.state.recommendation}
                      onChange={(e) =>
                        this.setState({ recommendation: e.target.value })
                      }
                      disabled={
                        this.state.disableswitch === false ? false : true
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalHeader>
            <b>Prescription</b>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col lg="3" md="12" className="align-self-center pt-0">
                <h5 className="text-bold-600">
                  <FormattedMessage id="환자명" />
                </h5>
              </Col>
              <Col lg="9" md="12">
                <h5>{this.props.pinfo.F_NAME}</h5>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col lg="3" md="12" className="align-self-center pt-0">
                <h5 className="text-bold-600">
                  <FormattedMessage id="약국명" />
                </h5>
              </Col>
              <Col lg="9" md="12">
                <h5>
                  {this.state.pname === undefined ? "없음" : this.state.pname}
                </h5>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col lg="3" md="12" className="align-self-center pt-0">
                <h5 className="text-bold-600">
                  <FormattedMessage id="약국 주소" />
                </h5>
              </Col>
              <Col lg="9" md="12">
                <h5>
                  {this.state.paddress === undefined
                    ? "없음"
                    : this.state.paddress}
                </h5>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col lg="3" md="12" className="align-self-center pt-0">
                <h5 className="text-bold-600">Fax</h5>
              </Col>
              <Col lg="9" md="12">
                <h5>
                  {this.state.faxnum === undefined ? "없음" : this.state.faxnum}
                </h5>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col lg="3" md="12" className="align-self-center pt-0">
                <h5 className="text-bold-600">
                  <FormattedMessage id="처방전 보내기" />
                </h5>
              </Col>
              <Col lg="9" md="12" className="d-flex align-self-center">
                <Checkbox
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label="약국"
                  defaultChecked={false}
                  onChange={this.setpharmacy}
                />
                <Checkbox
                  className="ml-2"
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label="원격진료실 &amp; App"
                  defaultChecked={false}
                  onChange={this.setApp}
                />
              </Col>
            </Row>
            <Row className="mt-1">
              <Col lg="3" md="12" className="align-self-center">
                <h5 className="text-bold-600">
                  <FormattedMessage id="처방전 업로드" />
                </h5>
              </Col>

              <Col lg="9" md="12" className="pt-1 align-self-center">
                <FormGroup>
                  <CustomInput
                    type="file"
                    accept="image/gif,image/jpeg,image/png,.pdf"
                    id="exampleCustomFileBrowser"
                    name="customFile"
                    label=""
                    onChange={this.handleFileOnChange}
                    disabled={this.state.disableswitch === false ? false : true}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={this.postMdNote}
              disabled={this.state.disableswitch === false ? false : true}
            >
              저장
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          style={{
            position: "absolute",
            right: "4%",
            top: "10%",
            width: "45%",
          }}
          backdrop={false}
          isOpen={this.state.paymodal}
          toggle={this.payModal}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={this.payModal}>
            <b>Payment</b>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col lg="7" md="12" className="align-self-center pt-0">
                <Row>
                  <Col lg="5" md="12" className="align-self-center pt-0">
                    <h5 className="text-bold-600">급여총액</h5>
                  </Col>
                  <Col lg="5" md="11" className="align-self-center pt-0">
                    <FormGroup className="align-self-center pt-1">
                      <Input type="text" disabled />
                    </FormGroup>
                  </Col>
                  <Col lg="1" md="1" className="align-self-center">
                    <h5>원</h5>
                  </Col>
                </Row>
              </Col>
              <Col lg="5" md="12">
                <Row>
                  <Col lg="4" md="12" className="align-self-center pt-0">
                    <h5 className="text-bold-600">비급여</h5>
                  </Col>
                  <Col lg="6" md="11" className="align-self-center pt-0">
                    <FormGroup className="align-self-center pt-1">
                      <Input type="text" disabled />
                    </FormGroup>
                  </Col>
                  <Col lg="2" md="1" className="align-self-center">
                    <h5>원</h5>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col lg="7" md="12" className="align-self-center pt-0">
                <Row>
                  <Col lg="5" md="12" className="align-self-center pt-0">
                    <h5 className="text-bold-600">청구액 (공단부담금)</h5>
                  </Col>
                  <Col lg="5" md="11" className="align-self-center pt-0">
                    <FormGroup className="align-self-center pt-1">
                      <Input type="text" disabled />
                    </FormGroup>
                  </Col>
                  <Col lg="1" md="1" className="align-self-center">
                    <h5>원</h5>
                  </Col>
                </Row>
              </Col>
              <Col lg="5" md="12">
                <Row>
                  <Col lg="4" md="12" className="align-self-center pt-0">
                    <h5 className="text-bold-600">감액</h5>
                  </Col>
                  <Col lg="6" md="11" className="align-self-center pt-0">
                    <FormGroup className="align-self-center pt-1">
                      <Input type="text" disabled />
                    </FormGroup>
                  </Col>
                  <Col lg="2" md="1" className="align-self-center">
                    <h5>원</h5>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col lg="7" md="12" className="align-self-center pt-0">
                <Row>
                  <Col lg="5" md="12" className="align-self-center pt-0">
                    <h5 className="text-bold-600">
                      <FormattedMessage id="환자 본인부담금" />
                    </h5>
                  </Col>
                  <Col lg="5" md="11" className="align-self-center pt-0">
                    <FormGroup className="align-self-center pt-1">
                      <Input
                        type="text"
                        value={this.state.paypatient}
                        onChange={(e) =>
                          this.setState({ paypatient: e.target.value })
                        }
                        disabled={
                          this.state.disableswitch === false ? false : true
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="1" md="1" className="align-self-center">
                    <h5>원</h5>
                  </Col>
                </Row>
              </Col>
              <Col lg="5" md="12">
                <Row>
                  <Col lg="4" md="12" className="align-self-center pt-0">
                    <h5 className="text-bold-600">
                      <FormattedMessage id="최종 청구액" />
                    </h5>
                  </Col>
                  <Col lg="6" md="11" className="align-self-center pt-0">
                    <FormGroup className="align-self-center pt-1">
                      <Input
                        type="text"
                        value={this.state.paypatient}
                        onChange={(e) =>
                          this.setState({ paytotal: e.target.value })
                        }
                        disabled={
                          this.state.disableswitch === false ? false : true
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="2" md="1" className="align-self-center">
                    <h5>원</h5>
                  </Col>
                </Row>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="text-right">
            <Button
              color="primary"
              onClick={this.postPayment}
              disabled={this.state.disableswitch === false ? false : true}
            >
              <FormattedMessage id="전송" />
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.gohomemodal} toggle={this.goHomeModal}>
          <ModalHeader toggle={this.goHomeModal}>
            <b>주의</b>
          </ModalHeader>
          <ModalBody>
            MD Note, Payment 는 수정이 불가하오니 다시 한번 확인해주세요
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.pushGoHome}>
              확인
            </Button>
            <Button color="primary" outline onClick={this.goHomeModal}>
              취소
            </Button>
          </ModalFooter>
        </Modal>

        <Row className="d-flex justify-content-between mb-0">
          <Col lg="6" md="12">
            {this.props.appo === null ? null : (
              <Table responsive>
                <thead>
                  <tr
                    className="table-primary"
                    style={{ verticalAlign: "middle" }}
                  >
                    <th>
                      <h6>{this.props.appo.APPOINT_TIME}</h6>
                    </th>
                    <th>
                      <h6>{this.props.pinfo.F_NAME}</h6>
                    </th>
                    <th>
                      <h6>
                        {this.props.pinfo.GENDER === "1" ||
                        this.props.pinfo.GENDER === "3"
                          ? "M"
                          : "F"}
                      </h6>
                    </th>
                    <th>
                      <h6>{this.props.pinfo.AGE}</h6>
                    </th>
                    <th>
                      <h6>{this.props.pinfo.BIRTH_DT}</h6>
                    </th>
                    <th>
                      <h6>{this.props.pinfo.NOTE_DX}</h6>
                    </th>
                    <th>
                      <h6>
                        {this.props.pinfo.FIRST_YN === "N" ? (
                          <FormattedMessage id="재진" />
                        ) : (
                          <FormattedMessage id="초진" />
                        )}
                      </h6>
                    </th>
                  </tr>
                </thead>
              </Table>
            )}
          </Col>
          <Col lg="6" md="12" className="d-flex text-right">
            {moment(this.props.rtime) === undefined ||
            moment(this.props.rtime) <= moment() ? null : (
              <Col
                className="mx-2 text-left d-flex"
                style={{
                  border: "1px solid #B8B8C2",
                  borderRadius: "5px",
                  height: "35px",
                  marginTop: "0.6rem",
                }}
              >
                <h5
                  className="align-self-center text-primary mr-1"
                  style={{ paddingTop: "0.3rem" }}
                >
                  <FormattedMessage id="진료 시작까지" />
                </h5>
                {this.props.appo === null ? null : (
                  <span style={{ marginTop: "0.3rem" }}>
                    <Countdown date={moment(this.props.rtime)}>
                      <this.Completionist />
                    </Countdown>
                  </span>
                )}
                <h5
                  className="align-self-center text-primary"
                  style={{ paddingTop: "0.3rem" }}
                >
                  <FormattedMessage id="남았습니다" />
                </h5>
              </Col>
            )}

            <Col
              className="mx-2 text-left d-flex"
              style={{
                border: "1px solid #B8B8C2",
                borderRadius: "5px",
                height: "35px",
                maxWidth: "500px",
                marginTop: "0.6rem",
              }}
            >
              <h5
                className="align-self-center text-primary mr-1"
                style={{ paddingTop: "0.3rem" }}
              >
                <FormattedMessage id="남은시간" />
              </h5>
              {this.props.appo === null ? null : (
                <span style={{ marginTop: "0.3rem" }}>
                  <Countdown date={moment(this.props.rtime) + 900000}>
                    <this.Completephone />
                  </Countdown>
                </span>
              )}
            </Col>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col className="col-4">
            <Card
              className="mb-1"
              style={{ height: "300px", border: "solid silver 1px" }}
            >
              <CardTitle className="pl-1" style={{ paddingTop: "5px" }}>
                <b>Personal Information</b>
              </CardTitle>
              <CardBody className="d-flex pl-0">
                <div className="col-4">
                  <h5>
                    <span className="text-bold-600">
                      <FormattedMessage id="Name" />
                    </span>
                  </h5>
                  <h5>
                    <span className="text-bold-600">
                      <FormattedMessage id="성별" />
                    </span>
                  </h5>
                  <h5>
                    <span className="text-bold-600">
                      <FormattedMessage id="생년월일" />
                    </span>
                  </h5>
                  <h5>
                    <span className="text-bold-600">
                      <FormattedMessage id="연락처" />
                    </span>
                  </h5>
                </div>
                <div className="col-8">
                  <h5>{this.props.pinfo.F_NAME}</h5>
                  <h5>
                    {this.props.pinfo.GENDER === "1" ||
                    this.props.pinfo.GENDER === "3"
                      ? "M"
                      : "F"}
                  </h5>
                  <h5>{this.props.pinfo.BIRTH_DT}</h5>
                  <h5>{this.props.pinfo.MOBILE_NUM}</h5>
                </div>
              </CardBody>
            </Card>
            <Card
              className="mb-1"
              style={{ height: "310px", border: "solid silver 1px" }}
            >
              <CardTitle
                className="px-1 d-flex justify-content-between"
                style={{ paddingTop: "5px" }}
              >
                <b>Consulting</b>
                <img
                  src={dot}
                  onClick={() =>
                    this.goPastConsultList(this.props.pinfo.PATIENT_ID)
                  }
                  style={{ cursor: "pointer", width: "10px" }}
                />
              </CardTitle>
              <CardBody className="pl-0 pt-0">
                <table className="col-12 pt-0 mt-0">
                  <tbody>
                    <tr>
                      <th className="text-center">
                        <h5 className="text-bold-600">
                          <FormattedMessage id="진료과/진료의" />
                        </h5>
                      </th>
                      <th className="text-center">
                        <h5 className="text-bold-600">
                          <FormattedMessage id="진단명" />
                        </h5>
                      </th>
                      <th className="text-center">
                        <h5 className="text-bold-600">
                          <FormattedMessage id="진료일자" />
                        </h5>
                      </th>
                    </tr>
                    {this.props.cslist.map((row) => (
                      <Cslist key={row.APPOINT_TIME} row={row} />
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
          <Col className="col-8">
            <div className="d-flex justify-content-between">
              <div className="mr-1" style={{ width: "50%" }}>
                <Card
                  className="mb-1"
                  style={{ height: "300px", border: "solid silver 1px" }}
                >
                  <CardTitle className="pl-1" style={{ paddingTop: "5px" }}>
                    <b>Physical Data</b>
                  </CardTitle>
                  <CardBody className="d-flex pl-0">
                    <table className="ml-1">
                      <tbody>
                        <tr>
                          <td style={{ minWidth: "140px" }}>
                            <h6>
                              <span className="text-bold-600">
                                <FormattedMessage id="신장/체중" />
                              </span>
                            </h6>
                          </td>
                          <td>
                            <h6>
                              {this.props.pinfo.HEIGHT_VAL}cm&nbsp;/&nbsp;
                              {this.props.pinfo.WEIGHT_VAL}kg
                            </h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6>
                              <span className="text-bold-600">
                                <FormattedMessage id="흡연여부" />
                              </span>
                            </h6>
                          </td>
                          <td>
                            <h6>
                              {this.props.pinfo.SMOKE_YN === "Y" ? (
                                <FormattedMessage id="흡연" />
                              ) : (
                                <FormattedMessage id="비흡연" />
                              )}
                            </h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6>
                              <span className="text-bold-600">
                                <FormattedMessage id="음주여부" />
                              </span>
                            </h6>
                          </td>
                          <td>
                            <h6>
                              {this.props.pinfo.DRINK_YN === "N" ? (
                                <FormattedMessage id="자주" />
                              ) : (
                                <FormattedMessage id="가끔" />
                              )}
                            </h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6>
                              <span className="text-bold-600">
                                <FormattedMessage id="본인병력" />
                              </span>
                            </h6>
                          </td>
                          <td>
                            <h6>
                              {this.props.pinfo.DISEASE_DESC === "" ? (
                                <FormattedMessage id="없음" />
                              ) : (
                                this.props.pinfo.DISEASE_DESC
                              )}
                            </h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6>
                              <span className="text-bold-600">
                                <FormattedMessage id="가족병력" />
                              </span>
                            </h6>
                          </td>
                          <td>
                            <h6>
                              {this.props.pinfo.FAMILY_DESC === "" ? (
                                <FormattedMessage id="없음" />
                              ) : (
                                this.props.pinfo.FAMILY_DESC
                              )}
                            </h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6>
                              <span className="text-bold-600">
                                <FormattedMessage id="복용중인 약" />
                              </span>
                            </h6>
                          </td>
                          <td>
                            <h6>
                              {this.props.pinfo.USE_MED === "" ? (
                                <FormattedMessage id="없음" />
                              ) : (
                                this.props.pinfo.USE_MED
                              )}
                            </h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6>
                              <span className="text-bold-600">
                                <FormattedMessage id="알러지유무" />
                              </span>
                            </h6>
                          </td>
                          <td>
                            <h6>
                              {this.props.pinfo.ALLERGY_YN === "Y" ? (
                                <FormattedMessage id="알러지있음" />
                              ) : (
                                <FormattedMessage id="알러지없음" />
                              )}

                              {this.props.pinfo.ALLERGY_YN === "N" ||
                              this.props.pinfo.ALLERGY_DESC === ""
                                ? ""
                                : this.props.pinfo.ALLERGY_DESC}
                            </h6>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardBody>
                </Card>
              </div>

              <div style={{ width: "50%" }}>
                <Card
                  className="mb-1"
                  style={{ height: "119px", border: "solid silver 1px" }}
                >
                  <CardTitle className="pl-1" style={{ paddingTop: "5px" }}>
                    <b>
                      <FormattedMessage id="Present Condition" />
                    </b>
                  </CardTitle>
                  <CardBody className="d-flex pl-0">
                    <div className="col-12">
                      <h5>
                        {this.props.appo === null
                          ? ""
                          : this.props.appo.SYMPTOM}
                      </h5>
                    </div>
                  </CardBody>
                </Card>
                <Card
                  className="mb-1"
                  style={{ height: "169px", border: "solid silver 1px" }}
                >
                  <CardTitle className="pl-1" style={{ paddingTop: "5px" }}>
                    <b>
                      <FormattedMessage id="Files" />
                    </b>
                  </CardTitle>
                  <CardBody>
                    {file_preview}
                    {file_preview2}
                  </CardBody>
                </Card>
              </div>
            </div>

            <Card
              className="mb-1"
              style={{ height: "310px", border: "solid silver 1px" }}
            >
              <CardTitle
                className="px-1 d-flex justify-content-between"
                style={{ paddingTop: "5px" }}
              >
                <b>Vital Data</b>
                <img
                  src={dot}
                  onClick={this.goVitalData}
                  style={{ cursor: "pointer", width: "10px" }}
                />
              </CardTitle>
              <CardBody className="d-flex pl-0">
                <div className="d-flex col-12 pl-0">
                  {this.props.bpdata.length === 0 ? null : (
                    <div className="col-2 pl-0">
                      <ResponsiveContainer>
                        <LineChart
                          className="col-2"
                          width={500}
                          height={300}
                          data={this.props.bpdata}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            tick={{ fontSize: 10 }}
                            dataKey="CREATE_TIME"
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            name="Sys"
                            type="monotone"
                            dataKey="SYS_VAL"
                            stroke="#EA5455"
                          />
                          <Line
                            name="Dia"
                            type="monotone"
                            dataKey="DIA_VAL"
                            stroke="#7367F0"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {this.props.pulstdata.length === 0 ? null : (
                    <div className="col-2 pl-0">
                      <ResponsiveContainer>
                        <LineChart
                          className="col-2"
                          width={500}
                          height={300}
                          data={this.props.pulstdata}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            tick={{ fontSize: 10 }}
                            dataKey="CREATE_TIME"
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            name="맥박"
                            type="monotone"
                            dataKey="PULSE_VAL"
                            stroke="#EA5455"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {this.props.tempdata.length === 0 ? null : (
                    <div className="col-2 pl-0">
                      <ResponsiveContainer>
                        <LineChart
                          className="col-2"
                          width={500}
                          height={300}
                          data={this.props.tempdata}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            tick={{ fontSize: 10 }}
                            dataKey="CREATE_TIME"
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            name="체온"
                            type="monotone"
                            dataKey="TEMP_VAL"
                            stroke="#EA5455"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {this.props.bsdata.length === 0 ? null : (
                    <div className="col-2 pl-0">
                      <ResponsiveContainer>
                        <LineChart
                          className="col-2"
                          width={500}
                          height={300}
                          data={this.props.bsdata}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            tick={{ fontSize: 10 }}
                            dataKey="CREATE_TIME"
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            name="혈당"
                            type="monotone"
                            dataKey="GLUCOSE_VAL"
                            stroke="#EA5455"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {this.props.wedata.length === 0 ? null : (
                    <div className="col-2 pl-0">
                      <ResponsiveContainer>
                        <LineChart
                          className="col-2"
                          width={500}
                          height={300}
                          data={this.props.wedata}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            tick={{ fontSize: 10 }}
                            dataKey="CREATE_TIME"
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            name="몸무게"
                            type="monotone"
                            dataKey="WEIGHT_VAL"
                            stroke="#EA5455"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            name="BMI"
                            type="monotone"
                            dataKey="BMI_VAL"
                            stroke="#7367F0"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {this.props.spo2data.length === 0 ? null : (
                    <div className="col-2 pl-0">
                      <ResponsiveContainer>
                        <LineChart
                          className="col-2"
                          width={500}
                          height={300}
                          data={this.props.spo2data}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            tick={{ fontSize: 10 }}
                            dataKey="CREATE_TIME"
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            name="SPO2"
                            type="monotone"
                            dataKey="SPO2_VAL"
                            stroke="#EA5455"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
            <div className="pt-0 mt-0 text-right" style={{ width: "100%" }}>
              <Button
                className="mr-1"
                color="primary"
                outline
                type="button"
                onClick={this.mdNoteModal}
              >
                Tx &amp; Rx
              </Button>
              <Button
                className="mr-1"
                color="primary"
                outline
                type="button"
                onClick={this.payModal}
              >
                Payment
              </Button>
              <Button
                color="primary"
                outline
                type="button"
                onClick={this.goHome}
              >
                Save
              </Button>
            </div>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    dataList: state.dataList,
    appo: state.dataList.appointment,
    pinfo: state.dataList.patient,
    cslist: state.dataList.csdata,
    bpdata: state.dataList.BP,
    pulstdata: state.dataList.PULSE,
    tempdata: state.dataList.TEMP,
    bsdata: state.dataList.BS,
    wedata: state.dataList.WE,
    spo2data: state.dataList.SPO2,
    concookie: state.cookies.consult,
    rtime: state.dataList.rtime,
    history: state.dataList.history,
    pharmacy: state.dataList.pharmacy,
    cipher: state.auth.cipher,
  };
};

export default connect(mapStateToProps, {
  mPCL,
  resetVitalData,
  postMDNoteData,
  postPayData,
  postPrescriptionData,
  putStateComplete,
  saveCookieConsult,
})(PatientInfo);
