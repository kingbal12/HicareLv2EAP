import React from "react";
import { Link } from "react-router-dom";
import {
  CardBody,
  FormGroup,
  Form,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { Check } from "react-feather";
import { loginWithJWT } from "../../../../redux/actions/auth/loginActions";
// import { getPublicKey } from "../../../../redux/actions/auth/cipherActions";
import { saveemail, delemail } from "../../../../redux/actions/idaction";
import { connect } from "react-redux";
import firebase from "firebase";
import { FormattedMessage } from "react-intl";
import { resetCookie } from "../../../../redux/actions/cookies";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import moment from "moment-timezone";

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

// 웹푸시용
const config = {
  apiKey: "AIzaSyAMiyzuGLBHAk4K18Q4Bla4ljA4cfUf-oM",
  authDomain: "i4h-hicare.firebaseapp.com",
  databaseURL: "https://i4h-hicare.firebaseapp.com",
  projectId: "i4h-hicare",
  storageBucket: "i4h-hicare.appspot.com",
  messagingSenderId: "575076484827",
  appId: "1:575076484827:web:b15851500503c4c2432efe",
  measurementId: "G-5H09HRTQQT",
};

var db;
var members;

class LoginJWT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "test@test.com",
      password: "testtest",
      tokendata: "",
      devicekind: "W",
      remember: localStorage.getItem("remember"),
      doctername: "",
      rsapkey: "",
      ftoken: "",
      loginstate: "",
    };

    // this.props.getPublicKey();
  }

  // componentDidMount() {
  //   localStorage.setItem("userid", undefined);
  //   localStorage.setItem("token", undefined);

  //   if (!firebase.apps.length) {
  //     firebase.initializeApp(config);

  //     const messaging = firebase.messaging();

  //     // 중복로그인 방지 관련 코드
  //     db = firebase.firestore();
  //     console.log(db);
  //     members = db.collection("Doctor");

  //     // messaging.usePublicVapidKey(
  //     //   "BB4XHw8moH2jMsi3RvCLcAGbPAETd5PvZD9__dNIXLX0HKFSDcjl8qDwIvmMF3g3cSKRhceXg4dnx20sOo81WQs"
  //     // );

  //     messaging.usePublicVapidKey(
  //       "BL0eTL3wIbAxmATwORsjQ-pNPCQBYrFNofCAr1xnArzbBjkRDreJLmiXYd-ySpazU-GTEAhtThWIhCLxYLvTGvY"
  //     );
  //     Notification.requestPermission()
  //       .then(function () {
  //         console.log("허가!login");
  //         return messaging.getToken();
  //       })

  //       .then((token) => {
  //         this.setState({ tokendata: token }, () =>
  //           console.log("tokendata;", this.state.tokendata)
  //         );
  //         if ("serviceWorker" in navigator) {
  //           navigator.serviceWorker
  //             .register("firebase-messaging-sw.js")
  //             .then(handleSWRegistration);
  //         }

  //         function handleSWRegistration(reg) {
  //           if (reg.installing) {
  //             console.log("Service worker installing");
  //           } else if (reg.waiting) {
  //             console.log("Service worker installed");
  //           } else if (reg.active) {
  //             console.log("Service worker active");
  //           }
  //         }
  //       })

  //       .catch(function (err) {
  //         console.log("fcm에러 : ", err);
  //       });
  //   } else {
  //     // 중복로그인 방지 관련 코드
  //     this.setState({ loginstate: "YY" }, () => {
  //       db = firebase.firestore();
  //       console.log(db);
  //       members = db.collection("Doctor");
  //     });
  //     firebase.app();
  //   }
  //   this.rememberLoginId();
  // }

  rememberLoginId = () => {
    if (localStorage.getItem("remember") === "true") {
      this.setState({
        remember: localStorage.getItem("remember"),
        email: localStorage.getItem("rememberid"),
      });
    } else {
      this.setState({
        remember: "false",
        email: "",
      });
    }
  };

  //포트폴리오용
  handleLogin = (e) => {
    e.preventDefault();
    if (this.state.email.length >= 6) {
        this.props.loginWithJWT(
          this.state,
          this.state.remember
        );

        console.log("++++++++++++++++++",this.state)
      }else {
      alert("아이디는 최소 6자 이상입니다.");
    }
  }

  // 중복로그인 방지 관련 코드
  // handleLogin = (e) => {
  //   e.preventDefault();
  //   members
  //     .doc(this.state.email)
  //     .get()
  //     .then((doc) => {
  //       if (doc.exists) {
  //         this.setState(
  //           {
  //             ftoken: doc.data().TOKEN,
  //           },
  //           () => {
  //             if (this.state.email.length >= 6) {
  //               if (
  //                 this.state.ftoken === this.state.tokendata ||
  //                 this.state.ftoken === "" ||
  //                 this.state.tokendata === "" ||
  //                 this.state.ftoken === undefined
  //               ) {
  //                 this.props.loginWithJWT(
  //                   this.state,
  //                   this.props.cipher.rsapublickey.publickey,
  //                   this.state.tokendata,
  //                   this.state.remember
  //                 );
  //                 console.log(this.state.ftoken);
  //               } else {
  //                 if (doc.data().VIDEOCHAT_START !== "") {
  //                   console.log(doc.data().VIDEOCHAT_START);
  //                   console.log(doc.data().VIDEOCHAT_END);
  //                   if (
  //                     moment(new Date()).format("YYYY-MM-DD hh:mm:ss") >=
  //                       doc.data().VIDEOCHAT_START &&
  //                     moment(new Date()).format("YYYY-MM-DD hh:mm:ss") <=
  //                       doc.data().VIDEOCHAT_END
  //                   ) {
  //                     if (
  //                       window.confirm(
  //                         "다른기기에서 화상진료중입니다.\n로그인 하시겠습니까?"
  //                       )
  //                     ) {
  //                       // 확인(예) 버튼 클릭 시 이벤트
  //                       this.props.loginWithJWT(
  //                         this.state,
  //                         this.props.cipher.rsapublickey.publickey,
  //                         this.state.tokendata,
  //                         this.state.remember
  //                       );
  //                     } else {
  //                       // 취소(아니오) 버튼 클릭 시 이벤트
  //                     }
  //                   } else {
  //                     if (
  //                       window.confirm(
  //                         "다른 기기에서 로그인 중 입니다.\n로그인 하시겠습니까?"
  //                       )
  //                     ) {
  //                       // 확인(예) 버튼 클릭 시 이벤트
  //                       this.props.loginWithJWT(
  //                         this.state,
  //                         this.props.cipher.rsapublickey.publickey,
  //                         this.state.tokendata,
  //                         this.state.remember
  //                       );
  //                     } else {
  //                       // 취소(아니오) 버튼 클릭 시 이벤트
  //                     }
  //                   }
  //                 } else {
  //                   if (
  //                     window.confirm(
  //                       "다른 기기에서 로그인 중 입니다.\n로그인 하시겠습니까?"
  //                     )
  //                   ) {
  //                     // 확인(예) 버튼 클릭 시 이벤트
  //                     this.props.loginWithJWT(
  //                       this.state,
  //                       this.props.cipher.rsapublickey.publickey,
  //                       this.state.tokendata,
  //                       this.state.remember
  //                     );
  //                   } else {
  //                     // 취소(아니오) 버튼 클릭 시 이벤트
  //                   }
  //                 }
  //               }
  //             } else {
  //               alert("아이디는 최소 6자 이상입니다.");
  //             }
  //           }
  //         );
  //       } else {
  //         if (this.state.email.length >= 6) {
  //           this.props.loginWithJWT(
  //             this.state,
  //             this.props.cipher.rsapublickey.publickey,
  //             this.state.tokendata
  //           );
  //         } else {
  //           alert("아이디는 최소 6자 이상입니다.");
  //         }
  //       }
  //     });
  // };

  handleRemember = (e) => {
    this.setState({
      remember: e.target.checked,
    });
  };

  getData = (e) => {
    e.preventDefault();
    console.log("데이터 가져오기");
  };

  render() {
    return (
      <React.Fragment>
        <CardBody className="pt-1 px-3">
          <Form action="/" onSubmit={this.handleLogin}>
            <FormGroup className="form-label-group position-relative">
              <FormattedMessage id="emailid">
                {(emailid) => (
                  <Input
                    placeholder={emailid}
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    required
                    invalid={
                      this.state.email.length >= 6 ||
                      this.state.email.length === 0
                        ? false
                        : true
                    }
                  />
                )}
              </FormattedMessage>
              <FormFeedback>
                {this.state.email.length >= 6 ? (
                  ""
                ) : (
                  <FormattedMessage id="idcheck" />
                )}
              </FormFeedback>
              {/* <div className="form-control-position">
                <Mail size={15} />
              </div> */}
              {/* <Label>아이디</Label> */}
            </FormGroup>
            <FormGroup className="form-label-group position-relative ==">
              <FormattedMessage id="Password">
                {(Password) => (
                  <Input
                    type="password"
                    placeholder={Password}
                    value={this.state.password}
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                    required
                    invalid={
                      this.state.password.length >= 8 ||
                      this.state.password.length === 0
                        ? false
                        : true
                    }
                  />
                )}
              </FormattedMessage>
              <FormFeedback>
                {this.state.password.length >= 8 ? (
                  ""
                ) : (
                  <FormattedMessage id="비밀번호8자" />
                )}
              </FormFeedback>
              {/* <div className="form-control-position">
                <Lock size={15} />
              </div> */}
              {/* <Label>비밀번호</Label> */}
            </FormGroup>
            <FormGroup className="d-flex justify-content-between align-items-center">
              <FormattedMessage id="saveID">
                {(saveID) => (
                  <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={16} />}
                    label={saveID}
                    defaultChecked={
                      this.state.remember === "true" ? true : false
                    }
                    onChange={this.handleRemember}
                  />
                )}
              </FormattedMessage>
              {/* <Link to="/pages/finduser" className="text-primary">
                Forgot email/password?
              </Link> */}
            </FormGroup>
            <div className="d-flex justify-content-center pb-1">
              <Button
                color="primary"
                type="submit"
                block
                style={{ width: "360px", height: "40px" }}
              >
                <FormattedMessage id="Login" />
              </Button>
            </div>

            {/* <div className="d-flex justify-content-center pb-1">
              <Link to="/pages/finduser" style={{ color: "#615e6f" }}>
                <FormattedMessage id="Find ID" />
              </Link>{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              <Link to="/pages/finduser2" style={{ color: "#615e6f" }}>
                <FormattedMessage id="Find Password" />
              </Link>
            </div> */}
            {/* 
            <div className="d-flex justify-content-center">
              <Button
                color="light"
                size="lg"
                block
                onClick={() => {
                  history.push("/pages/register1")
                  this.props.resetCookie()
                }}
              >
                <FormattedMessage id="Sign In" />
              </Button>
            </div> */}
          </Form>
        </CardBody>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cipher: state.auth.cipher,
    values: state.cookies,
  };
};
export default connect(mapStateToProps, {
  // getPublicKey,
  loginWithJWT,
  saveemail,
  delemail,
  resetCookie,
})(LoginJWT);
