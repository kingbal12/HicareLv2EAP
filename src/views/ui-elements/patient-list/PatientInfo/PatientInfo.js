import React from "react";
import classnames from "classnames";
import {
  SERVER_URL,
  SERVER_URL2,
  SERVER_URL_TEST_IMG,
} from "../../../../config";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Card,
  CardTitle,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip,
  InputGroup,
  Input,
  CustomInput,
  FormGroup,
  ButtonGroup,
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
  resetVitalData,
  goPCL,
  initPharmacy,
  getPharmacy,
  pushCloseSignal,
  postMDNoteData,
  postPrescriptionData,
} from "../../../../redux/actions/data-list/";
import { putEtcOtc } from "../../../../redux/actions/appoint";
import { Check } from "react-feather";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { history } from "../../../../history";
import "../../../../assets/scss/pages/authentication.scss";
import { connect } from "react-redux";
import { Fragment } from "react";
import checkcircleempty from "../../../../assets/img/call/check-circle-s.png";
import checkcirclefill from "../../../../assets/img/call/check-circle-s_fill.png";
import previmg from "../../../../assets/img/dashboard/ID13_11_file.png";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import "../../../../assets/scss/plugins/extensions/recharts.scss";
import { gettokbox } from "../../../../redux/actions/data-list/";
import ncall from "../../../../assets/img/dashboard/ID13_11_method_call1.png";
import call from "../../../../assets/img/dashboard/ID13_11_method_call2.png";
import nvideo from "../../../../assets/img/dashboard/ID13_11_method_video1.png";
import video from "../../../../assets/img/dashboard/ID13_11_method_video2.png";
import pressure_1 from "../../../../assets/img/mdstateicon/ID12_08_vital_pressure1.png";
import pressure_3 from "../../../../assets/img/mdstateicon/ID12_08_vital_pressure3.png";
import pressure_4 from "../../../../assets/img/mdstateicon/ID12_08_vital_pressure4.png";
import pressure_5 from "../../../../assets/img/mdstateicon/ID12_08_vital_pressure5.png";
import pulse_1 from "../../../../assets/img/mdstateicon/ID12_08_vital_pulse1.png";
import pulse_3 from "../../../../assets/img/mdstateicon/ID12_08_vital_pulse3.png";
import pulse_4 from "../../../../assets/img/mdstateicon/ID12_08_vital_pulse4.png";
import pulse_5 from "../../../../assets/img/mdstateicon/ID12_08_vital_pulse5.png";
import weight_1 from "../../../../assets/img/mdstateicon/ID12_08_vital_weight1.png";
import weight_3 from "../../../../assets/img/mdstateicon/ID12_08_vital_weight3.png";
import weight_4 from "../../../../assets/img/mdstateicon/ID12_08_vital_weight4.png";
import weight_5 from "../../../../assets/img/mdstateicon/ID12_08_vital_weight5.png";
import glucose_1 from "../../../../assets/img/mdstateicon/ID12_08_vital_glucose1.png";
import glucose_3 from "../../../../assets/img/mdstateicon/ID12_08_vital_glucose3.png";
import glucose_4 from "../../../../assets/img/mdstateicon/ID12_08_vital_glucose4.png";
import glucose_5 from "../../../../assets/img/mdstateicon/ID12_08_vital_glucose5.png";
import temperature_1 from "../../../../assets/img/mdstateicon/ID12_08_vital_temperature1.png";
import temperature_3 from "../../../../assets/img/mdstateicon/ID12_08_vital_temperature3.png";
import temperature_4 from "../../../../assets/img/mdstateicon/ID12_08_vital_temperature4.png";
import temperature_5 from "../../../../assets/img/mdstateicon/ID12_08_vital_temperature5.png";
import spo2_1 from "../../../../assets/img/mdstateicon/ID12_08_vital_spo2 1.png";
import spo2_3 from "../../../../assets/img/mdstateicon/ID12_08_vital_spo2 3.png";
import spo2_4 from "../../../../assets/img/mdstateicon/ID12_08_vital_spo2 4.png";
import spo2_5 from "../../../../assets/img/mdstateicon/ID12_08_vital_spo2 5.png";
import dot from "../../../../assets/img/dashboard/ID13_11_icon.png";
import moment from "moment";
import Countdown from "react-countdown";
import { FormattedMessage } from "react-intl";
import axios from "axios";
import { MoreHorizontal, MoreVertical, CheckCircle } from "react-feather";
import AES256 from "aes-everywhere";
import PhoneForm from "./components/PhoneForm";
import PhoneInfoList from "./components/PhoneInfoList";
import "../../../../assets/scss/pages/allwrap.scss";

import {
  encryptByPubKey,
  decryptByAES,
  AESKey,
} from "../../../../redux/actions/auth/cipherActions";
import firebase from "firebase";
const localFormDate = (scheduleda) => {
  let localscheduledate = moment.utc(scheduleda).toDate();
  localscheduledate = moment(localscheduledate).format("YYYY-MM-DD hh:mm A");

  return localscheduledate;
};

class Seclist extends React.Component {
  render() {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          width: "200px",
          height: "48px",
          borderRadius: "6px",
          border: "1px solid #E7EFF3",
          marginTop: "5px",
          cursor: "pointer",
        }}
        onClick={() => window.open(this.props.row.WEB_URL, "_blank")}
      >
        <div>Second Opinion Data</div>
      </div>
    );
  }
}

class Cslist extends React.Component {
  render() {
    return (
      <div
        className="d-flex align-items-center"
        style={{
          width: "392px",
          height: "48px",
          borderRadius: "6px",
          border: "1px solid #E7EFF3",
          marginLeft: "24px",
          marginRight: "24px",
          marginBottom: "8px",
        }}
      >
        <div style={{ height: "14px" }} className="col-6 text-center ">
          {localFormDate(this.props.row.APPOINT_TIME)}
        </div>
        <div style={{ height: "14px" }} className="col-6 text-center ">
          {this.props.row.NOTE_DX}
        </div>
      </div>
    );
  }
}

class PatientInfo extends React.Component {
  id = 1;
  state = {
    viewfilemodal: false,
    viewfilemodal2: false,
    appointtimeovermodal: false,
    stopentercon: false,
    mouseovervt: false,
    mouseovervtv: false,
    mdnotemodal: false,
    loginstate: "",
    diagnosistype: "normal",
    activeTab: "1",
    overseasTab: "1",
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
    pcode: "",
    pname: "",
    paddress: "",
    telnum: "",
    faxnum: "",
    filename: "",
    file: "",
    rxname: "",
    trpmodal: false,
    uploadcompletemodal: false,
    disableswitch: false,
    information: [
      {
        id: 0,
        name: "",
      },
    ],
    apstate: "",
  };

  postFdaList = () => {
    let fdamedsarr = new Array();
    let fdameds = "";
    if (this.state.information.length >= 2) {
      for (let i = 0; i < this.state.information.length; i++) {
        let fdamedsobject = new Object();

        fdamedsobject = "'" + this.state.information[i].name + "'";

        fdamedsobject = JSON.stringify(fdamedsobject);

        //String 형태로 파싱한 객체를 다시 json으로 변환
        if (fdamedsobject !== undefined) {
          fdamedsarr.push(JSON.parse(fdamedsobject));
        }
      }
      fdameds = fdamedsarr.join(",");
    } else {
      fdameds = this.state.information[0].name;
    }
    console.log(fdameds);

    this.props.putEtcOtc(
      this.props.user.login.values.loggedInUser.username,
      this.props.appo.APPOINT_NUM,
      fdameds,
      this.props.cipher.rsapublickey.publickey
    );
  };

  // etc otc 관련 함수
  handleCreate = (data) => {
    const { information } = this.state;
    this.setState(
      {
        information: information.concat({ id: this.id++, ...data }),
        // information: information.concat({ id: this.id++ }),
      },
      () => console.log(this.state.information)
    );
  };

  handleUpdate = (id, data) => {
    const { information } = this.state;
    this.setState({
      information: information.map(
        (info) =>
          id === info.id
            ? { ...info, ...data } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
            : info // 기존의 값을 그대로 유지
      ),
    });
  };

  handleRemove = (id) => {
    const { information } = this.state;
    this.setState({
      information: information.filter((info) => info.id !== id),
    });
  };
  //

  mdNoteModal = () => {
    this.setState((prevState) => ({
      mdnotemodal: !prevState.mdnotemodal,
    }));
  };

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  toggleOverseas = (tab) => {
    if (this.state.overseasTab !== tab) {
      this.setState({
        overseasTab: tab,
      });
    }
  };

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

  componentDidMount() {
    if (localStorage.getItem("lang") === "ko") {
      this.setState({ thislang: "ko", tslang: "en" });
    } else {
      this.setState({ thislang: "en", tslang: "ko" });
    }
    setTimeout(() => {
      if (this.props.appo !== null) {
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
            console.log(History, "진료내역");
            if (History !== "") {
              this.setState({
                cc: History.NOTE_CC,
                ros: History.NOTE_ROS,
                diagnosis: History.NOTE_DX,
                txrx: History.NOTE_RX,
                recommendation: History.NOTE_VITAL,
                rxname: History.RX_NAME,
                apstate: History.APPOINT_STATE,
              });
            }
          })

          .catch((err) => console.log(err));
      } else {
        this.setState({
          cc: "",
          ros: "",
          diagnosis: "",
          txrx: "",
          recommendation: "",
          rxname: "",
        });
      }
    }, 1000);

    console.log("개인예약정보: ", this.props.secondlist);
  }

  appointTimeOverModal = () => {
    this.setState((prevState) => ({
      appointtimeovermodal: !prevState.appointtimeovermodal,
    }));
  };

  stopEnterCon = () => {
    this.setState((prevState) => ({
      stopentercon: !prevState.stopentercon,
    }));
  };

  goCallSetting = (e) => {
    e.preventDefault();

    // firebase 코드
    let db = firebase.firestore();

    let members = db.collection("Members");
    members
      .doc(this.props.user.login.values.loggedInUser.username)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState(
            {
              loginstate: "Y",
            },
            () => {
              let postData = {
                ID: this.props.user.login.values.loggedInUser.username,
                LOGIN_DATETIME: moment(new Date()).format(
                  "YYYY-MM-DD hh:mm:ss"
                ),
                MemberGubun: "DOCTOR",
                NOW_NAVI: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
                TOKEN: this.props.user.login.values.tokendata,
                VIDEOCHAT_START: moment(new Date()).format(
                  "YYYY-MM-DD hh:mm:ss"
                ),
                VIDEOCHAT_END: moment(this.props.rtime)
                  .add(15, "m")
                  .format("YYYY-MM-DD hh:mm:ss"),
              };

              this.setState({ loginstate: "YYY" }, () => {
                db.collection("Members")
                  .doc(this.props.user.login.values.loggedInUser.username)
                  .update(postData);
              });
            }
          );
        }
      });
    this.props.initPharmacy();
    if (
      moment() >= moment(this.props.rtime).add(-5, "m") &&
      moment() <= moment(this.props.rtime).add(15, "m")
    ) {
      this.props.getPharmacy(
        this.props.pinfo.PATIENT_ID,
        this.props.cipher.rsapublickey.publickey
      );
      this.props.gettokbox(
        this.props.user.login.values.loggedInUser.username,
        this.props.appo.APPOINT_NUM,
        this.props.cipher.rsapublickey.publickey
      );
      this.props.pushCloseSignal(
        this.props.user.login.values.loggedInUser.username,
        this.props.appo.APPOINT_NUM,
        "1",
        this.props.cipher.rsapublickey.publickey
      );
    } else {
      if (moment() > moment(this.props.rtime).add(15, "m")) {
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
            this.props.getPharmacy(
              this.props.pinfo.PATIENT_ID,
              this.props.cipher.rsapublickey.publickey
            );
            let History = response.data.data;
            if (History.APPOINT_STATE === "1") {
              this.props.gettokbox(
                this.props.user.login.values.loggedInUser.username,
                this.props.appo.APPOINT_NUM,
                this.props.cipher.rsapublickey.publickey
              );
              this.props.pushCloseSignal(
                this.props.user.login.values.loggedInUser.username,
                this.props.appo.APPOINT_NUM,
                "1",
                this.props.cipher.rsapublickey.publickey
              );
            } else {
              this.appointTimeOverModal();
            }
          })

          .catch((err) => console.log(err));
      } else {
        this.stopEnterCon();
      }
    }
  };

  goPhoneConsult = (e) => {
    e.preventDefault();
    if (
      moment() >= moment(this.props.rtime).add(-5, "m") &&
      moment() <= moment(this.props.rtime).add(15, "m")
    ) {
      this.props.getPharmacy(
        this.props.pinfo.PATIENT_ID,
        this.props.cipher.rsapublickey.publickey
      );

      history.push("/pages/phoneconsulting");
    } else {
      alert("진료실에 입장합니다.\n전화진료 시각을 참고해 주시기 바랍니다.");
      this.props.getPharmacy(
        this.props.pinfo.PATIENT_ID,
        this.props.cipher.rsapublickey.publickey
      );
      history.push("/pages/phoneconsulting");
    }
  };

  goPastConsultList(pid) {
    this.props.goPCL(pid);
  }

  goVitalData = (e) => {
    e.preventDefault();
    // this.props.resetVitalData()
    history.push("/vitaldata");
  };

  Completionist = () => <span>진료중입니다.</span>;

  postMdNote = () => {
    if (
      this.state.cc === "" ||
      this.state.ros === "" ||
      this.state.diagnosis === "" ||
      this.state.txrx === "" ||
      this.state.recommendation === ""
    ) {
      this.trpModal();
    } else {
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
      .get(`https://teledoc.hicare.net:544/v2.5/patient/treatment/translate`, {
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
      .get(`https://teledoc.hicare.net:544/v2.5/patient/treatment/translate`, {
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
      .get(`https://teledoc.hicare.net:544/v2.5/patient/treatment/translate`, {
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

    let txrxvalue = AES256.encrypt(
      JSON.stringify({
        user_id: this.props.user.login.values.loggedInUser.username,
        lang_source: this.state.thislang,
        lang_target: this.state.tslang,
        note_cont: this.state.txrx,
      }),
      AESKey
    );
    axios
      .get(`https://teledoc.hicare.net:544/v2.5/patient/treatment/translate`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: txrxvalue,
        },
      })
      .then((response) => {
        let contentdata = decryptByAES(response.data.data);
        console.log(contentdata);
        this.setState({ tstxrx: contentdata.CONTENTS });
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
      .get(`https://teledoc.hicare.net:544/v2.5/patient/treatment/translate`, {
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
  render() {
    let file_preview = null;

    {
      this.props.appo === null ||
      this.props.appo.FILE_NAME === "" ||
      this.props.appo.FILE_NAME === "blob"
        ? (file_preview = (
            <img
              className="ml-1"
              width="48px"
              height="48px"
              src={previmg}
              alt=""
            />
          ))
        : this.props.appo.FILE_NAME === ""
        ? (file_preview = (
            <img
              className="ml-1"
              width="48px"
              height="48px"
              src={previmg}
              alt=""
            />
          ))
        : (file_preview = (
            <img
              className="ml-1"
              width="48px"
              height="48px"
              src={
                `${SERVER_URL_TEST_IMG}` +
                // "http://203.251.135.81:9202" +
                this.props.appo.FILE_PATH +
                this.props.appo.FILE_NAME
              }
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
        ? (file_preview2 = (
            <img
              src={previmg}
              className=" ml-1"
              alt=""
              width="48px"
              height="48px"
            />
          ))
        : this.props.appo.FILE_NAME2 === ""
        ? (file_preview2 = (
            <img
              width="48px"
              height="48px"
              src={previmg}
              className=" ml-1"
              alt=""
              style={{ width: "48px", height: "48px" }}
            />
          ))
        : (file_preview2 = (
            <img
              width="48px"
              height="48px"
              src={
                `${SERVER_URL_TEST_IMG}` +
                // "http://203.251.135.81:9202" +
                this.props.appo.FILE_PATH +
                this.props.appo.FILE_NAME2
              }
              className=" ml-1"
              alt=""
              style={{ cursor: "pointer" }}
              onClick={this.viewFileModal2}
            />
          ));
    }

    return (
      <div
        style={{
          width: "1368px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
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
                  src={
                    `${SERVER_URL_TEST_IMG}` +
                    // "http://203.251.135.81:9202" +
                    this.props.appo.FILE_PATH +
                    this.props.appo.FILE_NAME
                  }
                  maxwidth="500px"
                  height="500px"
                  style={{ cursor: "pointer" }}
                  onClick={this.viewFileModal}
                />
              )}
            </Row>
          </ModalBody>
          <ModalFooter className="justify-content-center">
            <Button color="primary" onClick={this.viewFileModal}>
              <FormattedMessage id="확인" />
            </Button>
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
                  src={
                    `${SERVER_URL_TEST_IMG}` +
                    // "http://203.251.135.81:9202" +
                    this.props.appo.FILE_PATH +
                    this.props.appo.FILE_NAME2
                  }
                  maxwidth="500px"
                  height="500px"
                  style={{ cursor: "pointer" }}
                  onClick={this.viewFileModal2}
                />
              )}
            </Row>
          </ModalBody>
          <ModalFooter className="justify-content-center">
            <Button color="primary" onClick={this.viewFileModal2}>
              <FormattedMessage id="확인" />
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.appointtimeovermodal}
          toggle={this.appointTimeOverModal}
          className="modal-md"
        >
          <ModalHeader toggle={this.appointTimeOverModal}></ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <FormattedMessage id="consulting_alert1" />
            </Row>
          </ModalBody>
          <ModalFooter className="justify-content-center">
            <Button color="primary" onClick={this.appointTimeOverModal}>
              <FormattedMessage id="확인" />
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.stopentercon}
          toggle={this.stopEnterCon}
          className="modal-md"
        >
          <ModalHeader toggle={this.stopEnterCon}></ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <FormattedMessage id="consulting_alert2" />
            </Row>
          </ModalBody>
          <ModalFooter className="justify-content-center">
            <Button color="primary" onClick={this.stopEnterCon}>
              <FormattedMessage id="확인" />
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          size="lg"
          style={{
            maxWidth: "604px",
            width: "100%",
            minHeight: "792px",
            maxHeight: "792px",
            height: "100%",
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
          <ModalHeader toggle={this.mdNoteModal}></ModalHeader>
          <ModalBody>
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
                  <h5>Consultation Report</h5>
                </NavLink>
              </NavItem>
              <NavItem className="pt-1">
                &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "2",
                  })}
                  onClick={() => {
                    this.toggle("2");
                  }}
                >
                  <h5>Prescription</h5>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
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
                      this.state.autotsbutton === false ? "primary" : "warning"
                    }
                    onClick={this.autoTranslate}
                  >
                    자동번역
                  </button>
                </div>
                <div>
                  <div className="align-self-center pt-0">C.C</div>
                  <div>
                    <FormGroup className="align-self-center mx-0">
                      <Input
                        type="text"
                        placeholder="C.C"
                        value={
                          this.state.autotsbutton === false
                            ? this.state.cc
                            : this.state.tscc
                        }
                        onChange={(e) => this.setState({ cc: e.target.value })}
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
                        placeholder="ROS"
                        value={
                          this.state.autotsbutton === false
                            ? this.state.ros
                            : this.state.tsros
                        }
                        onChange={(e) => this.setState({ ros: e.target.value })}
                        disabled={
                          this.state.disableswitch === false ? false : true
                        }
                      />
                    </FormGroup>
                  </div>
                </div>
                <div>
                  <div className="align-self-center pt-0">Diagnosis</div>
                  <div>
                    <FormGroup className="align-self-center mx-0">
                      <Input
                        type="text"
                        placeholder="Diagnosis"
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
                <div className="mb-1">
                  <div className="align-self-center pt-0">Tx &amp; Rx</div>
                  <div>
                    <FormGroup className="align-self-center m-0">
                      <Input
                        type="text"
                        placeholder="Tx &amp; Rx"
                        value={
                          this.state.autotsbutton === false
                            ? this.state.txrx
                            : this.state.tstxrx
                        }
                        onChange={(e) =>
                          this.setState({ txrx: e.target.value })
                        }
                        disabled={
                          this.state.disableswitch === false ? false : true
                        }
                      />
                    </FormGroup>
                    <div style={{ fontSize: "12px", color: "#A29EAF" }}>
                      * ETC, OTC를 매칭한 Rx는 Prescription에서 입력할 수
                      있습니다.
                    </div>
                  </div>
                </div>
                <div>
                  <div className="align-self-center pt-0">
                    Vital Data Recommendation
                  </div>
                  <div>
                    <FormGroup className="align-self-center mx-0">
                      <InputGroup>
                        <Input
                          type="textarea"
                          placeholder="Vital Data recommendation"
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
                  </div>
                  <div className="d-flex justify-content-end">
                    {moment().format("YYYY.MM.DD")}
                  </div>
                  <div className="mx-0 mt-2">
                    {/* <Button
                      size="md"
                      onClick={this.postMdNote}
                      disabled={
                        this.state.disableswitch === false ? false : true
                      }
                    >
                      저장
                    </Button> */}
                  </div>
                </div>
              </TabPane>
              <TabPane tabId="2">
                <ButtonGroup size="sm">
                  <Button.Ripple
                    size="sm"
                    outline={this.state.bpbutton === true ? false : true}
                    color="primary"
                    className={classnames({
                      active: this.state.activeTab === "2",
                    })}
                    onClick={() => {
                      this.toggle("2");
                    }}
                  >
                    <h5>In Korea</h5>
                  </Button.Ripple>
                  <Button.Ripple
                    size="sm"
                    outline={this.state.pulsebutton === true ? false : true}
                    color="primary"
                    className={classnames({
                      active: this.state.activeTab === "3",
                    })}
                    onClick={() => {
                      this.toggle("3");
                    }}
                  >
                    <h5>For overseas</h5>
                  </Button.Ripple>
                </ButtonGroup>

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
                    <FormattedMessage id="약국 주소" />
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
                    <FormattedMessage id="처방전 보내기" />
                  </Col>
                  <Col lg="9" md="12" className="d-flex align-self-center">
                    <FormattedMessage id="pharmacy">
                      {(pharmacy) => (
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          label={pharmacy}
                          defaultChecked={false}
                          onChange={this.setpharmacy}
                        />
                      )}
                    </FormattedMessage>
                    <FormattedMessage id="ConsultingRoom">
                      {(ConsultingRoom) => (
                        <Checkbox
                          className="ml-2"
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          label={ConsultingRoom}
                          defaultChecked={false}
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
                          this.state.disableswitch === false ? false : true
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
                    style={{ marginTop: "144px" }}
                    md="12"
                  >
                    {moment().format("YYYY.MM.DD")}
                  </Col>
                  <Col md="12">
                    {/* <Button
                      onClick={this.postPrescription}
                      disabled={
                        this.state.disableswitch === false ? false : true
                      }
                    >
                      저장
                    </Button> */}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <ButtonGroup size="sm">
                  <Button.Ripple
                    size="sm"
                    outline={this.state.bpbutton === true ? false : true}
                    color="primary"
                    className={classnames({
                      active: this.state.activeTab === "2",
                    })}
                    onClick={() => {
                      this.toggle("2");
                    }}
                  >
                    <h5>In Korea</h5>
                  </Button.Ripple>
                  <Button.Ripple
                    size="sm"
                    outline={this.state.pulsebutton === true ? false : true}
                    color="primary"
                    className={classnames({
                      active: this.state.activeTab === "3",
                    })}
                    onClick={() => {
                      this.toggle("3");
                    }}
                  >
                    <h5>For overseas</h5>
                  </Button.Ripple>
                </ButtonGroup>

                <div style={{ marginTop: "40px" }}>
                  <PhoneForm onCreate={this.handleCreate} />
                  <div className="d-flex mx-0" id="medicinelistbar">
                    <div
                      style={{
                        marginTop: "13px",
                        marginLeft: "24px",
                        width: "50%",
                        color: "#113055",
                      }}
                    >
                      <b>처방의약품</b>
                    </div>
                    <div
                      style={{
                        marginTop: "13px",
                        marginLeft: "24px",
                        width: "50%",
                        color: "#113055",
                      }}
                    >
                      <b>매칭의약품</b>
                    </div>
                  </div>
                  <PhoneInfoList
                    className="mx-0"
                    data={this.state.information}
                    onRemove={this.handleRemove}
                    onUpdate={this.handleUpdate}
                  />
                  <div className="px-0 mt-3 col-12 d-flex justify-content-end">
                    {moment().format("YYYY.MM.DD")}
                  </div>
                  {/* <Button className="mt-1" onClick={this.postFdaList}>
                    저장
                  </Button> */}
                </div>
              </TabPane>
            </TabContent>
          </ModalBody>
        </Modal>

        {/* 환자정보, 버튼 모음 Row */}

        <Row>
          <Col className="col-12">
            <table id="tblTopBar">
              <tbody>
                <tr>
                  <th>
                    <div
                      id="tblTopBarTh"
                      style={{
                        marginLeft: "24px",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#113055",
                      }}
                    >
                      {this.props.pinfo.L_NAME + this.props.pinfo.F_NAME}
                    </div>
                  </th>
                  <th style={{ maxWidth: "150px" }}>
                    <div
                      style={{
                        fontWeight: "400",
                      }}
                    >
                      {this.props.appo === null ? null : this.props.topappotime}
                    </div>

                    {this.props.appo === null ? null : this.props.appo
                        .MEDICAL_KIND === "1" ? (
                      <div
                        style={{
                          color: "#a29eaf",
                          fontWeight: "400",
                        }}
                      >
                        General Treatment
                      </div>
                    ) : this.props.appo.MEDICAL_KIND === "2" ? (
                      <div
                        style={{
                          color: "#a29eaf",
                          fontWeight: "400",
                        }}
                      >
                        원격상담, 로컬 협진
                      </div>
                    ) : this.props.appo.MEDICAL_KIND === "3" ? (
                      <div
                        style={{
                          color: "#a29eaf",
                          fontWeight: "400",
                        }}
                      >
                        Second Opnion
                      </div>
                    ) : null}
                  </th>
                  <th className="text-left">
                    <h5 id="vitalIcons">
                      {this.props.pinfo.BP === "01" ? (
                        <img id="혈압" src={pressure_1} alt="pressure_1" />
                      ) : this.props.pinfo.BP === "99" ? (
                        <img id="혈압" src={pressure_1} alt="pressure_1" />
                      ) : this.props.pinfo.BP === "02" ? (
                        <img id="혈압" src={pressure_5} alt="pressure_5" />
                      ) : this.props.pinfo.BP === "03" ? (
                        <img id="혈압" src={pressure_4} alt="pressure_4" />
                      ) : this.props.pinfo.BP === "04" ? (
                        <img id="혈압" src={pressure_3} alt="pressure_3" />
                      ) : null}
                      {this.props.pinfo.PULSE === "01" ? (
                        <img id="맥박" src={pulse_1} alt="pulse_1" />
                      ) : this.props.pinfo.PULSE === "99" ? (
                        <img id="맥박" src={pulse_1} alt="pulse_1" />
                      ) : this.props.pinfo.PULSE === "02" ? (
                        <img id="맥박" src={pulse_5} alt="pulse_5" />
                      ) : this.props.pinfo.PULSE === "03" ? (
                        <img id="맥박" src={pulse_4} alt="pulse_4" />
                      ) : this.props.pinfo.PULSE === "04" ? (
                        <img id="맥박" src={pulse_3} alt="pulse_3" />
                      ) : null}
                      {this.props.pinfo.BW === "01" ? (
                        <img id="체중" src={weight_1} alt="weight_1" />
                      ) : this.props.pinfo.BW === "99" ? (
                        <img id="체중" src={weight_1} alt="weight_1" />
                      ) : this.props.pinfo.BW === "02" ? (
                        <img id="체중" src={weight_5} alt="weight_5" />
                      ) : this.props.pinfo.BW === "03" ? (
                        <img id="체중" src={weight_4} alt="weight_4" />
                      ) : this.props.pinfo.BW === "04" ? (
                        <img id="체중" src={weight_3} alt="weight_3" />
                      ) : null}
                      {this.props.pinfo.BS === "01" ? (
                        <img id="혈당" src={glucose_1} alt="glucose_1" />
                      ) : this.props.pinfo.BS === "99" ? (
                        <img id="혈당" src={glucose_1} alt="glucose_1" />
                      ) : this.props.pinfo.BS === "02" ? (
                        <img id="혈당" src={glucose_5} alt="glucose_5" />
                      ) : this.props.pinfo.BS === "03" ? (
                        <img id="혈당" src={glucose_4} alt="glucose_4" />
                      ) : this.props.pinfo.BS === "04" ? (
                        <img id="혈당" src={glucose_3} alt="glucose_3" />
                      ) : null}
                      {this.props.pinfo.TEMPERATURE === "01" ? (
                        <img
                          id="체온"
                          src={temperature_1}
                          alt="temperature_1"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "99" ? (
                        <img
                          id="체온"
                          src={temperature_1}
                          alt="temperature_1"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "02" ? (
                        <img
                          id="체온"
                          src={temperature_5}
                          alt="temperature_5"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "03" ? (
                        <img
                          id="체온"
                          src={temperature_4}
                          alt="temperature_4"
                        />
                      ) : this.props.pinfo.TEMPERATURE === "04" ? (
                        <img
                          id="체온"
                          src={temperature_3}
                          alt="temperature_3"
                        />
                      ) : null}
                      {this.props.pinfo.SPO2 === "01" ? (
                        <img id="산소포화도" src={spo2_1} alt="spo2_1" />
                      ) : this.props.pinfo.SPO2 === "99" ? (
                        <img id="산소포화도" src={spo2_1} alt="spo2_1" />
                      ) : this.props.pinfo.SPO2 === "02" ? (
                        <img id="산소포화도" src={spo2_5} alt="spo2_5" />
                      ) : this.props.pinfo.SPO2 === "03" ? (
                        <img id="산소포화도" src={spo2_4} alt="spo2_4" />
                      ) : this.props.pinfo.SPO2 === "04" ? (
                        <img id="산소포화도" src={spo2_3} alt="spo2_3" />
                      ) : null}
                    </h5>
                    <UncontrolledTooltip placement="bottom" target="혈압">
                      <FormattedMessage id="혈압" />
                    </UncontrolledTooltip>
                    <UncontrolledTooltip placement="bottom" target="맥박">
                      <FormattedMessage id="맥박" />
                    </UncontrolledTooltip>
                    <UncontrolledTooltip placement="bottom" target="체중">
                      <FormattedMessage id="체중" />
                    </UncontrolledTooltip>
                    <UncontrolledTooltip placement="bottom" target="혈당">
                      <FormattedMessage id="혈당" />
                    </UncontrolledTooltip>
                    <UncontrolledTooltip placement="bottom" target="체온">
                      <FormattedMessage id="체온" />
                    </UncontrolledTooltip>
                    <UncontrolledTooltip placement="bottom" target="산소포화도">
                      <FormattedMessage id="SPO2" />
                    </UncontrolledTooltip>
                  </th>
                  <th>
                    {this.props.appo === null ? (
                      ""
                    ) : moment(this.props.rtime).add(-15, "m") <= moment() &&
                      moment() <= moment(this.props.rtime) ? (
                      <Countdown date={moment(this.props.rtime)}></Countdown>
                    ) : (
                      ""
                    )}
                  </th>
                  <th
                    id="tblBottomBarTh"
                    style={{ paddingRight: "24px" }}
                    className="text-right"
                  >
                    {this.props.appo === null ? null : this.props.appo
                        .APPOINT_STATE === "AF" ||
                      this.props.appo.APPOINT_STATE === "VF" ||
                      this.props.appo.APPOINT_STATE === "TF" ? (
                      <Button onClick={this.goCallSetting} color="primary">
                        진료실 입장
                      </Button>
                    ) : null}
                  </th>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>

        <Row className="mt-1">
          <Col className="col-8">
            <div className="d-flex">
              <div className="px-0 col-6">
                <Card
                  className="mb-1"
                  id="cardshadow"
                  style={{ width: "440px", height: "446px" }}
                >
                  <CardTitle
                    style={{
                      paddingTop: "24px",
                      paddingLeft: "24px",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    Information
                  </CardTitle>
                  <CardBody
                    style={{
                      paddingLeft: "24px",
                    }}
                  >
                    <div className="d-flex">
                      <div
                        style={{ color: "#A29EAF", fontSize: "14px" }}
                        className="col-4 p-0"
                      >
                        <div>
                          <FormattedMessage id="name" />
                        </div>
                        <div>
                          <FormattedMessage id="성별" />
                        </div>
                        <div>
                          <FormattedMessage id="생년월일" />
                        </div>
                        <div>
                          <FormattedMessage id="연락처" />
                        </div>
                      </div>
                      <div
                        style={{ color: "#6E6B7B", fontSize: "14px" }}
                        className="col-8 p-0"
                      >
                        <div>
                          {this.props.pinfo.L_NAME + this.props.pinfo.F_NAME}
                        </div>
                        <div>
                          {this.props.pinfo.GENDER === "1" ||
                          this.props.pinfo.GENDER === "3"
                            ? "M"
                            : "F"}
                        </div>
                        <div>{this.props.pinfo.BIRTH_DT}</div>
                        <div>
                          {this.props.pinfo.MOBILE_NUM.substring(0, 3) +
                            "-" +
                            this.props.pinfo.MOBILE_NUM.substring(3, 7) +
                            "-" +
                            this.props.pinfo.MOBILE_NUM.substring(7, 11)}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex p-0">
                      <div
                        style={{ color: "#A29EAF", fontSize: "14px" }}
                        className="col-4 p-0"
                      >
                        <FormattedMessage id="신장/체중" />
                      </div>
                      <div
                        className="col-8 p-0"
                        style={{ color: "#6E6B7B", fontSize: "14px" }}
                      >
                        {this.props.pinfo.HEIGHT_VAL}cm&nbsp;/&nbsp;
                        {this.props.pinfo.WEIGHT_VAL}kg
                      </div>
                    </div>
                    <div className="d-flex p-0">
                      <div
                        className="col-4 p-0"
                        style={{ color: "#A29EAF", fontSize: "14px" }}
                      >
                        <FormattedMessage id="흡연여부" />
                      </div>
                      <div
                        className="col-8 p-0"
                        style={{ color: "#6E6B7B", fontSize: "14px" }}
                      >
                        {this.props.pinfo.SMOKE_YN === "Y" ? (
                          <FormattedMessage id="흡연" />
                        ) : (
                          <FormattedMessage id="비흡연" />
                        )}
                      </div>
                    </div>
                    <div className="d-flex p-0">
                      <div
                        className="col-4 p-0"
                        style={{ color: "#A29EAF", fontSize: "14px" }}
                      >
                        <FormattedMessage id="음주여부" />
                      </div>
                      <div
                        className="col-8 p-0"
                        style={{ color: "#6E6B7B", fontSize: "14px" }}
                      >
                        {this.props.pinfo.DRINK_YN === "N" ? (
                          <FormattedMessage id="자주" />
                        ) : (
                          <FormattedMessage id="가끔" />
                        )}
                      </div>
                    </div>
                    <div className="d-flex p-0">
                      <div
                        className="col-4 p-0"
                        style={{ color: "#A29EAF", fontSize: "14px" }}
                      >
                        <FormattedMessage id="본인병력" />
                      </div>
                      <div
                        className="col-8 p-0"
                        style={{ color: "#6E6B7B", fontSize: "14px" }}
                      >
                        {this.props.pinfo.DISEASE_DESC === "" ||
                        this.props.pinfo.DISEASE_DESC === "없음" ? (
                          <FormattedMessage id="없음" />
                        ) : (
                          this.props.pinfo.DISEASE_DESC
                        )}
                      </div>
                    </div>
                    <div className="d-flex p-0">
                      <div
                        className="col-4 p-0"
                        style={{ color: "#A29EAF", fontSize: "14px" }}
                      >
                        <FormattedMessage id="가족병력" />
                      </div>
                      <div
                        className="col-8 p-0"
                        style={{ color: "#6E6B7B", fontSize: "14px" }}
                      >
                        {this.props.pinfo.FAMILY_DESC === "" ||
                        this.props.pinfo.DISEASE_DESC === "없음" ? (
                          <FormattedMessage id="없음" />
                        ) : (
                          this.props.pinfo.FAMILY_DESC
                        )}
                      </div>
                    </div>
                    <div className="d-flex p-0">
                      <div
                        className="col-4 p-0"
                        style={{ color: "#A29EAF", fontSize: "14px" }}
                      >
                        <FormattedMessage id="복용중인 약" />
                      </div>
                      <div
                        className="col-8 p-0"
                        style={{ color: "#6E6B7B", fontSize: "14px" }}
                      >
                        {this.props.pinfo.USE_MED === "" ||
                        this.props.pinfo.DISEASE_DESC === "없음" ? (
                          <FormattedMessage id="없음" />
                        ) : (
                          this.props.pinfo.USE_MED
                        )}
                      </div>
                    </div>
                    <div className="d-flex p-0">
                      <div
                        className="col-4 p-0"
                        style={{ color: "#A29EAF", fontSize: "14px" }}
                      >
                        <FormattedMessage id="알러지유무" />
                      </div>
                      <div
                        className="col-8 p-0"
                        style={{ color: "#6E6B7B", fontSize: "14px" }}
                      >
                        {this.props.pinfo.ALLERGY_YN === "Y" ? (
                          <FormattedMessage id="알러지있음" />
                        ) : (
                          <FormattedMessage id="알러지없음" />
                        )}

                        {this.props.pinfo.ALLERGY_YN === "N" ||
                        this.props.pinfo.ALLERGY_DESC === ""
                          ? ""
                          : this.props.pinfo.ALLERGY_DESC}
                      </div>
                    </div>
                    <div className="d-flex p-0">
                      <div
                        className="col-4 p-0"
                        style={{ color: "#A29EAF", fontSize: "14px" }}
                      >
                        <FormattedMessage id="Allergic_Reaction" />
                      </div>
                      <div
                        className="col-8 p-0"
                        style={{ color: "#6E6B7B", fontSize: "14px" }}
                      >
                        {this.props.pinfo.ALLERGY_ACT === "1110" ||
                        this.props.pinfo.ALLERGY_ACT === "1111" ? (
                          <div>
                            <FormattedMessage id="rash" />,
                            <FormattedMessage id="itch" />,
                            <FormattedMessage id="hives" />
                          </div>
                        ) : this.props.pinfo.ALLERGY_ACT === "0110" ||
                          this.props.pinfo.ALLERGY_ACT === "0111" ? (
                          <div>
                            <FormattedMessage id="itch" />,
                            <FormattedMessage id="hives" />
                          </div>
                        ) : this.props.pinfo.ALLERGY_ACT === "0010" ||
                          this.props.pinfo.ALLERGY_ACT === "0011" ? (
                          <div>
                            <FormattedMessage id="hives" />
                          </div>
                        ) : this.props.pinfo.ALLERGY_ACT === "1010" ||
                          this.props.pinfo.ALLERGY_ACT === "1011" ? (
                          <div>
                            <FormattedMessage id="rash" />,
                            <FormattedMessage id="hives" />
                          </div>
                        ) : this.props.pinfo.ALLERGY_ACT === "1100" ||
                          this.props.pinfo.ALLERGY_ACT === "1101" ? (
                          <div>
                            <FormattedMessage id="rash" />,
                            <FormattedMessage id="itch" />
                          </div>
                        ) : this.props.pinfo.ALLERGY_ACT === "1000" ||
                          this.props.pinfo.ALLERGY_ACT === "1001" ? (
                          <div>
                            <FormattedMessage id="rash" />
                          </div>
                        ) : this.props.pinfo.ALLERGY_ACT === "0100" ||
                          this.props.pinfo.ALLERGY_ACT === "0101" ? (
                          <div>
                            <FormattedMessage id="itch" />
                          </div>
                        ) : (
                          <FormattedMessage id="없음" />
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className="px-0 ml-1 col-6">
                <Card
                  id="cardshadow"
                  className="mb-1"
                  style={{
                    width: "440px",
                    minheight: "234px",
                    maxHeight: "234px",
                  }}
                >
                  <CardBody className="px-0">
                    <div
                      style={{
                        marginLeft: "24px",
                        marginRight: "24px",
                        paddingBottom: "16px",
                        borderBottom: "1px solid #E7EFF3",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                        }}
                      >
                        <FormattedMessage id="Present Condition" />
                      </div>
                      <div
                        className="p-0"
                        style={{
                          marginTop: "16px",
                          height: "34px",
                        }}
                      >
                        <PerfectScrollbar>
                          {this.props.appo === null
                            ? ""
                            : this.props.appo.SYMPTOM}
                        </PerfectScrollbar>
                      </div>
                    </div>
                    <div style={{ marginTop: "16px" }}>
                      <div
                        style={{
                          marginLeft: "24px",
                          marginRight: "24px",
                        }}
                      >
                        <div
                          style={{
                            marginBottom: "20px",
                          }}
                        >
                          <FormattedMessage id="Files" />
                        </div>

                        {file_preview}
                        {file_preview2}
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card
                  style={{ width: "440px", height: "188px", marginTop: "24px" }}
                  id="cardshadow"
                >
                  <CardTitle
                    style={{
                      paddingTop: "24px",
                      paddingLeft: "24px",
                      paddingRight: "24px",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                    className="d-flex justify-content-between"
                  >
                    Consulting
                    {this.state.mouseovervt === false ? (
                      <i
                        id="more"
                        onMouseEnter={() =>
                          this.setState({ mouseovervt: true })
                        }
                        onMouseLeave={() =>
                          this.setState({ mouseovervt: false })
                        }
                        onClick={() =>
                          this.goPastConsultList(this.props.pinfo.PATIENT_ID)
                        }
                        style={{
                          marginRight: "2px",
                          width: "32px",
                          height: "32px",
                          cursor: "pointer",
                        }}
                      >
                        <MoreVertical
                          style={{
                            marginLeft: "4px",
                            width: "24px",
                            height: "24px",
                            color: "#3d4044",
                          }}
                        />
                      </i>
                    ) : (
                      <i
                        id="more"
                        onMouseEnter={() =>
                          this.setState({ mouseovervt: true })
                        }
                        onMouseLeave={() =>
                          this.setState({ mouseovervt: false })
                        }
                        onClick={() =>
                          this.goPastConsultList(this.props.pinfo.PATIENT_ID)
                        }
                        style={{
                          marginRight: "2px",
                          width: "32px",
                          height: "32px",
                          cursor: "pointer",
                          backgroundColor: "#f8f8f8",
                          borderRadius: "5px",
                          boxShadow: "-1px 1px 15px -5px #7367f0",
                        }}
                      >
                        <MoreVertical
                          style={{
                            marginLeft: "4px",
                            width: "24px",
                            height: "24px",
                            color: "#7367f0",
                          }}
                        />
                      </i>
                    )}
                    <UncontrolledTooltip placement="bottom" target="more">
                      더보기
                    </UncontrolledTooltip>
                  </CardTitle>
                  <CardBody className="p-0 m-0">
                    {this.props.cslist.map((row) => (
                      <Cslist
                        style={{
                          height: "104px",
                        }}
                        key={row.APPOINT_TIME}
                        row={row}
                      />
                    ))}
                  </CardBody>
                </Card>
              </div>
            </div>
            <Card id="cardshadow" style={{ height: "250px", width: "904px" }}>
              <CardTitle
                className="d-flex justify-content-between"
                style={{
                  paddingTop: "24px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                <div>Vital Data</div>
                {this.state.mouseovervtv === false ? (
                  <i
                    id="morev"
                    onMouseEnter={() => this.setState({ mouseovervtv: true })}
                    onMouseLeave={() => this.setState({ mouseovervtv: false })}
                    onClick={this.goVitalData}
                    style={{
                      marginRight: "2px",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                    }}
                  >
                    <MoreVertical
                      style={{
                        marginLeft: "4px",
                        width: "24px",
                        height: "24px",
                        color: "#3d4044",
                      }}
                    />
                  </i>
                ) : (
                  <i
                    id="morev"
                    onMouseEnter={() => this.setState({ mouseovervtv: true })}
                    onMouseLeave={() => this.setState({ mouseovervtv: false })}
                    onClick={this.goVitalData}
                    style={{
                      marginRight: "2px",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      backgroundColor: "#f8f8f8",
                      borderRadius: "5px",
                      boxShadow: "-1px 1px 15px -5px #7367f0",
                    }}
                  >
                    <MoreVertical
                      style={{
                        marginLeft: "4px",
                        width: "24px",
                        height: "24px",
                        color: "#7367f0",
                      }}
                    />
                  </i>
                )}
                <UncontrolledTooltip placement="bottom" target="morev">
                  더보기
                </UncontrolledTooltip>
              </CardTitle>
              <CardBody className="d-flex pl-0">
                <div className="d-flex col-12 pl-0">
                  {this.props.bpdata.length === 0 ? null : (
                    <div className="col-2 pl-0">
                      <Row className="justify-content-center">
                        <h5>
                          <FormattedMessage id="혈압" />
                        </h5>
                      </Row>
                      <ResponsiveContainer height="95%">
                        <LineChart className="col-2" data={this.props.bpdata}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            tick={{ fontSize: 10 }}
                            dataKey="CREATE_TIME"
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend style={{ marginTop: "1px" }} />
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
                      <Row className="justify-content-center">
                        <h5>
                          <FormattedMessage id="맥박" />
                        </h5>
                      </Row>
                      <ResponsiveContainer height="95%">
                        <LineChart
                          className="col-2"
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
                            name="bpm"
                            type="monotone"
                            dataKey="PULSE_VAL"
                            stroke="#EA5455"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {this.props.wedata.length === 0 ? null : (
                    <div className="col-2 pl-0">
                      <Row className="justify-content-center">
                        <h5>
                          <FormattedMessage id="체중" />
                        </h5>
                      </Row>
                      <ResponsiveContainer height="95%">
                        <LineChart className="col-2" data={this.props.wedata}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            tick={{ fontSize: 10 }}
                            dataKey="CREATE_TIME"
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            name="kg"
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

                  {this.props.bsdata.length === 0 ? null : (
                    <div className="col-2 pl-0">
                      <Row className="justify-content-center">
                        <h5>
                          <FormattedMessage id="혈당" />
                        </h5>
                      </Row>
                      <ResponsiveContainer height="95%">
                        <LineChart className="col-2" data={this.props.bsdata}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            tick={{ fontSize: 10 }}
                            dataKey="CREATE_TIME"
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            name="glucose"
                            type="monotone"
                            dataKey="GLUCOSE_VAL"
                            stroke="#EA5455"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {this.props.tempdata.length === 0 ? null : (
                    <div className="col-2 pl-0">
                      <Row className="justify-content-center">
                        <h5>
                          <FormattedMessage id="체온" />
                        </h5>
                      </Row>
                      <ResponsiveContainer height="95%">
                        <LineChart className="col-2" data={this.props.tempdata}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            tick={{ fontSize: 10 }}
                            dataKey="CREATE_TIME"
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            name="°C"
                            type="monotone"
                            dataKey="TEMP_VAL"
                            stroke="#EA5455"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {this.props.spo2data.length === 0 ? null : (
                    <div className="col-2 pl-0">
                      <Row className="justify-content-center">
                        <h5>
                          <FormattedMessage id="SPO2" />
                        </h5>
                      </Row>
                      <ResponsiveContainer height="95%">
                        <LineChart className="col-2" data={this.props.spo2data}>
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
          </Col>

          <Col className="col-4 px-0">
            <Card
              id="cardshadow"
              className="ml-1"
              style={{ width: "440px", height: "720px" }}
            >
              <CardBody
                style={{
                  paddingTop: "24px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                }}
              >
                {this.props.appo === null ? null : this.props.appo
                    .MEDICAL_KIND === "1" ? (
                  <div style={{ height: "134px" }}>
                    <div>
                      {this.state.apstate === "TF" ? (
                        <img
                          className="mr-1"
                          width="20px"
                          height="20px"
                          src={checkcirclefill}
                        />
                      ) : (
                        <img
                          className="mr-1"
                          width="20px"
                          height="20px"
                          src={checkcircleempty}
                        />
                      )}
                      화상진료
                    </div>
                    <div style={{ marginTop: "24px" }}>
                      {this.state.cc !== "" && this.state.rxname !== "" ? (
                        <img
                          className="mr-1"
                          width="20px"
                          height="20px"
                          src={checkcirclefill}
                        />
                      ) : (
                        <img
                          className="mr-1"
                          width="20px"
                          height="20px"
                          src={checkcircleempty}
                        />
                      )}
                      진료 결과 작성
                    </div>
                  </div>
                ) : this.props.appo.MEDICAL_KIND === "2" ? (
                  <div style={{ height: "134px" }}>
                    <div>
                      {this.state.apstate === "TF" ? (
                        <img
                          className="mr-1"
                          width="20px"
                          height="20px"
                          src={checkcirclefill}
                        />
                      ) : (
                        <img
                          className="mr-1"
                          width="20px"
                          height="20px"
                          src={checkcircleempty}
                        />
                      )}
                      화상진료
                    </div>
                    <div style={{ marginTop: "24px" }}>
                      {this.state.cc !== "" && this.state.rxname !== "" ? (
                        <img
                          className="mr-1"
                          width="20px"
                          height="20px"
                          src={checkcirclefill}
                        />
                      ) : (
                        <img
                          className="mr-1"
                          width="20px"
                          height="20px"
                          src={checkcircleempty}
                        />
                      )}
                      진료 결과 작성 ∙ 로컬 협진 기관 공유
                    </div>
                  </div>
                ) : this.props.appo.MEDICAL_KIND === "3" ? (
                  <div style={{ height: "134px" }}>
                    <div>
                      <img
                        className="mr-1"
                        width="20px"
                        height="20px"
                        src={checkcircleempty}
                      />
                      Second Opinion 데이터 전송
                    </div>
                    <div style={{ marginTop: "24px" }}>
                      {this.state.apstate === "TF" ? (
                        <img
                          className="mr-1"
                          width="20px"
                          height="20px"
                          src={checkcirclefill}
                        />
                      ) : (
                        <img
                          className="mr-1"
                          width="20px"
                          height="20px"
                          src={checkcircleempty}
                        />
                      )}
                      화상 진료
                    </div>
                    <div style={{ marginTop: "24px" }}>
                      {this.state.cc !== "" && this.state.rxname !== "" ? (
                        <img
                          className="mr-1"
                          width="20px"
                          height="20px"
                          src={checkcirclefill}
                        />
                      ) : (
                        <img
                          className="mr-1"
                          width="20px"
                          height="20px"
                          src={checkcircleempty}
                        />
                      )}
                      진료 결과 작성
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}

                {this.props.appo === null ? null : this.props.appo
                    .MEDICAL_KIND === "3" ? (
                  <div
                    className="mt-2"
                    style={{
                      marginBottom: "50px",
                      borderTop: "1px solid #E7EFF3",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "700",
                        marginTop: "40px",
                        color: "#113055",
                      }}
                    >
                      Second Opinion 판독
                    </div>
                    <div>
                      Deadline{" "}
                      <span style={{ color: "#1565C0" }}>
                        {moment(Date(this.props.topappotime))
                          .subtract(7, "days")
                          .format("YYYY.MM.DD (dddd) a h:mm")}
                      </span>
                    </div>
                    <div className=" mt-1" style={{ height: "110px" }}>
                      <PerfectScrollbar>
                        {/* <div
                        className="d-flex justify-content-center"
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          border: "1px solid #C7D1DA",
                          cursor: "pointer",
                          width: "116px",
                          height: "32px",
                          background: "#FFFEFE",
                          borderRadius: "4px",
                        }}
                      >
                        인피니트 뷰어
                      </div> */}
                        {this.props.secondlist.map((row) => (
                          <Seclist
                            style={{
                              height: "104px",
                            }}
                            key={row.STUDY_KEY}
                            row={row}
                          />
                        ))}
                      </PerfectScrollbar>
                    </div>
                  </div>
                ) : null}

                <div style={{ borderTop: "1px solid #E7EFF3" }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      marginTop: "40px",
                    }}
                  >
                    진료 및 처방
                  </div>

                  <div className="d-flex mt-1">
                    <Button
                      disabled={this.state.cc !== "" ? false : true}
                      color="primary"
                      onClick={() =>
                        this.setState({ activeTab: "1" }, () =>
                          this.mdNoteModal()
                        )
                      }
                    >
                      상담 Report
                    </Button>
                    <Button
                      disabled={this.state.rxname !== "" ? false : true}
                      color="primary"
                      className="ml-1"
                      onClick={() =>
                        this.setState({ activeTab: "2" }, () =>
                          this.mdNoteModal()
                        )
                      }
                    >
                      Prescription
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
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
    rtime: state.dataList.rtime,
    pharmacy: state.dataList.pharmacy,
    topappotime: state.dataList.topappotime,
    secondlist: state.dataList.secondlist,
    cipher: state.auth.cipher,
  };
};

export default connect(mapStateToProps, {
  goPCL,
  putEtcOtc,
  resetVitalData,
  gettokbox,
  initPharmacy,
  getPharmacy,
  pushCloseSignal,
  postMDNoteData,
  postPrescriptionData,
})(PatientInfo);
