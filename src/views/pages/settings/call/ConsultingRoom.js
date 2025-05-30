import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
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
  putStateComplete,
  pushEndCloseSignal,
} from "../../../../redux/actions/data-list/";
import { saveCookieConsult } from "../../../../redux/actions/cookies/";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Clipboard,
  Film,
  Edit,
  LogOut,
  Settings,
} from "react-feather";
import "../../../../assets/scss/pages/authentication.scss";
import { connect } from "react-redux";
import axios from "axios";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import "../../../../assets/scss/plugins/extensions/recharts.scss";
import Opentok from "./opentok";
import previmg from "../../../../assets/img/dashboard/ID13_11_file.png";
import moment from "moment";
import Select from "react-select";
import VitalDataM from "../../../ui-elements/patient-list/PatientInfo/VitalDataM";
import PastConsultList from "../../../ui-elements/patient-list/PatientInfo/DataListConfigM";
import queryString from "query-string";
import Countdown, { zeroPad } from "react-countdown";
import { FormattedMessage } from "react-intl";
import Draggable from "react-draggable";
import { MoreVertical } from "react-feather";
import { UncontrolledTooltip } from "reactstrap";
import AES256 from "aes-everywhere";
import { SERVER_URL2, SERVER_URL_TEST_IMG } from "../../../../config";
import {
  encryptByPubKey,
  decryptByAES,
  AESKey,
} from "../../../../redux/actions/auth/cipherActions";

const localFormDate = (scheduleda) => {
  let localscheduledate = moment.utc(scheduleda).toDate();
  localscheduledate = moment(localscheduledate).format("YYYY-MM-DD hh:mm A");
  return localscheduledate;
};

const cameraPermission = navigator.permissions.query({ name: "camera" });
const microphonePermission = navigator.permissions.query({
  name: "microphone",
});

if (cameraPermission.state === "denied") {
  alert("카메라 권한이 거부되었습니다.");
}
if (microphonePermission.state === "denied") {
  alert("마이크 권한이 거부되었습니다.");
}

let win;

window.onbeforeunload = function () {
  win.close();
};

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
          {localFormDate(this.props.row.CONSULT_LIST)}
        </div>
        <div style={{ height: "14px" }} className="col-6 text-center ">
          {this.props.row.NOTE_DX}
        </div>
      </div>
    );
  }
}

// Random component
const Completionist = () => (
  <span style={{ color: "#FFFEFE", fontSize: "18px", fontWeight: "500" }}>
    진료시간종료
  </span>
);

// Renderer callback with condition
const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return (
      <Completionist
        style={{ color: "#FFFEFE", fontSize: "18px", fontWeight: "500" }}
      />
    );
  } else {
    // Render a countdown
    return (
      <span style={{ color: "#FFFEFE", fontSize: "18px", fontWeight: "500" }}>
        {zeroPad(minutes)}:{zeroPad(seconds)}
      </span>
    );
  }
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

class ConsultingRoom extends React.Component {
  id = 1;
  constructor(props) {
    super(props);
    this.state = {
      streams: [],
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
      mdnotemodal: false,
      pharmacy: false,
      App: false,
      viewfilemodal: false,
      viewfilemodal2: false,
      settingmodal: false,
      screenshare: false,
      vitaldatamodal: false,
      pclmodal: false,
      camera: [],
      mic: [],
      speaker: [],
      cameraset: {},
      micset: {},
      speakerset: {},
      onsubscribe: "N",
      disconnect: false,
      questionmodal: false,
      gonomemodal: false,
      publishScreen: false,
      archiving: "N",
      rxname: "",
      disableswitch: false,
      prescriptionmodal: false,
      trpmodal: false,
      mouseovervt: false,
      mouseovervtv: false,
      camerastate: true,
      micstate: true,
      patientinfomodal: false,
      secondopmodal: false,
      puteostate: false,
      postmdnodecomplete: false,
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

  openReportPopup = () => {
    win = window.open(
      `${window.location.search}/pages/report`,
      "상담 Report",
      "width=791,height=592,status=no"
    );
  };

  toggleScreenshare = () => {
    this.setState((state) => ({
      publishScreen: !state.publishScreen,
    }));
  };

  publishScreenError = () => {
    console.log("publishScreenError");
    this.setState({ publishScreen: false });
  };

  componentDidMount() {
    (async () => {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      let devices = await navigator.mediaDevices.enumerateDevices().catch();
      console.log(devices);
      let camera = await devices.filter(
        (devices) => devices.kind === "videoinput"
      );
      let mic = await devices.filter(
        (devices) => devices.kind === "audioinput"
      );
      let speaker = await devices.filter(
        (devices) => devices.kind === "audiooutput"
      );

      let modifiedcamera = new Array();
      for (let i = 0; i < camera.length; i++) {
        let item = {
          deviceId: camera[i].deviceId,
          groupId: camera[i].groupId,
          kind: camera[i].kind,
          value: camera[i].label,
          label: camera[i].label,
        };
        modifiedcamera.push(item);
      }

      let modifiedmic = new Array();
      for (let i = 0; i < mic.length; i++) {
        let item = {
          deviceId: mic[i].deviceId,
          groupId: mic[i].groupId,
          kind: mic[i].kind,
          value: mic[i].label,
          label: mic[i].label,
        };
        modifiedmic.push(item);
      }

      let modifiedspeaker = new Array();
      for (let i = 0; i < speaker.length; i++) {
        let item = {
          deviceId: speaker[i].deviceId,
          groupId: speaker[i].groupId,
          kind: speaker[i].kind,
          value: speaker[i].label,
          label: speaker[i].label,
        };
        modifiedspeaker.push(item);
      }

      await this.setState({ camera: modifiedcamera });
      await this.setState({ mic: modifiedmic });
      await this.setState({ speaker: modifiedspeaker });
    })();

    navigator.mediaDevices.addEventListener("devicechange", () => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        let camera = devices.filter((devices) => devices.kind === "videoinput");
        let mic = devices.filter((devices) => devices.kind === "audioinput");
        let speaker = devices.filter(
          (devices) => devices.kind === "audiooutput"
        );

        let modifiedcamera = new Array();
        for (let i = 0; i < camera.length; i++) {
          let item = {
            deviceId: camera[i].deviceId,
            groupId: camera[i].groupId,
            kind: camera[i].kind,
            value: camera[i].label,
            label: camera[i].label,
          };
          modifiedcamera.push(item);
        }

        let modifiedmic = new Array();
        for (let i = 0; i < mic.length; i++) {
          let item = {
            deviceId: mic[i].deviceId,
            groupId: mic[i].groupId,
            kind: mic[i].kind,
            value: mic[i].label,
            label: mic[i].label,
          };
          modifiedmic.push(item);
        }

        let modifiedspeaker = new Array();
        for (let i = 0; i < speaker.length; i++) {
          let item = {
            deviceId: speaker[i].deviceId,
            groupId: speaker[i].groupId,
            kind: speaker[i].kind,
            value: speaker[i].label,
            label: speaker[i].label,
          };
          modifiedspeaker.push(item);
        }

        this.setState({ camera: modifiedcamera });
        this.setState({ mic: modifiedmic });
        this.setState({ speaker: modifiedspeaker });
        console.log(devices);
      });
    });
    if (localStorage.getItem("lang") === "ko") {
      this.setState({ thislang: "ko", tslang: "en" });
    } else {
      this.setState({ thislang: "en", tslang: "ko" });
    }
  }

  startarchiveVideo = () => {
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );

    axios
      .get(`${SERVER_URL2}/doctor/treatment/archive-start`, {
        // .get(`http://192.168.0.45:9302/v2.5/doctor/treatment/archive-start`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: AES256.encrypt(
            JSON.stringify({
              user_id: this.props.user.login.values.loggedInUser.username,
              appoint_num: this.props.appo.APPOINT_NUM,
              session_id: this.props.dataList.tokbox.TOK_SESSION,
              has_audio: true,
              has_video: true,
              output_mode: "composed",
            }),
            AESKey
          ),
        },
      })
      .then((response) => {
        if (response.data.status === "200") {
          console.log(decryptByAES(response.data.data));

          let archiveid = decryptByAES(response.data.data)["id"];
          console.log(archiveid);
          this.setState({ archiving: "Y", archiveid: archiveid });
        } else {
          console.log(response);
        }
      });
  };

  stoparchiveVideo = () => {
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    axios
      .get(`${SERVER_URL2}/doctor/treatment/archive-stop`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: AES256.encrypt(
            JSON.stringify({
              user_id: this.props.user.login.values.loggedInUser.username,
              appoint_num: this.props.appo.APPOINT_NUM,
              archive_id: this.state.archiveid,
            }),
            AESKey
          ),
        },
      })
      .then((response) => {
        console.log(response);
        this.setState({ archiving: "N" });
      });
  };

  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer);
    }
  }

  patientInfoModal = () => {
    this.setState((prevState) => ({
      patientinfomodal: !prevState.patientinfomodal,
    }));
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

  goVitalData = (e) => {
    e.preventDefault();
    this.vitaldataModal();
  };

  vitaldataModal = () => {
    this.setState((prevState) => ({
      vitaldatamodal: !prevState.vitaldatamodal,
    }));
  };

  mdNoteModal = () => {
    this.setState((prevState) => ({
      mdnotemodal: !prevState.mdnotemodal,
    }));
  };

  settingModal = () => {
    this.setState((prevState) => ({
      settingmodal: !prevState.settingmodal,
    }));
  };

  setScreenShare = () => {
    this.setState((prevState) => ({
      screenshare: !prevState.screenshare,
    }));
  };

  trpModal = () => {
    this.setState((prevState) => ({
      trpmodal: !prevState.trpmodal,
    }));
  };

  goHome = (e) => {
    e.preventDefault();
    win.close();
    if (localStorage.getItem("reportcomplete") !== "Y") {
      this.trpModal();
    } else {
      this.goHomeModal();
    }
  };

  goHomeModal = () => {
    this.setState((prevState) => ({
      gohomemodal: !prevState.gohomemodal,
    }));
  };

  prescriptionModal = () => {
    this.setState((prevState) => ({
      prescriptionmodal: !prevState.prescriptionmodal,
    }));
  };

  checkStatePat = () => {};

  pushGoHome = () => {
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
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
        let docpatstate = decryptByAES(response.data.data);
        if (docpatstate.STATE_PAT === "2") {
          this.props.pushEndCloseSignal(
            this.props.user.login.values.loggedInUser.username,
            this.props.appo.APPOINT_NUM,
            "2",
            this.props.cipher.rsapublickey.publickey
          );
          this.props.putStateComplete(
            this.props.user.login.values.loggedInUser.username,
            this.props.appo.APPOINT_NUM,
            "TF",
            this.props.cipher.rsapublickey.publickey
          );
        } else {
          if (docpatstate.STATE_PAT === "1") {
            this.props.pushEndCloseSignal(
              this.props.user.login.values.loggedInUser.username,
              this.props.appo.APPOINT_NUM,
              "2",
              this.props.cipher.rsapublickey.publickey
            );
            // 테스트 필요
            this.props.putStateComplete(
              this.props.user.login.values.loggedInUser.username,
              this.props.appo.APPOINT_NUM,
              "TF",
              this.props.cipher.rsapublickey.publickey
            );
          } else {
            this.props.pushEndCloseSignal(
              this.props.user.login.values.loggedInUser.username,
              this.props.appo.APPOINT_NUM,
              "",
              this.props.cipher.rsapublickey.publickey
            );
            // 테스트용 추후 환자까지 연동되면 지울 예정
            this.props.putStateComplete(
              this.props.user.login.values.loggedInUser.username,
              this.props.appo.APPOINT_NUM,
              "TF",
              this.props.cipher.rsapublickey.publickey
            );
          }
        }
      })
      .catch((err) => console.log(err));
  };

  pushPresGoHome = () => {
    this.prescriptionModal();
    this.goHomeModal();
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

  Check = (e) => {
    e.preventDefault();
    console.log(this.state);
  };

  setSpeaker = (e) => {
    e.preventDefault();
    const audioEl = new Audio();
    audioEl
      .setSinkId(this.state.speakerset.deviceId)
      .then(function () {
        // console.log('Set deviceId('+audioEl.sinkId+') in the selected audio element');
      })
      .catch((error) => console.log(error));
    // console.log('Audio is being played on ' + audioEl.sinkId);
  };

  parentFunction = (data) => {
    this.setState({ onsubscribe: data });
  };

  questionModal = () => {
    this.setState((prevState) => ({
      questionmodal: !prevState.questionmodal,
    }));
  };

  cameraState = () => {
    this.setState((prevState) => ({
      camerastate: !prevState.camerastate,
    }));
  };

  micState = () => {
    this.setState((prevState) => ({
      micstate: !prevState.micstate,
    }));
  };

  secondOpModal = () => {
    this.setState((prevState) => ({
      secondopmodal: !prevState.secondopmodal,
    }));
  };

  render() {
    let file_preview = null;

    {
      this.props.appo === null ||
      this.props.appo.FILE_NAME === "" ||
      this.props.appo.FILE_NAME === "blob"
        ? (file_preview = <img src={previmg} className="dz-img" alt="" />)
        : (file_preview = (
            <img
              width="50px"
              height="50px"
              src={
                `${SERVER_URL_TEST_IMG}` +
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
        ? (file_preview2 = <img src={previmg} className="dz-img ml-1" alt="" />)
        : (file_preview2 = (
            <img
              width="50px"
              height="50px"
              src={
                `${SERVER_URL_TEST_IMG}` +
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
      <div
        className="m-0 p-0 h-100"
        style={{ alignItems: "center", background: "#0B0F21" }}
      >
        <PerfectScrollbar>
          <Modal
            isOpen={this.state.secondopmodal}
            toggle={this.secondOpModal}
            backdrop={false}
            size="md"
            style={{
              minWidth: "220px",
              minHeight: "150px",
              position: "absolute",
              bottom: "8%",
              right: "40%",
            }}
          >
            <ModalHeader toggle={this.secondOpModal}>
              <b>Decipher</b>
            </ModalHeader>
            <ModalBody>
              <PerfectScrollbar>
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
            </ModalBody>
          </Modal>

          <Modal
            size="lg"
            style={{
              maxWidth: "930px",
              width: "100%",
              position: "absolute",
              top: "4%",
              right: "3%",
            }}
            isOpen={this.state.patientinfomodal}
            toggle={this.patientInfoModal}
            backdrop={false}
          >
            <ModalHeader toggle={this.patientInfoModal}>
              <b>Patient Information</b>
            </ModalHeader>
            <ModalBody>
              <div className="d-flex justify-content-between">
                <div className="pl-0 col-6">
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
                          <div style={{ marginTop: "8px" }}>
                            <FormattedMessage id="생년월일" />
                          </div>
                          <div style={{ marginTop: "8px" }}>
                            <FormattedMessage id="성별" />
                          </div>
                          <div style={{ marginTop: "8px" }}>
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
                          <div style={{ marginTop: "8px" }}>
                            {this.props.pinfo.BIRTH_DT}
                          </div>
                          <div style={{ marginTop: "8px" }}>
                            {this.props.pinfo.GENDER === "1" ||
                            this.props.pinfo.GENDER === "3" ? (
                              <FormattedMessage id="남성" />
                            ) : (
                              <FormattedMessage id="여성" />
                            )}
                          </div>
                          <div style={{ marginTop: "8px" }}>
                            +{this.props.pinfo.NATIONAL_NUM + " "}
                            {this.props.pinfo.MOBILE_NUM.substring(0, 3) +
                              "-" +
                              this.props.pinfo.MOBILE_NUM.substring(3, 7) +
                              "-" +
                              this.props.pinfo.MOBILE_NUM.substring(7, 11)}
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: "8px" }} className="d-flex p-0">
                        <div
                          style={{ color: "#A29EAF", fontSize: "14px" }}
                          className="col-4 p-0"
                        >
                          <FormattedMessage id="키" />
                        </div>
                        <div
                          className="col-8 p-0"
                          style={{ color: "#6E6B7B", fontSize: "14px" }}
                        >
                          {this.props.pinfo.HEIGHT_VAL}cm (
                          {(this.props.pinfo.HEIGHT_VAL / 2.54).toFixed(2)}in)
                        </div>
                      </div>
                      <div style={{ marginTop: "8px" }} className="d-flex p-0">
                        <div
                          style={{ color: "#A29EAF", fontSize: "14px" }}
                          className="col-4 p-0"
                        >
                          <FormattedMessage id="체중" />
                        </div>
                        <div
                          className="col-8 p-0"
                          style={{ color: "#6E6B7B", fontSize: "14px" }}
                        >
                          {this.props.pinfo.WEIGHT_VAL}kg (
                          {(this.props.pinfo.WEIGHT_VAL * 2.205).toFixed(2)}in)
                        </div>
                      </div>
                      <div style={{ marginTop: "8px" }} className="d-flex p-0">
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
                      <div style={{ marginTop: "8px" }} className="d-flex p-0">
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
                          {/* {this.props.pinfo.DRINK_YN === "N" ? (
                          <FormattedMessage id="yes" />
                        ) : (
                          <FormattedMessage id="no" />
                        )} */}
                          일주일에 2번
                        </div>
                      </div>
                      <div style={{ marginTop: "8px" }} className="d-flex p-0">
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
                      <div style={{ marginTop: "8px" }} className="d-flex p-0">
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
                      <div style={{ marginTop: "8px" }} className="d-flex p-0">
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
                      <div style={{ marginTop: "8px" }} className="d-flex p-0">
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
                    </CardBody>
                  </Card>
                </div>
                <div className="px-0 col-6">
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
                    style={{
                      width: "440px",
                      height: "188px",
                      marginTop: "24px",
                    }}
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
                      <FormattedMessage id="Past History" />

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
                          key={row.CONSULT_LIST}
                          row={row}
                        />
                      ))}
                    </CardBody>
                  </Card>
                </div>
              </div>
              <Card
                className="mb-0"
                id="cardshadow"
                style={{ height: "250px", width: "892px" }}
              >
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
                      onMouseLeave={() =>
                        this.setState({ mouseovervtv: false })
                      }
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
                      onMouseLeave={() =>
                        this.setState({ mouseovervtv: false })
                      }
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
                          <LineChart
                            className="col-2"
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
                          <LineChart
                            className="col-2"
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
            </ModalBody>
            <ModalFooter>
              <Button
                className="mr-1"
                color="primary"
                onClick={this.patientInfoModal}
              >
                <FormattedMessage id="닫기" />
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            style={{ position: "absolute", top: "4%", right: "3%" }}
            isOpen={this.state.questionmodal}
            toggle={this.questionModal}
            backdrop={false}
          >
            <ModalHeader toggle={this.questionModal}>
              <b>실시간 문의</b>
            </ModalHeader>
            <ModalBody>
              <iframe
                src="https://health.iot4health.co.kr/lv1/chat.1to1.php?ROOM_ID=room_wind&USERS=의사"
                width="400px"
                height="300px"
              ></iframe>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" outline onClick={this.questionModal}>
                닫기
              </Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.gohomemodal} toggle={this.goHomeModal}>
            <ModalHeader toggle={this.goHomeModal}>
              <b>
                <FormattedMessage id="주의" />
              </b>
            </ModalHeader>
            <ModalBody>
              <FormattedMessage id="csroom_caution1" />
              <br />
              <FormattedMessage id="csroom_caution2" />
              <br />
              <FormattedMessage id="csroom_caution3" />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.pushGoHome}>
                <FormattedMessage id="yes" />
              </Button>
              <Button color="primary" outline onClick={this.goHomeModal}>
                <FormattedMessage id="no" />
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.prescriptionmodal}
            toggle={this.prescriptionModal}
          >
            <ModalHeader toggle={this.prescriptionModal}>
              <b>
                <FormattedMessage id="주의" />
              </b>
            </ModalHeader>
            <ModalBody>
              <FormattedMessage id="csroom_caution4" />
              <br />
              <FormattedMessage id="csroom_caution5" />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.pushPresGoHome}>
                <FormattedMessage id="yes" />
              </Button>
              <Button color="primary" outline onClick={this.prescriptionModal}>
                <FormattedMessage id="no" />
              </Button>
            </ModalFooter>
          </Modal>

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

          {/* 환자정보, 버튼 모음 Row */}
          <Row className="d-flex justify-content-between mb-1 pt-3">
            <Col lg="6" md="12"></Col>
            <Col lg="6" md="12" className="d-flex justify-content-end">
              <div style={{ color: "#FFFEFE" }} className="mr-1">
                {/* 타이머 */}
                {this.props.appo === null ? (
                  <FormattedMessage id="진료시작전" />
                ) : // 1시간 시나리오
                this.props.user.login.values.loggedInUser.medical_part ===
                  "99" ? (
                  <Countdown
                    zeroPadTime={2}
                    renderer={renderer}
                    date={moment(this.props.rtime) + 3600000}
                  ></Countdown>
                ) : (
                  // 15분 시나리오
                  <Countdown
                    zeroPadTime={2}
                    renderer={renderer}
                    date={moment(this.props.rtime) + 900000}
                  ></Countdown>
                )}
              </div>
              {/* <Button
              className="mr-1"
              color="black"
              outline
              onClick={this.toggleScreenshare}
              type="button"
            >
              {this.state.publishScreen ? "화면공유중지" : "화면공유"}
            </Button>
            */}
              <Settings
                size={24}
                style={{ marginRight: "16px", cursor: "pointer" }}
                type="button"
                onClick={this.settingModal}
              >
                <FormattedMessage id="설정" />
              </Settings>
            </Col>
          </Row>

          {/* 화상통화, 생체데이터, 등등 */}

          <div
            className="p-0 col-12"
            style={{
              height: "760px",
              backgroundColor: "#0B0F21",
            }}
          >
            {this.props.dataList.tokbox.TOK_KEY === "" ? null : (
              <Opentok
                className="d-flex"
                archiving={this.state.archiving}
                screenshare={this.state.publishScreen}
                parentFunction={this.parentFunction}
                apikey={this.props.dataList.tokbox.TOK_KEY}
                session={this.props.dataList.tokbox.TOK_SESSION}
                token={this.props.dataList.tokbox.TOK_TOKEN}
                cameraset={this.state.cameraset}
                micset={this.state.micset}
                camerastate={this.state.camerastate}
                micstate={this.state.micstate}
                toggleScreenshare={this.publishScreenError}
              />
            )}
          </div>

          <div
            style={{
              backgroundColor: "#0B0F21",
            }}
            className="col-12 d-flex"
          >
            <Col lg="3" xl="3" sm="3" md="3" />
            <Col
              lg="6"
              xl="6"
              sm="6"
              md="6"
              className="d-flex justify-content-center"
              style={{
                backgroundColor: "#0B0F21",
              }}
            >
              {this.state.camerastate === true ? (
                <div
                  className="text-center"
                  style={{
                    cursor: "pointer",
                    width: "64px",
                    height: "64px",
                    borderRadius: "6px",
                    color: "#FFFEFE",
                    background: "#3c3f4d",
                    fontSize: "11px",
                  }}
                  onClick={this.cameraState}
                >
                  <Video size={24} style={{ marginTop: "13px" }} />

                  <div>On</div>
                </div>
              ) : (
                <div
                  className="text-center"
                  style={{
                    cursor: "pointer",
                    width: "64px",
                    height: "64px",
                    borderRadius: "6px",
                    border: "1px solid #C7D1DA",
                    color: "#6E6B7B",
                    background: "#0B0F21",
                    fontSize: "11px",
                  }}
                  onClick={this.cameraState}
                >
                  <VideoOff size={24} style={{ marginTop: "13px" }} />
                  <div>Off</div>
                </div>
              )}

              {this.state.micstate === true ? (
                <div
                  className="text-center"
                  style={{
                    marginLeft: "16px",
                    cursor: "pointer",
                    width: "64px",
                    height: "64px",
                    borderRadius: "6px",
                    color: "#FFFEFE",
                    background: "#3c3f4d",
                    fontSize: "11px",
                  }}
                  onClick={this.micState}
                >
                  <Mic size={24} style={{ marginTop: "13px" }} />
                  <div>On</div>
                </div>
              ) : (
                <div
                  className="text-center"
                  style={{
                    marginLeft: "16px",
                    cursor: "pointer",
                    width: "64px",
                    height: "64px",
                    borderRadius: "6px",
                    border: "1px solid #C7D1DA",
                    color: "#6E6B7B",
                    background: "#0B0F21",
                    fontSize: "11px",
                  }}
                  onClick={this.micState}
                >
                  <MicOff size={24} style={{ marginTop: "13px" }} />

                  <div>Off</div>
                </div>
              )}

              {this.state.archiving === "N" ? (
                <div
                  className="text-center"
                  style={{
                    marginLeft: "16px",
                    cursor: "pointer",
                    width: "64px",
                    height: "64px",
                    borderRadius: "6px",
                    border: "1px solid #C7D1DA",
                    color: "#6E6B7B",
                    background: "#0B0F21",
                  }}
                  onClick={this.startarchiveVideo}
                >
                  <div style={{ marginTop: "14px", fontWeight: "700" }}>
                    {" "}
                    REC{" "}
                  </div>
                  <div
                    style={{
                      marginTop: "2px",
                      fontSize: "11px",
                    }}
                  >
                    Off
                  </div>
                </div>
              ) : (
                <div
                  className="text-center"
                  style={{
                    marginLeft: "16px",
                    cursor: "pointer",
                    width: "64px",
                    height: "64px",
                    borderRadius: "6px",
                    color: "#FFFEFE",
                    background: "#3c3f4d",
                  }}
                  onClick={this.stoparchiveVideo}
                >
                  <div style={{ marginTop: "14px", fontWeight: "700" }}>
                    {" "}
                    REC{" "}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                    }}
                  >
                    On
                  </div>
                </div>
              )}

              {this.state.patientinfomodal === true ? (
                <div
                  className="text-center"
                  style={{
                    marginLeft: "16px",
                    cursor: "pointer",
                    width: "64px",
                    height: "64px",
                    borderRadius: "6px",
                    color: "#FFFEFE",
                    background: "#3c3f4d",
                    fontSize: "11px",
                  }}
                  onClick={this.patientInfoModal}
                >
                  <Clipboard size={24} style={{ marginTop: "13px" }} />
                  <div>Pt.info</div>
                </div>
              ) : (
                <div
                  className="text-center"
                  style={{
                    marginLeft: "16px",
                    cursor: "pointer",
                    width: "64px",
                    height: "64px",
                    borderRadius: "6px",
                    border: "1px solid #C7D1DA",
                    color: "#6E6B7B",
                    background: "#0B0F21",
                    fontSize: "11px",
                  }}
                  onClick={this.patientInfoModal}
                >
                  <Clipboard size={24} style={{ marginTop: "13px" }} />
                  <div>Pt.info</div>
                </div>
              )}

              {this.props.appo.MEDICAL_KIND === "3" ? (
                <div
                  className="text-center"
                  style={{
                    marginLeft: "16px",
                    cursor: "pointer",
                    width: "64px",
                    height: "64px",
                    borderRadius: "6px",
                    border: "1px solid #C7D1DA",
                    color: "#6E6B7B",
                    background: "#0B0F21",
                    fontSize: "11px",
                  }}
                  onClick={this.secondOpModal}
                >
                  <Film size={24} style={{ marginTop: "13px" }} />
                  <div>Decipher</div>
                </div>
              ) : null}

              {this.state.mdnotemodal === true ? (
                <div
                  className="text-center"
                  style={{
                    marginLeft: "16px",
                    // cursor: "pointer",
                    width: "64px",
                    height: "64px",
                    borderRadius: "6px",
                    color: "#FFFEFE",
                    background: "#3c3f4d",
                    fontSize: "11px",
                  }}
                  onClick={this.openReportPopup}
                >
                  <Edit size={24} style={{ marginTop: "13px" }} />
                  <div>Tx &amp; Rx</div>
                </div>
              ) : (
                <div
                  className="text-center"
                  style={{
                    marginLeft: "16px",
                    cursor: "pointer",
                    width: "64px",
                    height: "64px",
                    borderRadius: "6px",
                    border: "1px solid #C7D1DA",
                    color: "#6E6B7B",
                    background: "#0B0F21",
                    fontSize: "11px",
                  }}
                  onClick={this.openReportPopup}
                >
                  <Edit size={24} style={{ marginTop: "13px" }} />
                  <div>Tx &amp; Rx</div>
                </div>
              )}
            </Col>
            <Col
              lg="3"
              xl="3"
              sm="3"
              md="3"
              className="d-flex justify-content-end"
            >
              <div
                className="text-center"
                style={{
                  marginRight: "16px",
                  cursor: "pointer",
                  width: "64px",
                  height: "64px",
                  borderRadius: "6px",
                  border: "1px solid #C7D1DA",
                  color: "#6E6B7B",
                  background: "#0B0F21",
                  fontSize: "11px",
                }}
                onClick={this.goHome}
              >
                <LogOut size={24} style={{ marginTop: "13px" }} />
                <div>Exit</div>
              </div>
            </Col>
          </div>
          <Modal
            style={{
              position: "absolute",
              right: "4%",
              top: "10%",
            }}
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
                this.props.appo.FILE_NAME === "" ||
                this.props.FILE_NAME === "bolb" ? null : (
                  <img
                    maxwidth="500px"
                    height="500px"
                    src={
                      `${SERVER_URL_TEST_IMG}` +
                      this.props.appo.FILE_PATH +
                      this.props.appo.FILE_NAME
                    }
                    className="dz-img"
                    alt=""
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
                this.props.appo.FILE_NAME2 === "" ||
                this.props.FILE_NAME2 === "bolb" ? null : (
                  <img
                    maxwidth="500px"
                    height="500px"
                    src={
                      `${SERVER_URL_TEST_IMG}` +
                      this.props.appo.FILE_PATH +
                      this.props.appo.FILE_NAME2
                    }
                    className="dz-img"
                    alt=""
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
          <Draggable>
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
          </Draggable>

          <Modal
            style={{
              position: "absolute",
              right: "4%",
              top: "25%",
              width: "45%",
            }}
            backdrop={false}
            isOpen={this.state.settingmodal}
            toggle={this.settingModal}
            className="modal-lg"
          >
            <ModalHeader toggle={this.settingModal}>
              <b>
                <FormattedMessage id="영상 진료 카메라 및 마이크설정" />
              </b>
            </ModalHeader>
            <ModalBody>
              <Row className="mt-1">
                <Col lg="3" md="12" className="align-self-center">
                  <h5 className="text-bold-600">
                    <FormattedMessage id="카메라 설정" />
                  </h5>
                </Col>
                <Col lg="6" md="12">
                  <Select
                    className="React"
                    classNamePrefix="select"
                    // defaultValue={this.state.camera[0]}
                    name="color"
                    options={this.state.camera}
                    onChange={(e) => this.setState({ cameraset: e })}
                  />
                </Col>
                <Col lg="3" md="12">
                  <Button.Ripple
                    outline
                    color="primary"
                    size="md"
                    onClick={this.setCamera}
                  >
                    <FormattedMessage id="적용" />
                  </Button.Ripple>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col lg="3" md="12" className="align-self-center">
                  <h5 className="text-bold-600">
                    <FormattedMessage id="마이크 설정" />
                  </h5>
                </Col>
                <Col lg="6" md="12">
                  <Select
                    className="React"
                    classNamePrefix="select"
                    defaultValue={this.state.micset}
                    name="color"
                    options={this.state.mic}
                    onChange={(e) => this.setState({ micset: e })}
                  />
                </Col>
                <Col lg="3" md="12">
                  <Button.Ripple outline color="primary" size="md">
                    <FormattedMessage id="적용" />
                  </Button.Ripple>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col lg="3" md="12" className="align-self-center">
                  <h5 className="text-bold-600">
                    <FormattedMessage id="스피커 설정" />
                  </h5>
                </Col>
                <Col lg="6" md="12">
                  <Select
                    className="React"
                    classNamePrefix="select"
                    defaultValue={this.state.speakerset}
                    name="color"
                    options={this.state.speaker}
                    onChange={(e) => this.setState({ speakerset: e })}
                  />
                </Col>
                <Col lg="3" md="12">
                  <Button.Ripple
                    outline
                    color="primary"
                    size="md"
                    onClick={this.setSpeaker}
                  >
                    <FormattedMessage id="적용" />
                  </Button.Ripple>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.settingModal}>
                <FormattedMessage id="저장 후 닫기" />
              </Button>
            </ModalFooter>
          </Modal>
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
  mPCL,
  resetVitalData,
  putStateComplete,
  saveCookieConsult,
  pushEndCloseSignal,
})(ConsultingRoom);
