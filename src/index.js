import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Auth0Provider } from "./authServices/auth0/auth0Service";
import config from "./authServices/auth0/auth0Config.json";
import { IntlProviderWrapper } from "./utility/context/Internationalization";
import { Layout } from "./utility/context/Layout";
import * as serviceWorker from "./serviceWorker";
import { store, persistor } from "./redux/storeConfig/store";
import Spinner from "./components/@vuexy/spinner/Fallback-spinner";
import "./index.scss";
import "./@fake-db";
import firebase from "firebase";
import { PersistGate } from "redux-persist/integration/react";
import { registerServiceWorker } from "./serviceWorker";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import "./assets/scss/plugins/extensions/toastr.scss";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { history } from "./history";

const LazyApp = lazy(() => import("./App"));

const pconfig = {
  apiKey: "AIzaSyAMiyzuGLBHAk4K18Q4Bla4ljA4cfUf-oM",
  authDomain: "i4h-hicare.firebaseapp.com",
  databaseURL: "https://i4h-hicare.firebaseapp.com",
  projectId: "i4h-hicare",
  storageBucket: "i4h-hicare.appspot.com",
  messagingSenderId: "575076484827",
  appId: "1:575076484827:web:b15851500503c4c2432efe",
  measurementId: "G-5H09HRTQQT",
  // apiKey: "AIzaSyCMvdBZyG3ox-CRl3fTTYmjbag-b_C3NHM",
  // authDomain: "hicare-t.firebaseapp.com",
  // projectId: "hicare-t",
  // storageBucket: "hicare-t.appspot.com",
  // messagingSenderId: "671016231005",
  // appId: "1:671016231005:web:89dda34bf7af594f246db4",
  // measurementId: "G-0N2DEZY0E6",
};

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

const moveScroll = () => {
  window.scrollTo({ left: 0, behavior: "auto" });
};

const duplicationAlert = (db, members, localtoken, docSnapshot) => {
  let value = docSnapshot.data();
  if (value !== undefined) {
    if (localtoken !== undefined || localtoken !== "undefined") {
      if (value.TOKEN !== "") {
        if (localtoken !== value.TOKEN) {
          console.log("파이어스토어 토큰", value.TOKEN);
          console.log("기기토큰: ", localtoken);
          alert("다른기기에서 로그인이 감지되었습니다.");
          members
            .doc(localStorage.getItem("userid"))
            .get()
            .then((doc) => {
              if (doc.exists) {
                let postData = {
                  ID: localStorage.getItem("userid"),
                  LOGIN_DATETIME: moment(new Date()).format(
                    "YYYY-MM-DD hh:mm:ss"
                  ),
                  NOW_NAVI: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
                  TOKEN: "",
                  VIDEOCHAT_START: "",
                  VIDEOCHAT_END: "",
                };
                db.collection("Doctor")
                  .doc(localStorage.getItem("userid"))
                  .update(postData);
              }
            });
          // dispatch({ type: "LOGOUT_WITH_JWT", payload: {} });
          persistor.purge("auth", "dataList", "cookies");
          localStorage.setItem("userid", undefined);
          history.push("/");
          setTimeout(() => window.location.reload(), 1000);
        }
      }
    }
  }
};

// 파이어스토어 정보 지우기 함수
const delletFinfo = () => {
  let db = firebase.firestore();
  let members = db.collection("Doctor");
  members
    .doc(localStorage.getItem("userid"))
    .get()
    .then((doc) => {
      if (doc.exists) {
        let postData = {
          ID: localStorage.getItem("userid"),
          LOGIN_DATETIME: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
          NOW_NAVI: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
          TOKEN: "",
          VIDEOCHAT_START: "",
          VIDEOCHAT_END: "",
        };
        db.collection("Doctor")
          .doc(localStorage.getItem("userid"))
          .update(postData);
      }
    });
};

const getData = () => {
  if (!firebase.apps.length) {
    console.log("userid after: ", localStorage.getItem("userid"));
    firebase.initializeApp(pconfig);
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
    // 중복로그인
    let db = firebase.firestore();
    let members = db.collection("Doctor");
    const fdoc = db.collection("Doctor").doc(localStorage.getItem("userid"));
    let localtoken = localStorage.getItem("token");
    // 중복로그인 실시간 감지
    fdoc.onSnapshot(
      (docSnapshot) => {
        setTimeout(
          () => duplicationAlert(db, members, localtoken, docSnapshot),
          1000
        );
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
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
  } else {
    firebase.app();
    console.log("userid before: ", localStorage.getItem("userid"));
    // 중복로그인 방지 관련 코드
    let db = firebase.firestore();
    let members = db.collection("Doctor");
    const fdoc = db.collection("Doctor").doc(localStorage.getItem("userid"));
    let localtoken = localStorage.getItem("token");
    fdoc.onSnapshot(
      (docSnapshot) => {
        setTimeout(
          () => duplicationAlert(db, members, localtoken, docSnapshot),
          1000
        );
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
  }
};

// firebase 실행

setTimeout(() => getData(), 1000);

moveScroll();

window.addEventListener("unload", delletFinfo);

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin + process.env.REACT_APP_PUBLIC_PATH}
  >
    <IntlProviderWrapper>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Suspense fallback={<Spinner />}>
            <Layout>
              <LazyApp />
            </Layout>
          </Suspense>
        </PersistGate>
      </Provider>
      <ToastContainer />
    </IntlProviderWrapper>
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
// registerServiceWorker()
