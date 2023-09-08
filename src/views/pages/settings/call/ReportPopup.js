import React from "react";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  FormGroup,
  Button,
  InputGroup,
  Input,
  CustomInput,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Card,
} from "reactstrap";
import {
  postMDNoteData,
  postPrescriptionData,
} from "../../../../redux/actions/data-list";
import { saveCookieConsult } from "../../../../redux/actions/cookies";
import { Check } from "react-feather";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import "../../../../assets/scss/pages/authentication.scss";
import { connect } from "react-redux";
import axios from "axios";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import "../../../../assets/scss/plugins/extensions/recharts.scss";
import moment from "moment";
import { FormattedMessage } from "react-intl";

import AES256 from "aes-everywhere";
import { putEtcOtc } from "../../../../redux/actions/appoint";
import { SERVER_URL2 } from "../../../../config";
import {
  encryptByPubKey,
  decryptByAES,
  AESKey,
} from "../../../../redux/actions/auth/cipherActions";
import PhoneForm from "../../../ui-elements/patient-list/PatientInfo/components/PhoneForm";
import PhoneInfoList from "../../../ui-elements/patient-list/PatientInfo/components/PhoneInfoList";

class ConsultingRoom extends React.Component {
  id = 1;
  constructor(props) {
    super(props);
    this.state = {
      cc: "",
      ros: "",
      diagnosis: "",
      txrx: "",
      recommendation: "",
      tscc: "",
      tsros: "",
      tsdiagnosis: "",
      tstxrx: "",
      tsrecommendation: "",
      autotsbutton: false,
      thislang: "",
      tslang: "",
      telnum: "",
      filename: "",
      file: "",
      presmodal: false,
      pharmacy: false,
      App: false,
      rxname: "",
      disableswitch: false,
      trpmodal: false,
      uploadcompletemodal: false,
      activeTab: "1",
      etcotctab: "1",
      puteostate: false,
      information: [
        {
          id: 0,
          name: "",
          unit: "mg",
        },
      ],
    };

    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    let value = AES256.encrypt(
      JSON.stringify({
        user_id: this.props.user.login.values.loggedInUser.username,
        appoint_num: this.props.appo.APPOINT_NUM,
      }),
      AESKey
    );

    axios
      .get(`${SERVER_URL2}/doctor/treatment/history`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let History = decryptByAES(response.data.data);
        console.log(History);
        if (response.data.status === "200") {
          this.setState({
            cc: History.NOTE_CC,
            ros: History.NOTE_ROS,
            diagnosis: History.NOTE_DX,
            recommendation: History.NOTE_VITAL,
            rxname: History.RX_NAME,
          });
          axios
            .get(`${SERVER_URL2}/doctor/treatment/involve-state`, {
              params: {
                c_key: encryptedrsapkey,
                c_value: AES256.encrypt(
                  JSON.stringify({
                    user_id: this.props.user.login.values.loggedInUser.username,
                    appoint_num: this.props.appo.APPOINT_NUM,
                  }),
                  AESKey
                ),
              },
            })
            .then((response) => {
              let docstate = decryptByAES(response.data.data);
              console.log(this.props.appo.APPOINT_NUM, "예약번호");
              console.log(docstate.STATE_DOC, "의사 스테이터스");
              if (History.APPOINT_STATE === "AF") {
                this.setState({
                  disableswitch: false,
                });
                localStorage.setItem("reportcomplete", "Y");
              } else {
                this.setState({
                  disableswitch: true,
                });
              }
            })
            .catch((err) => console.log(err));
        } else {
          // alert(response.data.message);
        }
      })

      .catch((err) => console.log(err));
  }

  autoTranslate = () => {
    this.setState((prevState) => ({
      autotsbutton: !prevState.autotsbutton,
    }));
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );

    let ccvalue = AES256.encrypt(
      JSON.stringify({
        user_id: this.props.user.login.values.loggedInUser.username,
        lang_source: this.state.thislang,
        lang_target: this.state.tslang,
        note_cont: this.state.cc,
      }),
      AESKey
    );
    axios
      .get(`${SERVER_URL2}/doctor/treatment/translate`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: ccvalue,
        },
      })
      .then((response) => {
        let contentdata = decryptByAES(response.data.data);
        console.log(contentdata);
        this.setState({ tscc: contentdata.CONTENTS });
      })
      .catch((err) => console.log(err));

    let rosvalue = AES256.encrypt(
      JSON.stringify({
        user_id: this.props.user.login.values.loggedInUser.username,
        lang_source: this.state.thislang,
        lang_target: this.state.tslang,
        note_cont: this.state.ros,
      }),
      AESKey
    );
    axios
      .get(`${SERVER_URL2}/doctor/treatment/translate`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: rosvalue,
        },
      })
      .then((response) => {
        let contentdata = decryptByAES(response.data.data);
        console.log(contentdata);
        this.setState({ tsros: contentdata.CONTENTS });
      })
      .catch((err) => console.log(err));

    let diavalue = AES256.encrypt(
      JSON.stringify({
        user_id: this.props.user.login.values.loggedInUser.username,
        lang_source: this.state.thislang,
        lang_target: this.state.tslang,
        note_cont: this.state.diagnosis,
      }),
      AESKey
    );
    axios
      .get(`${SERVER_URL2}/doctor/treatment/translate`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: diavalue,
        },
      })
      .then((response) => {
        let contentdata = decryptByAES(response.data.data);
        console.log(contentdata);
        this.setState({ tsdiagnosis: contentdata.CONTENTS });
      })
      .catch((err) => console.log(err));

    let recvalue = AES256.encrypt(
      JSON.stringify({
        user_id: this.props.user.login.values.loggedInUser.username,
        lang_source: this.state.thislang,
        lang_target: this.state.tslang,
        note_cont: this.state.recommendation,
      }),
      AESKey
    );
    axios
      .get(`${SERVER_URL2}/doctor/treatment/translate`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: recvalue,
        },
      })
      .then((response) => {
        let contentdata = decryptByAES(response.data.data);
        console.log(contentdata);
        this.setState({ tsrecommendation: contentdata.CONTENTS });
      })
      .catch((err) => console.log(err));
  };

  // etc otc 관련 함수
  handleCreate = (data) => {
    const { information } = this.state;
    this.setState({
      information: information.concat({ id: this.id++, ...data }),
    });
  };

  handleUpdate = (id, data) => {
    const { information } = this.state;
    this.setState(
      {
        information: information.map(
          (info) =>
            id === info.id
              ? { ...info, ...data } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
              : info // 기존의 값을 그대로 유지
        ),
      },
      () => {
        console.log(data);
      }
    );
  };

  handleRemove = (id) => {
    const { information } = this.state;
    this.setState({
      information: information.filter((info) => info.id !== id),
    });
  };

  postFdaList = () => {
    let fdatextstarr = new Array();
    let fdatexts = "";
    let fdamedsarr = new Array();
    let fdameds = "";
    if (this.state.information.length >= 2) {
      for (let i = 0; i < this.state.information.length; i++) {
        let fdamedsobject = new Object();
        let fdatextssobject = new Object();

        fdamedsobject = "'" + this.state.information[i].name + "'";
        // fdatextssobject = "'" + this.state.information[i].volume + "'";
        fdatextssobject = this.state.information[i].volume;

        fdamedsobject = JSON.stringify(fdamedsobject);
        fdatextssobject = JSON.stringify(fdatextssobject);

        //String 형태로 파싱한 객체를 다시 json으로 변환
        if (fdamedsobject !== undefined) {
          fdamedsarr.push(JSON.parse(fdamedsobject));
        }
        if (fdatextssobject !== undefined) {
          fdatextstarr.push(JSON.parse(fdatextssobject));
        }
      }
      fdameds = fdamedsarr.join(",");
      fdatexts = fdatextstarr.join(",");
    } else {
      fdameds = "'" + this.state.information[0].name + "'";
      fdatexts = this.state.information[0].volume;
    }

    this.props.putEtcOtc(
      this.props.user.login.values.loggedInUser.username,
      this.props.appo.APPOINT_NUM,
      fdameds,
      fdatexts,
      this.props.cipher.rsapublickey.publickey
    );

    this.setState((prevState) => ({
      puteostate: !prevState.puteostate,
    }));
    this.uploadCompleteModal();
  };
  //

  // tx&rx 탭 토글용
  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  // etc otc 토글용
  etcOtc = (fdatab) => {
    if (this.state.etcotctab !== fdatab) {
      this.setState(
        {
          etcotctab: fdatab,
        },
        () => {
          console.log("etcotcinfo: ", this.state.information);
        }
      );
    }
  };

  componentDidMount() {
    if (localStorage.getItem("lang") === "ko") {
      this.setState({ thislang: "ko", tslang: "en" });
    } else {
      this.setState({ thislang: "en", tslang: "ko" });
    }
  }

  trpModal = () => {
    this.setState((prevState) => ({
      trpmodal: !prevState.trpmodal,
    }));
  };

  uploadCompleteModal = () => {
    this.setState((prevState) => ({
      uploadcompletemodal: !prevState.uploadcompletemodal,
    }));
  };

  postMdNote = () => {
    if (
      this.state.cc === "" ||
      this.state.ros === "" ||
      this.state.diagnosis === "" ||
      this.state.recommendation === ""
    ) {
      this.trpModal();
    } else {
      // 암호화
      this.props.postMDNoteData(
        this.props.user.login.values.loggedInUser.username,
        this.props.appo.APPOINT_NUM,
        this.state.cc,
        this.state.ros,
        this.state.diagnosis,
        this.state.txrx,
        this.state.recommendation,
        this.props.cipher.rsapublickey.publickey
      );
      this.uploadCompleteModal();
    }
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

    this.setState({
      rxname: this.state.filename,
    });
    this.uploadCompleteModal();
  };

  setApp = () => {
    this.setState((prevState) => ({
      App: !prevState.App,
    }));
  };

  Check = (e) => {
    e.preventDefault();
    console.log(this.state);
  };

  parentFunction = (data) => {
    this.setState({ onsubscribe: data });
  };

  render() {
    return (
      <div
        className="m-0 p-0 h-100"
        style={{ alignItems: "center", background: "#0B0F21" }}
      >
        <PerfectScrollbar>
          <Modal
            isOpen={this.state.trpmodal}
            toggle={this.trpModal}
            backdrop={false}
          >
            <ModalHeader toggle={this.trpModal}>
              <b>
                <FormattedMessage id="주의" />
              </b>
            </ModalHeader>
            <ModalBody>
              <FormattedMessage id="csroom_caution6" />
              <br />
              <FormattedMessage id="csroom_caution7" />
              <br />
              내용을 확인해주시고 저장버튼을 눌러주시기 바랍니다.
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.trpModal}>
                <FormattedMessage id="확인" />
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.uploadcompletemodal}
            toggle={this.uploadCompleteModal}
            backdrop={false}
          >
            <ModalHeader toggle={this.uploadCompleteModal}>
              <b>
                <FormattedMessage id="complete" />
              </b>
            </ModalHeader>
            <ModalBody>
              {" "}
              <FormattedMessage id="saved" />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.uploadCompleteModal}>
                <FormattedMessage id="확인" />
              </Button>
            </ModalFooter>
          </Modal>

          <Card
            style={{
              width: "792px",
              minHeight: "590px",
            }}
            className="mb-0"
          >
            <div>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "1",
                    })}
                    onClick={() => {
                      this.toggle("1");
                    }}
                  >
                    <h5
                      className={
                        this.state.activeTab === "1" ? "" : "text-secondary"
                      }
                    >
                      상담 Report
                    </h5>
                  </NavLink>
                </NavItem>
                <NavItem className="pt-1"></NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "2",
                    })}
                    onClick={() => {
                      this.toggle("2");
                    }}
                  >
                    <h5
                      className={
                        this.state.activeTab === "2" ? "" : "text-secondary"
                      }
                    >
                      Prescription
                    </h5>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane
                  style={{ paddingLeft: "10px", paddingRight: "10px" }}
                  tabId="1"
                >
                  <div>
                    <div className="col-12 px-0 text-right">
                      <button
                        style={
                          this.state.autotsbutton === false
                            ? {
                                width: "85px",
                                height: "32px",
                                border: "1px solid #C7D1DA",
                                backgroundColor: "white",
                                cursor: "pointer",
                                borderRadius: "4px",
                              }
                            : {
                                width: "85px",
                                height: "32px",
                                border: "1px solid #C7D1DA",
                                backgroundColor: "#4B94F2",
                                cursor: "pointer",
                                borderRadius: "4px",
                              }
                        }
                        outline
                        color={
                          this.state.autotsbutton === false
                            ? "primary"
                            : "warning"
                        }
                        onClick={this.autoTranslate}
                      >
                        자동번역
                      </button>
                    </div>
                    <div className="align-self-center pt-0">C.C</div>
                    <div>
                      <FormGroup className="align-self-center mx-0">
                        <Input
                          type="text"
                          // placeholder="C.C"
                          value={
                            this.state.autotsbutton === false
                              ? this.state.cc
                              : this.state.tscc
                          }
                          onChange={(e) =>
                            this.setState({ cc: e.target.value })
                          }
                          disabled={
                            this.state.disableswitch === false ? false : true
                          }
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <div>
                    <div className="align-self-center pt-0">ROS</div>
                    <div>
                      <FormGroup className="align-self-center mx-0">
                        <Input
                          type="text"
                          // placeholder="ROS"
                          value={
                            this.state.autotsbutton === false
                              ? this.state.ros
                              : this.state.tsros
                          }
                          onChange={(e) =>
                            this.setState({ ros: e.target.value })
                          }
                          disabled={
                            this.state.disableswitch === false ? false : true
                          }
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <div>
                    <div className="align-self-center pt-0">DX</div>
                    <div>
                      <FormGroup className="align-self-center mx-0">
                        <Input
                          type="text"
                          // placeholder="Diagnosis"
                          value={
                            this.state.autotsbutton === false
                              ? this.state.diagnosis
                              : this.state.tsdiagnosis
                          }
                          onChange={(e) =>
                            this.setState({ diagnosis: e.target.value })
                          }
                          disabled={
                            this.state.disableswitch === false ? false : true
                          }
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <div>
                    <div className="align-self-center pt-0">
                      Recommendation & Notes
                    </div>
                    <div>
                      <FormGroup className="align-self-center mx-0">
                        <InputGroup>
                          <Input
                            type="textarea"
                            // placeholder="Vital Data recommendation"
                            rows="3"
                            value={
                              this.state.autotsbutton === false
                                ? this.state.recommendation
                                : this.state.tsrecommendation
                            }
                            onChange={(e) =>
                              this.setState({
                                recommendation: e.target.value,
                              })
                            }
                            disabled={
                              this.state.disableswitch === false ? false : true
                            }
                          />
                        </InputGroup>
                      </FormGroup>
                      <div style={{ fontSize: "12px", color: "#A29EAF" }}>
                        * ETC, OTC를 매칭한 Rx는 Prescription에서 입력할 수
                        있습니다.
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      {moment().format("YYYY.MM.DD")}
                    </div>
                    <div className="mx-0 mt-2">
                      <Button
                        disabled={
                          this.state.disableswitch === false ? false : true
                        }
                        color={
                          this.state.disableswitch === false
                            ? "primary"
                            : "secondary"
                        }
                        size="md"
                        onClick={this.postMdNote}
                      >
                        <FormattedMessage id="Save" />
                      </Button>
                    </div>
                  </div>
                </TabPane>
                <TabPane
                  style={{ paddingLeft: "10px", paddingRight: "10px" }}
                  tabId="2"
                >
                  <ButtonGroup className="mb-2 mt-1">
                    <button
                      style={{ width: "58px", height: "32px" }}
                      onClick={() => this.etcOtc("1")}
                      className={`btn p-0 m-0 ${
                        this.state.etcotctab === "1"
                          ? "btn-primary"
                          : "btn-outline-primary text-primary"
                      }`}
                    >
                      국내
                    </button>
                    <button
                      style={{ width: "58px", height: "32px" }}
                      onClick={() => this.etcOtc("2")}
                      className={`btn p-0 m-0 ${
                        this.state.etcotctab === "2"
                          ? "btn-primary"
                          : "btn-outline-primary text-primary"
                      }`}
                    >
                      국외
                    </button>
                  </ButtonGroup>
                  {this.state.etcotctab === "1" ? (
                    <div>
                      <Row className="mt-1">
                        <Col
                          style={{ color: "#A29EAF" }}
                          lg="3"
                          md="12"
                          className="align-self-center pt-0"
                        >
                          <FormattedMessage id="약국명" />
                        </Col>
                        <Col style={{ color: "#A29EAF" }} lg="9" md="12">
                          <h5>
                            {this.props.pharmacy.P_NAME === undefined ||
                            this.props.pharmacy.P_NAME === "" ? (
                              <FormattedMessage id="없음" />
                            ) : (
                              this.props.pharmacy.P_NAME
                            )}
                          </h5>
                        </Col>
                      </Row>
                      <Row className="mt-1">
                        <Col
                          style={{ color: "#A29EAF" }}
                          lg="3"
                          md="12"
                          className="align-self-center pt-0"
                        >
                          {/* <FormattedMessage id="약국 주소" /> */}
                          주소
                        </Col>
                        <Col lg="9" md="12">
                          <h5>
                            {this.props.pharmacy.P_ADDRESS === undefined ||
                            this.props.pharmacy.P_ADDRESS === "" ? (
                              <FormattedMessage id="없음" />
                            ) : (
                              this.props.pharmacy.P_ADDRESS
                            )}
                          </h5>
                        </Col>
                      </Row>
                      <Row className="mt-1">
                        <Col
                          style={{ color: "#A29EAF" }}
                          lg="3"
                          md="12"
                          className="align-self-center pt-0"
                        >
                          Fax
                        </Col>
                        <Col lg="9" md="12">
                          <h5>
                            {this.props.pharmacy.FAX_NUM === undefined ||
                            this.props.pharmacy.FAX_NUM === "" ? (
                              <FormattedMessage id="없음" />
                            ) : (
                              this.props.pharmacy.FAX_NUM
                            )}
                          </h5>
                        </Col>
                      </Row>
                      <Row className="mt-1">
                        <Col
                          style={{ color: "#A29EAF" }}
                          lg="3"
                          md="12"
                          className="align-self-center pt-0"
                        >
                          용도
                        </Col>
                        <Col
                          lg="9"
                          md="12"
                          className="d-flex align-self-center"
                        >
                          <FormattedMessage id="ConsultingRoom">
                            {(ConsultingRoom) => (
                              <Checkbox
                                color="primary"
                                icon={<Check className="vx-icon" size={16} />}
                                label="앱"
                                defaultChecked={true}
                                onChange={this.setApp}
                              />
                            )}
                          </FormattedMessage>
                        </Col>
                      </Row>
                      <Row className="mt-1">
                        <Col
                          style={{ color: "#A29EAF" }}
                          lg="3"
                          md="12"
                          className="align-self-center"
                        >
                          <FormattedMessage id="처방전 업로드" />
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
                              disabled={
                                this.state.disableswitch === false
                                  ? false
                                  : true
                              }
                            />
                            {this.state.rxname !== "" ? (
                              <h5 className="text-bold-600  primary">
                                업로드된 처방전이 있습니다.
                              </h5>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col
                          className="d-flex justify-content-end"
                          style={{ marginTop: "17px" }}
                          md="12"
                        >
                          {moment().format("YYYY.MM.DD")}
                        </Col>
                        <Col md="12">
                          <Button
                            onClick={this.postPrescription}
                            disabled={
                              this.state.disableswitch === false ? false : true
                            }
                            color={
                              this.state.disableswitch === false
                                ? "primary"
                                : "secondary"
                            }
                          >
                            저장
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    <div>
                      <PhoneForm
                        puteostate={this.state.puteostate}
                        onCreate={this.handleCreate}
                      />
                      <div
                        className="d-flex mx-0 col-12 align-items-center"
                        id="medicinelistbar"
                      >
                        <div
                          className="col-4"
                          style={{
                            color: "#113055",
                          }}
                        >
                          <b>처방의약품</b>
                        </div>
                        <div
                          className="col-3"
                          style={{
                            color: "#113055",
                          }}
                        >
                          <b>매칭의약품</b>
                        </div>

                        <div
                          className="col-2 pl-0"
                          style={{
                            color: "#113055",
                          }}
                        >
                          <b style={{ marginLeft: "5px" }}>용량</b>
                        </div>
                        <div
                          className="col-2 pr-0"
                          style={{
                            color: "#113055",
                            paddingLeft: "32px",
                          }}
                        >
                          <b style={{ marginLeft: "5px" }}>횟수</b>
                        </div>
                      </div>
                      <PhoneInfoList
                        className="mx-0"
                        data={this.state.information}
                        puteostate={this.state.puteostate}
                        onRemove={this.handleRemove}
                        onUpdate={this.handleUpdate}
                      />
                      <div className="px-0 mt-3 col-12 d-flex justify-content-end">
                        {moment().format("YYYY.MM.DD")}
                      </div>
                      <Button
                        color="primary"
                        className="mt-1"
                        onClick={this.postFdaList}
                      >
                        <FormattedMessage id="Save" />
                      </Button>
                    </div>
                  )}
                </TabPane>
              </TabContent>
            </div>
          </Card>
        </PerfectScrollbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    filename: state.cookies.filename.filename,
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
    secondlist: state.dataList.secondlist,
  };
};

export default connect(mapStateToProps, {
  putEtcOtc,
  postMDNoteData,
  postPrescriptionData,
  saveCookieConsult,
})(ConsultingRoom);
