import React from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
} from "reactstrap";
import Radio from "../../../components/@vuexy/radio/RadioVuexy";
import SalesCard from "./SalesCard";
import SuberscribersGained from "../../ui-elements/cards/statistics/SubscriberGained";
import OrdersReceived from "../../ui-elements/cards/statistics/OrdersReceived";
import "../../../assets/scss/pages/dashboard-analytics.scss";
import { connect } from "react-redux";
import { getappoints } from "../../../redux/actions/appoint";
import axios from "axios";
import ListViewConfig from "./DataListConfig";
import queryString from "query-string";
import moment from "moment";
import { SERVER_URL2 } from "../../../config";
import AES256 from "aes-everywhere";
import {
  encryptByPubKey,
  decryptByAES,
  AESKey,
} from "../../../redux/actions/auth/cipherActions";
import { changeSigninFirst } from "../../../redux/actions/auth/loginActions";
import firebase from "firebase";
import { history } from "../../../history";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { convertUnit } from "../../../redux/actions/data-list/";

//파이어스토어용
// const config = {
//   apiKey: "AIzaSyCMvdBZyG3ox-CRl3fTTYmjbag-b_C3NHM",
//   authDomain: "hicare-t.firebaseapp.com",
//   projectId: "hicare-t",
//   storageBucket: "hicare-t.appspot.com",
//   messagingSenderId: "671016231005",
//   appId: "1:671016231005:web:89dda34bf7af594f246db4",
//   measurementId: "G-0N2DEZY0E6",
// };
const thirtyFnotify = (docname) => {
  toast.error(
    <div className="text-white">
      {docname} <FormattedMessage id="30분전" /> <br />
      <FormattedMessage id="대기" />
    </div>,
    { autoClose: false }
  );
};

const fiveFnotify = (docname) => {
  toast.error(
    <div className="text-white">
      {docname} <FormattedMessage id="5분전" /> <br />
      <FormattedMessage id="입장" />
    </div>,
    { autoClose: false }
  );
};

var config = {
  apiKey: "AIzaSyAMiyzuGLBHAk4K18Q4Bla4ljA4cfUf-oM",
  authDomain: "i4h-hicare.firebaseapp.com",
  databaseURL: "https://i4h-hicare.firebaseio.com",
  projectId: "i4h-hicare",
  storageBucket: "i4h-hicare.appspot.com",
  messagingSenderId: "575076484827",
  appId: "1:575076484827:web:b15851500503c4c2432efe",
  measurementId: "G-5H09HRTQQT",
};
var db;
var members;

const utcFormatDate = (scheduleda) => {
  let utcscheduleda = moment
    .utc(scheduleda.toISOString())
    .subtract(1, "days")
    .format("YYYY-MM-DD 22:59");
  console.log("formatedutc: ", utcscheduleda);
  return utcscheduleda;
};

const korFormatDate = (scheduleda) => {
  let korschedule =
    moment(scheduleda).subtract(1, "days").format("YYYY-MM-DD") + " 23:00";
  console.log("kor:", korschedule);
  return korschedule;
};

class AnalyticsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: props.user.login.values.loggedInUser.username,
      startdate: "20210101",
      pageamount: 5,
      pagenum: 1,
      countday: 0,
      countdkind1: 0,
      countdkind2: 0,
      countdkind3: 0,
      countmon: 0,
      countmkind1: 0,
      countmkind2: 0,
      countmkind3: 0,
      signinfirst: "n",
      newmodal: false,
      convertmodal: false,
      length: "",
      weight: "",
      temperature: "",
    };
  }

  componentDidMount() {
    this.setState({
      length: sessionStorage.getItem("UNIT_LENGTH"),
      weight: sessionStorage.getItem("UNIT_WEIGHT"),
      temperature: sessionStorage.getItem("UNIT_TEMP"),
    });

    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    let value = AES256.encrypt(
      JSON.stringify({
        user_id: this.state.userid,
        start_date: utcFormatDate(new Date()),
        // start_date: korFormatDate(new Date()),
        page_amount: "000",
        page_num: "1",
        app_states: "'PF','AC','AF','VW','VF','TF','RF'",
        medical_kind: "'1','2','3'",
      }),
      AESKey
    );
    axios
      .get(`${SERVER_URL2}/doctor/appointment/dashboard`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let appoints = decryptByAES(response.data.data);
        console.log(appoints);
        if (response.data.status === "200") {
          this.setState({
            countday: appoints.COUNTS_DAY.COUNT_DAY,
            countdkind1: appoints.COUNTS_DAY.COUNT_D_KIND1,
            countdkind2: appoints.COUNTS_DAY.COUNT_D_KIND2,
            countdkind3: appoints.COUNTS_DAY.COUNT_D_KIND3,
            countmon: appoints.COUNTS_MON.COUNT_MON,
            countmkind1: appoints.COUNTS_MON.COUNT_M_KIND1,
            countmkind2: appoints.COUNTS_MON.COUNT_M_KIND2,
            countmkind3: appoints.COUNTS_MON.COUNT_M_KIND3,
          });
        }
      })
      .catch((err) => console.log(err));
    localStorage.setItem("userid", this.state.userid);
    if (!firebase.apps.length) {
      // 중복로그인 방지 관련 코드
      firebase.initializeApp(config);
      const messaging = firebase.messaging();
      // messaging.usePublicVapidKey(
      //   "BB4XHw8moH2jMsi3RvCLcAGbPAETd5PvZD9__dNIXLX0HKFSDcjl8qDwIvmMF3g3cSKRhceXg4dnx20sOo81WQs"
      // );

      messaging.usePublicVapidKey(
        "BL0eTL3wIbAxmATwORsjQ-pNPCQBYrFNofCAr1xnArzbBjkRDreJLmiXYd-ySpazU-GTEAhtThWIhCLxYLvTGvY"
      );
      //허가를 요청합니다!
      Notification.requestPermission()
        .then(function () {
          console.log("App허가!");
          return messaging.getToken();
        })
        .then((token) => {
          console.log("브라우저토큰값: ", token);
        })
        .catch(function (err) {
          console.log("fcm에러 : ", err);
        });

      messaging.onMessage(function (payload) {
        let docname = payload.data["gcm.notification.doctor_name"];
        let apikey = payload.data["gcm.notification.api_key"];

        console.log("docname: ", docname);
        console.log("apikey: ", apikey);

        if (payload.data["gcm.notification.api_key"] === "") {
          thirtyFnotify(docname);
        } else {
          fiveFnotify(docname);
        }
      });

      db = firebase.firestore();

      members = db.collection("Doctor");

      members
        .doc(this.state.userid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState(
              {
                membersID: doc.id,
              },
              () => {
                let postData = {
                  ID: this.state.userid,
                  LOGIN_DATETIME: moment(new Date()).format(
                    "YYYY-MM-DD hh:mm:ss"
                  ),
                  NOW_NAVI: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
                  TOKEN: this.props.user.login.values.tokendata,
                  VIDEOCHAT_START: "",
                  VIDEOCHAT_END: "",
                };

                this.setState({ loginstate: "YYY" }, () => {
                  db.collection("Doctor")
                    .doc(this.state.userid)
                    .update(postData);
                });
              }
            );
          } else {
            this.setState(
              {
                membersID: this.state.userid,
              },
              () => {
                let postData = {
                  ID: this.state.userid,
                  LOGIN_DATETIME: moment(new Date()).format(
                    "YYYY-MM-DD hh:mm:ss"
                  ),
                  NOW_NAVI: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
                  TOKEN: this.props.user.login.values.tokendata,
                  VIDEOCHAT_START: "",
                  VIDEOCHAT_END: "",
                };

                this.setState({ loginstate: "YYY" }, () => {
                  db.collection("Doctor")
                    .doc(this.state.userid)
                    .set(postData)
                    .catch(function (err) {
                      console.log("fcm에러 : ", err);
                    });
                });
              }
            );
          }
        });
    } else {
    }

    if (
      localStorage.getItem("firstyn") === "y" &&
      sessionStorage.getItem("convertModal") === "first"
    ) {
      this.setState({
        newmodal: true,
      });
    } else {
      this.setState({
        newmodal: false,
      });
    }

    if (sessionStorage.getItem("convertModal") === "true") {
      this.setState({ convertmodal: true });
    } else {
      this.setState({ convertmodal: false });
    }
  }

  newModal = () => {
    this.setState((prevState) => ({
      newmodal: !prevState.newmodal,
    }));
  };

  goDocInfo = () => {
    history.push("/pages/myinfo");
  };

  convertSave = () => {
    window.sessionStorage.setItem("UNIT_LENGTH", this.state.length);
    window.sessionStorage.setItem("UNIT_WEIGHT", this.state.weight);
    window.sessionStorage.setItem("UNIT_TEMP", this.state.temperature);
    sessionStorage.setItem("convertModal", false);
    this.props.changeSigninFirst(
      this.props.user.login.values.loggedInUser.username
    );
    this.convertModal();
    this.props.convertUnit(
      this.props.user.login.values.loggedInUser.username,
      this.state.length,
      this.state.weight,
      this.state.temperature,
      this.props.cipher.rsapublickey.publickey
    );
  };

  convertModal = () => {
    this.setState((prevState) => ({
      convertmodal: !prevState.convertmodal,
    }));
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          isOpen={this.state.convertmodal}
          toggle={this.convertModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={this.convertModal}>측정 단위 설정</ModalHeader>
          <ModalBody>
            <FormGroup>
              <div className="text-bold-600">측정 단위를 선택하세요</div>
              <div className="d-flex mt-1">
                <div className="mr-4" style={{ marginTop: "4px" }}>
                  길이
                </div>
                <div className="mr-2 ml-5">
                  <Radio
                    label="cm(센티미터)"
                    defaultChecked={this.state.length === "cm" ? true : false}
                    name="length"
                    value="cm"
                    onChange={(e) => this.setState({ length: e.target.value })}
                  />
                </div>
                <div>
                  <Radio
                    label="in(인치)"
                    defaultChecked={this.state.length === "in" ? true : false}
                    name="length"
                    value="in"
                    onChange={(e) =>
                      this.setState({
                        length: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="d-flex mt-1">
                <div className="mr-4" style={{ marginTop: "4px" }}>
                  무게
                </div>
                <div className="mr-2 ml-5">
                  <Radio
                    label="kg(킬로그램)"
                    defaultChecked={this.state.weight === "kg" ? true : false}
                    name="weight"
                    value="kg"
                    onChange={(e) => this.setState({ weight: e.target.value })}
                  />
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Radio
                    label="lb(파운드)"
                    defaultChecked={this.state.weight === "lb" ? true : false}
                    name="weight"
                    value="lb"
                    onChange={(e) =>
                      this.setState({
                        weight: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="d-flex mt-1">
                <div className="mr-4" style={{ marginTop: "4px" }}>
                  온도
                </div>
                <div className="ml-5 mr-2">
                  <Radio
                    label="℃(섭씨)"
                    defaultChecked={
                      this.state.temperature === "c" ? true : false
                    }
                    name="temp"
                    value="c"
                    onChange={(e) =>
                      this.setState({ temperature: e.target.value })
                    }
                  />
                </div>
                <div style={{ marginLeft: "35px" }}>
                  <Radio
                    label="℉(화씨)"
                    defaultChecked={
                      this.state.temperature === "f" ? true : false
                    }
                    name="temp"
                    value="f"
                    onChange={(e) =>
                      this.setState({
                        temperature: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </FormGroup>
            <Button color="primary" onClick={this.convertSave}>
              <FormattedMessage id="Save" />
            </Button>
          </ModalBody>
        </Modal>
        <Row
          style={{
            height: "70px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <SalesCard />
        </Row>
        <Row
          style={{
            marginLeft: "auto",
            marginRight: "auto",
          }}
          className="text-bold-600 mt-2"
        >
          <Col style={{ color: "#113055" }} className="mx-0 px-0">
            <FormattedMessage id="Summary" />
          </Col>
          <Col className="text-right mx-0 px-0">
            <Link style={{ color: "#6E6B7B" }} to={"/calendar"}>
              <FormattedMessage id="viewall" />
            </Link>
          </Col>
        </Row>
        <Row
          style={{
            height: "160px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "16px",
          }}
        >
          <Col sm="6 pl-0">
            <SuberscribersGained
              today={moment().format("YYYY.MM.DD")}
              countd={this.state.countday}
              countdkind1={this.state.countdkind1}
              countdkind2={this.state.countdkind2}
              countdkind3={this.state.countdkind3}
            />
          </Col>
          <Col sm="6 pr-0">
            <OrdersReceived
              today={moment().format("YYYY.MM")}
              countm={this.state.countmon}
              countmkind1={this.state.countmkind1}
              countmkind2={this.state.countmkind2}
              countmkind3={this.state.countmkind3}
            />
          </Col>
        </Row>
        <Row
          style={{
            marginLeft: "auto",
            marginRight: "auto",
          }}
          className="text-bold-600 mt-2"
        >
          <Col style={{ color: "#113055" }} className="mx-0 px-0">
            <FormattedMessage id="appointlist" />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col sm="12">
            <ListViewConfig
              startend={this.state.startend}
              parsedFilter={queryString.parse(this.props.location.search)}
            />
          </Col>
        </Row>
        <Modal
          isOpen={this.state.newmodal}
          toggle={this.newModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={this.newModal}>신규 의사 알림</ModalHeader>
          <ModalBody>
            <Row className="d-flex">
              <h6 className="align-self-center ml-1">
                진료를 시작하기 전 개인정보 입력과 스케줄 설정을 진행해주십시오.
              </h6>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.goDocInfo}>
              확인
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    cipher: state.auth.cipher,
  };
};

export default connect(mapStateToProps, {
  getappoints,
  changeSigninFirst,
  convertUnit,
})(AnalyticsDashboard);
