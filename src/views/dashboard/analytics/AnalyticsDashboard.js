import React from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
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
import { SERVER_URL, SERVER_URL2 } from "../../../config";
import AES256 from "aes-everywhere";
import {
  encryptByPubKey,
  decryptByAES,
  AESKey,
} from "../../../redux/actions/auth/cipherActions";
import firebase from "firebase";
import { history } from "../../../history";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

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
const notifyAutoClose = (strDT) => {
  toast.error(
    <div className="text-white">
      {strDT} <FormattedMessage id="5분전" /> <br />
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
  let utcscheduleda =
    moment.utc(scheduleda.toISOString()).format("YYYY-MM-DD") + " 00:00";
  let normal = moment.utc(scheduleda.toISOString());
  console.log("utc:", normal);
  return utcscheduleda;
};

const KorFormaatDate = (scheduleda) => {
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
    };
  }

  componentDidMount() {
    let encryptedrsapkey = encryptByPubKey(
      this.props.cipher.rsapublickey.publickey
    );
    let value = AES256.encrypt(
      JSON.stringify({
        user_id: this.state.userid,
        start_date: utcFormatDate(new Date()),
        // start_data: KorFormaatDate(),
        page_amount: 5,
        page_num: 1,
        app_states: "",
        medical_kind: "",
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
        console.log(appoints.COUNT_DAY);
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
        console.log(payload.data);
        let strDT = payload.data["gcm.notification.doctor_name"];
        notifyAutoClose(strDT);
        // alert(
        //   strDT +
        //     "님 진료시작까지 5분 남았습니다.\n진료실로 입장해주시기 바랍니다."
        // );
      });

      db = firebase.firestore();

      members = db.collection("Members");

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
                  MemberGubun: "DOCTOR",
                  NOW_NAVI: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
                  TOKEN: this.props.user.login.values.tokendata,
                  VIDEOCHAT_START: "",
                  VIDEOCHAT_END: "",
                };

                this.setState({ loginstate: "YYY" }, () => {
                  db.collection("Members")
                    .doc(this.state.userid)
                    .update(postData);
                });
              }
            );
          } else {
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
                  MemberGubun: "DOCTOR",
                  NOW_NAVI: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
                  TOKEN: "더미토큰",
                  VIDEOCHAT_START: "",
                  VIDEOCHAT_END: "",
                };

                this.setState({ loginstate: "YYY" }, () => {
                  db.collection("Members")
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

    console.log(localStorage.getItem("firstyn"));
    // 신규의사일경우
    if (localStorage.getItem("firstyn") === "y") {
      this.setState({
        newmodal: true,
      });
    } else {
      this.setState({
        newmodal: false,
      });
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

  render() {
    return (
      <React.Fragment>
        <Row
          style={{
            width: "1368px",
            height: "112px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <SalesCard />
        </Row>
        <Row
          style={{
            width: "1368px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          className="text-bold-600 mt-2"
        >
          <Col className="mx-0 px-0">Summary</Col>
          <Col className="text-right mx-0 px-0">
            <Link to={"/calendar"}>View all</Link>
          </Col>
        </Row>
        <Row
          style={{
            width: "1368px",
            height: "160px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "16px",
          }}
        >
          <Col sm="6 px-0">
            <SuberscribersGained
              today={moment().format("YYYY.MM.DD")}
              countd={this.state.countday}
              countdkind1={this.state.countdkind1}
              countdkind2={this.state.countdkind2}
              countdkind3={this.state.countdkind3}
            />
          </Col>
          <Col sm="6 px-0">
            <OrdersReceived
              today={moment().format("YYYY.MM")}
              countm={this.state.countmon}
              countmkind1={this.state.countmkind1}
              countmkind2={this.state.countmkind2}
              countmkind3={this.state.countmkind3}
            />
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

export default connect(mapStateToProps, { getappoints })(AnalyticsDashboard);
