import { history } from "../../../history";
import axios from "axios";
import { persistor } from "../../storeConfig/store";
import AES256 from "aes-everywhere";
import { SERVER_URL2, SERVER_URL_TEST } from "../../../config";
import { encryptByPubKey, decryptByAES, AESKey } from "./cipherActions";
import firebase from "firebase";
import moment from "moment";

var db;
var members;

export const loginWithJWT = (user, remember) => {
  if(user.email === "test@test.com" && user.password === "testtest"){
    if (remember === true || remember === "true") {  
      localStorage.setItem("rememberid", user.email);
      localStorage.setItem("remember", remember);    
    } else {
      localStorage.setItem("rememberid", "");
      localStorage.setItem("remember", false);
    }
    // dispatch({
    //         type: "LOGIN_WITH_JWT",
    //         payload: { loggedInUser, loggedInWith: "jwt" },
    //       });

    // loggedInUser 형식에 맞는 더미데이터 필요
    window.location.replace("/analyticsDashboard");
   }else{
    alert("아이디 또는 비밀번호가 일치하지 않습니다.");
   }
}
// 로그인액션부분 i4h api
// export const loginWithJWT = (user, key, tokendata, remember) => {
//   if (remember === true || remember === "true") {
//     localStorage.setItem("rememberid", user.email);
//     localStorage.setItem("remember", remember);
//   } else {
//     localStorage.setItem("rememberid", "");
//     localStorage.setItem("remember", false);
//   }
//   // PUBICKEY를 RSA 암호화
//   let encryptedrsapkey = encryptByPubKey(key);
//   let uservalue = AES256.encrypt(
//     JSON.stringify({
//       user_id: user.email,
//       user_pwd: user.password,
//       device_token: user.tokendata,
//       device_kind: user.devicekind,
//     }),
//     AESKey
//   );
//   return (dispatch) => {
//     axios
//       .get(`${SERVER_URL2}/signin`, {
//         params: {
//           c_key: encryptedrsapkey,
//           c_value: uservalue,
//         },
//       })
//       .then((response) => {
//         let loggedInUser;
//         if (response.data.status === "200") {
//           loggedInUser = decryptByAES(response.data.data);

//           dispatch({
//             type: "LOGIN_WITH_JWT",
//             payload: { loggedInUser, loggedInWith: "jwt", tokendata },
//           });

//           window.sessionStorage.setItem(
//             "UNIT_LENGTH",
//             loggedInUser.unit_length
//           );
//           window.sessionStorage.setItem(
//             "UNIT_WEIGHT",
//             loggedInUser.unit_weight
//           );
//           window.sessionStorage.setItem("UNIT_TEMP", loggedInUser.unit_temp);

//           localStorage.setItem("token", tokendata);
//           if (loggedInUser.first_yn === "y") {
//             localStorage.setItem("firstyn", "y");
//             sessionStorage.setItem("convertModal", "first");
//           } else {
//             localStorage.setItem("firstyn", "n");
//             sessionStorage.setItem("convertModal", "first");
//           }

//           // history.push("/analyticsDashboard");
//           window.location.replace("/analyticsDashboard");
//         } else {
//           if (localStorage.getItem("lang") === "en") {
//             alert("The username or password do not match.");
//           } else {
//             alert("아이디 또는 비밀번호가 일치하지 않습니다.");
//           }
//         }
//       })
//       .catch((err) => console.log(err));
//   };
// };

export const logoutWithJWT = (userid) => {
  // firebase.initializeApp(config);

  return (dispatch) => {
    dispatch({ type: "LOGOUT_WITH_JWT", payload: {} });
    persistor.purge("auth", "dataList", "cookies");
    localStorage.setItem("userid", undefined);
    history.push("/");

    setTimeout(() => window.location.reload(), 600);

    db = firebase.firestore();
    members = db.collection("Doctor");

    members
      .doc(userid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let postData = {
            ID: userid,
            LOGIN_DATETIME: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
            NOW_NAVI: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
            TOKEN: "",
            VIDEOCHAT_START: "",
            VIDEOCHAT_END: "",
          };
          db.collection("Doctor").doc(userid).update(postData);
        }
      });
  };
};

export const changeSigninFirst = (userid) => {
  localStorage.setItem("firstyn", "n");
  return (dispatch) => {
    axios
      .put(`${SERVER_URL_TEST}/signin-first`, {
        user_id: userid,
        first_yn: "n",
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === "200") {
          console.log(response.data.message);
        } else {
          console.log(response.data.message);
        }
      });
  };
};

export const changeRole = (role) => {
  return (dispatch) => dispatch({ type: "CHANGE_ROLE", userRole: role });
};
