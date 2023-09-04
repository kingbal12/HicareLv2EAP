import axios from "axios";
import { history } from "../../../history";
import moment from "moment";
import AES256 from "aes-everywhere";
import {
  SERVER_URL,
  IMG_SERVER_URL,
  SERVER_URL_TEST,
  SERVER_URL2,
} from "../../../config";
import { encryptByPubKey, decryptByAES, AESKey } from "../auth/cipherActions";

// export const getData = params => {
//   return async dispatch => {
//     await axios.get("/api/datalist/data", params).then(response => {
//       dispatch({
//         type: "GET_DATA",
//         data: response.data.data,
//         totalPages: response.data.totalPages,
//         params
//       })
//     })
//   }
// }

const utcFormatDate = (scheduleda) => {
  let utcscheduleda = moment.utc(scheduleda.toISOString()).format("YYYY-MM-DD");
  console.log("utc:", utcscheduleda);
  return utcscheduleda;
};

const utcFormatDateApp = (scheduleda) => {
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

const utcStartMon = (scheduleda) => {
  let utcscheduleda = moment
    .utc(scheduleda.toISOString())
    .startOf("month")
    .format("YYYY-MM-DD");
  console.log("utc:", utcscheduleda);
  return utcscheduleda;
};

const utcEndMon = (scheduleda) => {
  let utcscheduleda = moment
    .utc(scheduleda.toISOString())
    .endOf("month")
    .format("YYYY-MM-DD");
  console.log("utc:", utcscheduleda);
  return utcscheduleda;
};

const localFormDate = (scheduleda) => {
  console.log("utc", scheduleda);
  let localscheduledate = moment.utc(scheduleda).toDate();
  localscheduledate = moment(localscheduledate).format();
  console.log("locale:", localscheduledate);
  return localscheduledate;
};

const localVitalFormDate = (scheduleda) => {
  console.log("utc", scheduleda);
  let localscheduledate = moment.utc(scheduleda).toDate();
  localscheduledate = moment(localscheduledate).format("YYYY-MM-DD HH:mm");
  console.log("locale:", localscheduledate);
  return localscheduledate;
};

export const gettokbox = (userid, appointnum, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      appoint_num: appointnum,
    }),
    AESKey
  );
  return (dispatch) => {
    axios
      .get(`${SERVER_URL2}/doctor/treatment/video-call`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })

      .then((response) => {
        let tokbox = decryptByAES(response.data.data);

        console.log(tokbox);
        if (
          response.data.status === "200" &&
          tokbox.TOK_KEY !== "" &&
          tokbox.TOK_SESSION !== "" &&
          tokbox.TOK_TOKEN !== ""
        ) {
          dispatch({
            type: "GET_TOKBOX",
            data: tokbox,
          });
          history.push("/pages/consultingroom");
        } else {
          alert(
            "화상진료실이 아직 준비되지 않았습니다. \n새로고침 후 다시 입장해주시기 바랍니다."
          );
        }
      })
      .catch((err) => console.log(err));
  };
};

export const getPaymentTotalData = (userid, startdate, enddate, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      start_date: startdate,
      end_date: enddate,
      page_amount: 500000,
      page_num: 1,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/treatment/payments`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let paydata = decryptByAES(response.data.data);
        let len = paydata.PAY_LIST.length;
        let totalPay = new Array();
        let sumtotal = 0;
        for (let i = 0; i < len; i++) {
          let jsonObj = new Object();
          jsonObj.PAY_TOTAL = paydata.PAY_LIST[i].PAY_TOTAL;
          jsonObj = JSON.stringify(jsonObj);
          totalPay.push(JSON.parse(jsonObj));
          if (len > 0) {
            sumtotal = totalPay[i].PAY_TOTAL + sumtotal;
          }
        }

        dispatch({
          type: "GET_PAYMENT_TOTAL_DATA",
          totalPay: sumtotal,
          totalpaydata: paydata.PAY_LIST,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const getPaymentData = (
  userid,
  startdate,
  enddate,
  pageamount,
  pagenum,
  key
) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      start_date: startdate,
      end_date: enddate,
      page_amount: pageamount,
      page_num: pagenum,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/treatment/payments`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let paydata = decryptByAES(response.data.data);
        let totalPage = Math.ceil(paydata.COUNT / 5);
        console.log("Paydata: ", paydata);

        dispatch({
          type: "GET_PAYMENT_DATA",
          data: paydata,
          totalPages: totalPage,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const getAppData = (
  userid,
  pageamount,
  pagenum,
  appstate,
  mdkinds,
  key
) => {
  let npagemount = Number(pageamount);
  let npagenum = Number(pagenum);
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      start_date: utcFormatDateApp(new Date()),
      page_amount: npagemount,
      page_num: npagenum,
      app_states: appstate,
      medical_kinds: mdkinds,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/appointment/dashboard`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let appoints = decryptByAES(response.data.data);
        let totalPage = Math.ceil(appoints.COUNT_APP / 5);
        let length = appoints.APPOINT_LIST.length;
        let appointlist = new Array();
        for (let i = 0; i < length; i++) {
          if (
            appoints.APPOINT_LIST[i].APPOINT_TIME <
              moment(new Date()).format("YYYY-MM-DD 20:01") ||
            appoints.APPOINT_LIST[i].MEDICAL_KIND === "3"
          ) {
            let jsonObj = new Object();
            jsonObj.APPOINT_KIND = appoints.APPOINT_LIST[i].APPOINT_KIND;
            jsonObj.APPOINT_NUM = appoints.APPOINT_LIST[i].APPOINT_NUM;
            jsonObj.MEDICAL_KIND = appoints.APPOINT_LIST[i].MEDICAL_KIND;
            jsonObj.APPOINT_TIME = localFormDate(
              appoints.APPOINT_LIST[i].APPOINT_TIME
            );
            jsonObj.BIRTH_DT = appoints.APPOINT_LIST[i].BIRTH_DT;
            jsonObj.FIRST_YN = appoints.APPOINT_LIST[i].FIRST_YN;
            jsonObj.L_NAME = appoints.APPOINT_LIST[i].L_NAME;
            jsonObj.F_NAME = appoints.APPOINT_LIST[i].F_NAME;
            jsonObj.NOTE_DX = appoints.APPOINT_LIST[i].NOTE_DX;
            jsonObj.PATIENT_ID = appoints.APPOINT_LIST[i].PATIENT_ID;
            jsonObj.SYMPTOM = appoints.APPOINT_LIST[i].SYMPTOM;
            jsonObj.VITAL_STATE = appoints.APPOINT_LIST[i].VITAL_STATE;
            jsonObj.GENDER = appoints.APPOINT_LIST[i].GENDER;
            jsonObj.AGE = appoints.APPOINT_LIST[i].AGE;
            jsonObj.APPOINT_STATE = appoints.APPOINT_LIST[i].APPOINT_STATE;
            jsonObj = JSON.stringify(jsonObj);
            //String 형태로 파싱한 객체를 다시 json으로 변환
            appointlist.push(JSON.parse(jsonObj));
          }
        }

        dispatch({
          type: "GET_APPOINT_DATA",
          data: appointlist,
          totalPages: totalPage,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const getMonAppData = (
  userid,
  pageamount,
  pagenum,
  appstate,
  mdkinds,
  key
) => {
  let npagemount = Number(pageamount);
  let npagenum = Number(pagenum);
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      start_date: utcFormatDateApp(new Date()),
      end_date: "2033-08-24 00:00",
      page_amount: npagemount,
      page_num: npagenum,
      app_states: appstate,
      medical_kinds: mdkinds,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/appointment/dashboard`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let appoints = decryptByAES(response.data.data);
        let totalPage = Math.ceil(appoints.COUNT_APP / 5);
        let length = appoints.APPOINT_LIST.length;
        let appointlist = new Array();
        for (let i = 0; i < length; i++) {
          let jsonObj = new Object();
          jsonObj.APPOINT_KIND = appoints.APPOINT_LIST[i].APPOINT_KIND;
          jsonObj.APPOINT_NUM = appoints.APPOINT_LIST[i].APPOINT_NUM;
          jsonObj.MEDICAL_KIND = appoints.APPOINT_LIST[i].MEDICAL_KIND;
          jsonObj.APPOINT_TIME = localFormDate(
            appoints.APPOINT_LIST[i].APPOINT_TIME
          );
          jsonObj.BIRTH_DT = appoints.APPOINT_LIST[i].BIRTH_DT;
          jsonObj.FIRST_YN = appoints.APPOINT_LIST[i].FIRST_YN;
          jsonObj.L_NAME = appoints.APPOINT_LIST[i].L_NAME;
          jsonObj.F_NAME = appoints.APPOINT_LIST[i].F_NAME;
          jsonObj.NOTE_DX = appoints.APPOINT_LIST[i].NOTE_DX;
          jsonObj.PATIENT_ID = appoints.APPOINT_LIST[i].PATIENT_ID;
          jsonObj.SYMPTOM = appoints.APPOINT_LIST[i].SYMPTOM;
          jsonObj.VITAL_STATE = appoints.APPOINT_LIST[i].VITAL_STATE;
          jsonObj.GENDER = appoints.APPOINT_LIST[i].GENDER;
          jsonObj.AGE = appoints.APPOINT_LIST[i].AGE;
          jsonObj.APPOINT_STATE = appoints.APPOINT_LIST[i].APPOINT_STATE;
          jsonObj = JSON.stringify(jsonObj);
          //String 형태로 파싱한 객체를 다시 json으로 변환
          appointlist.push(JSON.parse(jsonObj));
        }

        dispatch({
          type: "GET_APPOINT_DATA",
          data: appointlist,
          totalPages: totalPage,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const resetAppData = () => {
  return async (dispatch) => {
    dispatch({
      type: "RESET_APPOINT_DATA",
      data: [],
      totalPages: 0,
    });
  };
};

export const resetAppointData = () => {
  return async (dispatch) => {
    dispatch({
      type: "RESET_APPOINTMENT_DATA",
    });
  };
};

export const getData = (userid, pageamount, pagenum) => {
  let npagemount = Number(pageamount);
  let npagenum = Number(pagenum);
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL_TEST}/doctor/patient/patients`, {
        params: {
          user_id: userid,
          page_amount: npagemount,
          page_num: npagenum,
        },
      })
      .then((response) => {
        let patientsdata = response.data.data;
        let totalPage = Math.ceil(patientsdata.COUNT / npagemount);
        console.log(totalPage, response);

        let length = patientsdata.PATIENT_LIST.length;
        console.log("length :" + length);
        let patientlist = new Array();
        for (let i = 0; i < length; i++) {
          let jsonObj = new Object();
          jsonObj.PATIENT_ID = patientsdata.PATIENT_LIST[i].PATIENT_ID;
          jsonObj.L_NAME = patientsdata.PATIENT_LIST[i].L_NAME;
          jsonObj.F_NAME = patientsdata.PATIENT_LIST[i].F_NAME;
          jsonObj.GENDER = patientsdata.PATIENT_LIST[i].GENDER;
          jsonObj.AGE = patientsdata.PATIENT_LIST[i].AGE;
          jsonObj.BIRTH_DT = patientsdata.PATIENT_LIST[i].BIRTH_DT;
          jsonObj.NOTE_DX = patientsdata.PATIENT_LIST[i].NOTE_DX;
          jsonObj.FIRST_YN = patientsdata.PATIENT_LIST[i].FIRST_YN;
          jsonObj.BP = patientsdata.PATIENT_LIST[i]["1_STATE"];
          jsonObj.PULSE = patientsdata.PATIENT_LIST[i]["2_STATE"];
          jsonObj.TEMPERATURE = patientsdata.PATIENT_LIST[i]["3_STATE"];
          jsonObj.BS = patientsdata.PATIENT_LIST[i]["4_STATE"];
          jsonObj.SPO2 = patientsdata.PATIENT_LIST[i]["5_STATE"];
          jsonObj.BW = patientsdata.PATIENT_LIST[i]["6_STATE"];
          jsonObj.BAND = patientsdata.PATIENT_LIST[i]["7_STATE"];

          jsonObj = JSON.stringify(jsonObj);
          //String 형태로 파싱한 객체를 다시 json으로 변환
          patientlist.push(JSON.parse(jsonObj));
        }

        dispatch({
          type: "GET_DATA",
          data: patientlist,
          totalPages: totalPage,
          // params
        });
      })
      .catch((err) => console.log(err));
  };
};

// 암호화
// export const getData = (userid, pageamount, pagenum, key) => {
//   let npagemount = Number(pageamount);
//   let npagenum = Number(pagenum);
//   let encryptedrsapkey = encryptByPubKey(key);
//   let value = AES256.encrypt(
//     JSON.stringify({
//       user_id: userid,
//       page_amount: npagemount,
//       page_num: npagenum,
//     }),
//     AESKey
//   );
//   return async (dispatch) => {
//     await axios
//       .get(`${SERVER_URL}/doctor/patient/patients`, {
//         params: {
//           c_key: encryptedrsapkey,
//           c_value: value,
//         },
//       })
//       .then((response) => {
//         let patientsdata = decryptByAES(response.data.data);
//         let totalPage = Math.ceil(patientsdata.COUNT / npagemount);
//         console.log(totalPage, response);

//         let length = patientsdata.PATIENT_LIST.length;
//         console.log("length :" + length);
//         let patientlist = new Array();
//         for (let i = 0; i < length; i++) {
//           let jsonObj = new Object();
//           jsonObj.PATIENT_ID = patientsdata.PATIENT_LIST[i].PATIENT_ID;
//           jsonObj.F_NAME = patientsdata.PATIENT_LIST[i].F_NAME;
//           jsonObj.GENDER = patientsdata.PATIENT_LIST[i].GENDER;
//           jsonObj.AGE = patientsdata.PATIENT_LIST[i].AGE;
//           jsonObj.BIRTH_DT = patientsdata.PATIENT_LIST[i].BIRTH_DT;
//           jsonObj.NOTE_DX = patientsdata.PATIENT_LIST[i].NOTE_DX;
//           jsonObj.FIRST_YN = patientsdata.PATIENT_LIST[i].FIRST_YN;
//           jsonObj.BP = patientsdata.PATIENT_LIST[i]["1_STATE"];
//           jsonObj.PULSE = patientsdata.PATIENT_LIST[i]["2_STATE"];
//           jsonObj.TEMPERATURE = patientsdata.PATIENT_LIST[i]["3_STATE"];
//           jsonObj.BS = patientsdata.PATIENT_LIST[i]["4_STATE"];
//           jsonObj.SPO2 = patientsdata.PATIENT_LIST[i]["5_STATE"];
//           jsonObj.BW = patientsdata.PATIENT_LIST[i]["6_STATE"];

//           jsonObj = JSON.stringify(jsonObj);
//           //String 형태로 파싱한 객체를 다시 json으로 변환
//           patientlist.push(JSON.parse(jsonObj));
//         }

//         dispatch({
//           type: "GET_DATA",
//           data: patientlist,
//           totalPages: totalPage,
//           // params
//         });
//       })
//       .catch((err) => console.log(err));
//   };
// };

export const getNameData = (userid, pageamount, pagenum, fname, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      page_amount: pageamount,
      page_num: pagenum,
      f_name: fname,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/patient/patients`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let patientsdata = decryptByAES(response.data.data);
        let length = patientsdata.PATIENT_LIST.length;
        let totalPage = Math.ceil(length / 5);
        console.log(totalPage, response);

        console.log("length :" + length);
        let patientlist = new Array();
        for (let i = 0; i < length; i++) {
          let jsonObj = new Object();
          jsonObj.PATIENT_ID = patientsdata.PATIENT_LIST[i].PATIENT_ID;
          jsonObj.L_NAME = patientsdata.PATIENT_LIST[i].L_NAME;
          jsonObj.F_NAME = patientsdata.PATIENT_LIST[i].F_NAME;
          jsonObj.GENDER = patientsdata.PATIENT_LIST[i].GENDER;
          jsonObj.AGE = patientsdata.PATIENT_LIST[i].AGE;
          jsonObj.BIRTH_DT = patientsdata.PATIENT_LIST[i].BIRTH_DT;
          jsonObj.NOTE_DX = patientsdata.PATIENT_LIST[i].NOTE_DX;
          jsonObj.FIRST_YN = patientsdata.PATIENT_LIST[i].FIRST_YN;
          jsonObj.BP = patientsdata.PATIENT_LIST[i]["1_STATE"];
          jsonObj.PULSE = patientsdata.PATIENT_LIST[i]["2_STATE"];
          jsonObj.TEMPERATURE = patientsdata.PATIENT_LIST[i]["3_STATE"];
          jsonObj.BS = patientsdata.PATIENT_LIST[i]["4_STATE"];
          jsonObj.SPO2 = patientsdata.PATIENT_LIST[i]["5_STATE"];
          jsonObj.BW = patientsdata.PATIENT_LIST[i]["6_STATE"];

          jsonObj = JSON.stringify(jsonObj);
          //String 형태로 파싱한 객체를 다시 json으로 변환
          patientlist.push(JSON.parse(jsonObj));
        }

        dispatch({
          type: "GET_NAME_DATA",
          data: patientlist,
          totalPages: totalPage,
          searchName: fname,
          // params
        });
      })
      .catch((err) => console.log(err));
  };
};

export const resetSearchName = () => {
  return (dispatch) => {
    dispatch({
      type: "RESET_NAME_DATA",
      searchName: "",
    });
  };
};

export const resetPastConsult = () => {
  return (dispatch) => {
    dispatch({
      type: "RESET_PAST_DATA",
      list: [],
    });
  };
};

export const getPatientInfo = (userid, patientid, appointnum, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      patient_id: patientid,
      appoint_num: appointnum,
    }),
    AESKey
  );

  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/patient/patient-info`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        if (response.data.status === "200") {
          window.sessionStorage.setItem("pid", patientid);
          let patientsdata = decryptByAES(response.data.data);
          history.push("/patientinfo");

          let rtime = "";
          let topappotime = "";
          let appoint = patientsdata.APPOINT_INFO;
          let personalinfo = patientsdata.PERSONAL_INFO;
          personalinfo.BP = patientsdata.PERSONAL_INFO["1_STATE"];
          personalinfo.PULSE = patientsdata.PERSONAL_INFO["2_STATE"];
          personalinfo.TEMPERATURE = patientsdata.PERSONAL_INFO["3_STATE"];
          personalinfo.BS = patientsdata.PERSONAL_INFO["4_STATE"];
          personalinfo.SPO2 = patientsdata.PERSONAL_INFO["5_STATE"];
          personalinfo.BW = patientsdata.PERSONAL_INFO["6_STATE"];
          let consultlist = new Array();
          // 수정필요
          if (
            patientsdata.CONSULT_LIST.length !== 0 &&
            patientsdata.CONSULT_LIST.length >= 2
          ) {
            for (let i = 0; i < 2; i++) {
              let jsonObj = new Object();
              jsonObj.CONSULT_LIST = patientsdata.CONSULT_LIST[i].APPOINT_TIME;
              jsonObj.NOTE_DX = patientsdata.CONSULT_LIST[i].NOTE_DX;
              jsonObj = JSON.stringify(jsonObj);
              //String 형태로 파싱한 객체를 다시 json으로 변환
              consultlist.push(JSON.parse(jsonObj));
            }
          } else if (
            patientsdata.CONSULT_LIST.length !== 0 &&
            patientsdata.CONSULT_LIST.length < 2
          ) {
            for (let i = 0; i < 1; i++) {
              let jsonObj = new Object();
              jsonObj.CONSULT_LIST = patientsdata.CONSULT_LIST[i].APPOINT_TIME;
              jsonObj.NOTE_DX = patientsdata.CONSULT_LIST[i].NOTE_DX;
              jsonObj = JSON.stringify(jsonObj);
              //String 형태로 파싱한 객체를 다시 json으로 변환
              consultlist.push(JSON.parse(jsonObj));
            }
          } else {
            consultlist = [];
          }

          if (appoint !== null) {
            rtime = localFormDate(patientsdata.APPOINT_INFO.APPOINT_TIME);
          }
          if (appoint !== null) {
            topappotime = moment(
              localFormDate(patientsdata.APPOINT_INFO.APPOINT_TIME)
            ).format("YYYY.MM.DD (dddd) a h:mm");
          }
          if (appoint !== null) {
            appoint.APPOINT_TIME = moment(
              localFormDate(appoint.APPOINT_TIME)
            ).format("hh:mm A");
          }

          if (personalinfo.BIRTH_DT !== undefined) {
            personalinfo.BIRTH_DT =
              localStorage.getItem("lang") === "ko"
                ? moment(personalinfo.BIRTH_DT).format("YYYY.MM.DD")
                : moment(personalinfo.BIRTH_DT).format("MMMM.DD.YYYY");
          } else {
            personalinfo.BIRTH_DT = "없음";
          }

          dispatch({
            type: "GET_PATIENT_INFO",
            list: consultlist,
            info: personalinfo,
            appointment: appoint,
            rtime: rtime,
            topappotime: topappotime,
            secondlist: patientsdata.DICOM_LIST,
          });
        } else {
          alert("환자 정보를 불러오지 못하였습니다.");
        }
      })
      .catch((err) => console.log(err));
  };
};

export const resetPatientInfo = () => {
  return (dispatch) => {
    dispatch({
      type: "RESET_PATIENT_INFO",
      info: "",
    });
  };
};

// 단위 변환 함수
export const convertLength = (cm) => {
  let length;
  if (sessionStorage.getItem("UNIT_LENGTH") === "in") {
    length = cm / 2.54;
  } else {
    length = cm;
  }
  return length;
};

export const convertWeight = (kg) => {
  let weight;
  if (sessionStorage.getItem("UNIT_WEIGHT") === "lb") {
    weight = kg * 2.205;
  } else {
    weight = kg;
  }
  return weight;
};

export const convertTemp = (celsius) => {
  let temp;
  if (sessionStorage.getItem("UNIT_TEMP") === "f") {
    temp = (celsius * 9) / 5 + 32;
  } else {
    temp = celsius;
  }
  return temp;
};

export const getVitalData = (patientid, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      patient_id: patientid,
      start_date: moment().utc().add(-6, "days").format("YYYYMMDD"),
      end_date: moment().utc().format("YYYYMMDD"),
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/patient/patient-vital`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        if (response.data.status === "200") {
          let vdata = decryptByAES(response.data.data);
          let bp = new Array();
          let pulse = new Array();
          let temp = new Array();
          let bs = new Array();
          let we = new Array();
          let spo2 = new Array();
          let band = new Array();
          let gforLimit = 6;
          let forLimit = 6;
          let sforLimit = 6;
          let tforLimit = 6;
          let wforLimit = 6;
          let bandforLimit = 6;
          if (vdata.GLUCOSE_LIST.length < gforLimit)
            gforLimit = vdata.GLUCOSE_LIST.length;
          if (vdata.PRESSURE_LIST.length < forLimit)
            forLimit = vdata.PRESSURE_LIST.length;
          if (vdata.SPO2_LIST.length < sforLimit)
            sforLimit = vdata.SPO2_LIST.length;
          if (vdata.TEMP_LIST.length < tforLimit)
            tforLimit = vdata.TEMP_LIST.length;
          if (vdata.WEIGHT_LIST.length < wforLimit)
            wforLimit = vdata.WEIGHT_LIST.length;
          if (vdata.BAND_LIST.length < bandforLimit)
            bandforLimit = vdata.BAND_LIST.length;

          for (
            let i = vdata.GLUCOSE_LIST.length - gforLimit;
            i < vdata.GLUCOSE_LIST.length;
            i++
          ) {
            let bsobj = new Object();

            bsobj = vdata.GLUCOSE_LIST[i];
            bsobj.CREATE_TIME = localVitalFormDate(
              vdata.GLUCOSE_LIST[i].CREATE_TIME
            );

            bsobj = JSON.stringify(bsobj);
            //String 형태로 파싱한 객체를 다시 json으로 변환
            if (bsobj !== undefined) {
              bs.push(JSON.parse(bsobj));
            }
          }

          for (
            let i = vdata.PRESSURE_LIST.length - forLimit;
            i < vdata.PRESSURE_LIST.length;
            i++
          ) {
            let bpobj = new Object();
            let jsonObj = new Object();

            bpobj = vdata.PRESSURE_LIST[i];
            bpobj.CREATE_TIME = localVitalFormDate(
              vdata.PRESSURE_LIST[i].CREATE_TIME
            );
            jsonObj.CREATE_TIME = vdata.PRESSURE_LIST[i].CREATE_TIME;

            jsonObj.PULSE_VAL = vdata.PRESSURE_LIST[i].PULSE_VAL;

            bpobj = JSON.stringify(bpobj);
            jsonObj = JSON.stringify(jsonObj);

            //String 형태로 파싱한 객체를 다시 json으로 변환
            if (bpobj !== undefined) {
              bp.push(JSON.parse(bpobj));
            }
            if (jsonObj !== undefined) {
              pulse.push(JSON.parse(jsonObj));
            }
          }

          for (
            let i = vdata.SPO2_LIST.length - sforLimit;
            i < vdata.SPO2_LIST.length;
            i++
          ) {
            let spo2obj = new Object();

            spo2obj = vdata.SPO2_LIST[i];
            spo2obj.CREATE_TIME = localVitalFormDate(
              vdata.SPO2_LIST[i].CREATE_TIME
            );

            spo2obj = JSON.stringify(spo2obj);

            //String 형태로 파싱한 객체를 다시 json으로 변환
            if (spo2obj !== undefined) {
              spo2.push(JSON.parse(spo2obj));
            }
          }

          for (
            let i = vdata.TEMP_LIST.length - tforLimit;
            i < vdata.TEMP_LIST.length;
            i++
          ) {
            let tempobj = new Object();

            tempobj = vdata.TEMP_LIST[i];
            tempobj.TEMP_VAL = convertWeight(
              vdata.TEMP_LIST[i].TEMP_VAL
            ).toFixed(2);
            tempobj.CREATE_TIME = localVitalFormDate(
              vdata.TEMP_LIST[i].CREATE_TIME
            );

            tempobj = JSON.stringify(tempobj);
            //String 형태로 파싱한 객체를 다시 json으로 변환
            if (tempobj !== undefined) {
              temp.push(JSON.parse(tempobj));
            }
          }

          for (
            let i = vdata.WEIGHT_LIST.length - wforLimit;
            i < vdata.WEIGHT_LIST.length;
            i++
          ) {
            let weobj = new Object();

            weobj = vdata.WEIGHT_LIST[i];
            weobj.WEIGHT_VAL = convertWeight(
              vdata.WEIGHT_LIST[i].WEIGHT_VAL
            ).toFixed(2);
            weobj.CREATE_TIME = localVitalFormDate(
              vdata.WEIGHT_LIST[i].CREATE_TIME
            );

            weobj = JSON.stringify(weobj);

            if (weobj !== undefined) {
              we.push(JSON.parse(weobj));
            }
          }

          for (let i = 0; i < bandforLimit; i++) {
            let bandobj = new Object();

            bandobj = vdata.BAND_LIST[i];
            bandobj.CREATE_TIME = localVitalFormDate(
              vdata.BAND_LIST[i].CREATE_TIME
            );

            bandobj = JSON.stringify(bandobj);

            if (bandobj !== undefined) {
              band.push(JSON.parse(bandobj));
            }
          }

          dispatch({
            type: "GET_VITAL_DATA",
            BP: bp,
            PULSE: pulse,
            TEMP: temp,
            BS: bs,
            WE: we,
            SPO2: spo2,
            BAND: band,
          });
        }
      })
      .catch((err) => console.log(err));
  };
};

export const getVitalDataAll = (patientid, startdate) => {
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL_TEST}/doctor/patient/patient-vital`, {
        params: {
          patient_id: patientid,
          start_date: startdate,
          end_date: moment().utc().format("YYYYMMDD"),
        },
      })
      .then((response) => {
        if (response.data.status === "200") {
          let vdata = response.data.data;
          let bp = new Array();
          let pulse = new Array();
          let temp = new Array();
          let bs = new Array();
          let we = new Array();
          let spo2 = new Array();
          let band = new Array();
          let gforLimit = 100;
          let forLimit = 100;
          let sforLimit = 100;
          let tforLimit = 100;
          let wforLimit = 100;
          let bandforLimit = 100;
          if (vdata.GLUCOSE_LIST.length < gforLimit)
            gforLimit = vdata.GLUCOSE_LIST.length;
          if (vdata.PRESSURE_LIST.length < forLimit)
            forLimit = vdata.PRESSURE_LIST.length;
          if (vdata.SPO2_LIST.length < sforLimit)
            sforLimit = vdata.SPO2_LIST.length;
          if (vdata.TEMP_LIST.length < tforLimit)
            tforLimit = vdata.TEMP_LIST.length;
          if (vdata.WEIGHT_LIST.length < wforLimit)
            wforLimit = vdata.WEIGHT_LIST.length;
          if (vdata.BAND_LIST.length < bandforLimit)
            bandforLimit = vdata.BAND_LIST.length;

          for (let i = 0; i < gforLimit; i++) {
            let bsobj = new Object();

            bsobj = vdata.GLUCOSE_LIST[i];
            bsobj.CREATE_TIME = localVitalFormDate(
              vdata.GLUCOSE_LIST[i].CREATE_TIME
            );

            bsobj = JSON.stringify(bsobj);
            //String 형태로 파싱한 객체를 다시 json으로 변환
            if (bsobj !== undefined) {
              bs.push(JSON.parse(bsobj));
            }
          }

          for (let i = 0; i < forLimit; i++) {
            let bpobj = new Object();
            let jsonObj = new Object();

            bpobj = vdata.PRESSURE_LIST[i];
            bpobj.CREATE_TIME = localVitalFormDate(
              vdata.PRESSURE_LIST[i].CREATE_TIME
            );
            jsonObj.CREATE_TIME = vdata.PRESSURE_LIST[i].CREATE_TIME;

            jsonObj.PULSE_VAL = vdata.PRESSURE_LIST[i].PULSE_VAL;

            bpobj = JSON.stringify(bpobj);
            jsonObj = JSON.stringify(jsonObj);

            //String 형태로 파싱한 객체를 다시 json으로 변환
            if (bpobj !== undefined) {
              bp.push(JSON.parse(bpobj));
            }
            if (jsonObj !== undefined) {
              pulse.push(JSON.parse(jsonObj));
            }
          }

          for (let i = 0; i < sforLimit; i++) {
            let spo2obj = new Object();

            spo2obj = vdata.SPO2_LIST[i];
            spo2obj.CREATE_TIME = localVitalFormDate(
              vdata.SPO2_LIST[i].CREATE_TIME
            );

            spo2obj = JSON.stringify(spo2obj);

            //String 형태로 파싱한 객체를 다시 json으로 변환
            if (spo2obj !== undefined) {
              spo2.push(JSON.parse(spo2obj));
            }
          }

          for (let i = 0; i < tforLimit; i++) {
            let tempobj = new Object();

            tempobj = vdata.TEMP_LIST[i];
            tempobj.TEMP_VAL = convertWeight(
              vdata.TEMP_LIST[i].TEMP_VAL
            ).toFixed(2);
            tempobj.CREATE_TIME = localVitalFormDate(
              vdata.TEMP_LIST[i].CREATE_TIME
            );

            tempobj = JSON.stringify(tempobj);
            //String 형태로 파싱한 객체를 다시 json으로 변환
            if (tempobj !== undefined) {
              temp.push(JSON.parse(tempobj));
            }
          }

          for (let i = 0; i < wforLimit; i++) {
            let weobj = new Object();

            weobj = vdata.WEIGHT_LIST[i];
            weobj.WEIGHT_VAL = convertWeight(
              vdata.WEIGHT_LIST[i].WEIGHT_VAL
            ).toFixed(2);
            weobj.CREATE_TIME = localVitalFormDate(
              vdata.WEIGHT_LIST[i].CREATE_TIME
            );

            weobj = JSON.stringify(weobj);

            if (weobj !== undefined) {
              we.push(JSON.parse(weobj));
            }
          }

          for (let i = 0; i < bandforLimit; i++) {
            let bandobj = new Object();

            bandobj = vdata.BAND_LIST[i];
            bandobj.CREATE_TIME = localVitalFormDate(
              vdata.BAND_LIST[i].CREATE_TIME
            );

            bandobj = JSON.stringify(bandobj);

            if (bandobj !== undefined) {
              band.push(JSON.parse(bandobj));
            }
          }

          dispatch({
            type: "GET_VITAL_DATA_ALL",
            BP: bp,
            PULSE: pulse,
            TEMP: temp,
            BS: bs,
            WE: we,
            SPO2: spo2,
            BAND: band,
          });
        }
      })
      .catch((err) => console.log(err));
  };
};

// 암호화
// export const getVitalDataAll = (patientid, startdate, key) => {
//   let encryptedrsapkey = encryptByPubKey(key);
//   let value = AES256.encrypt(
//     JSON.stringify({
//       patient_id: patientid,
//       start_date: startdate,
//       end_date: moment().utc().format("YYYYMMDD"),
//     }),
//     AESKey
//   );
//   return async (dispatch) => {
//     await axios
//       .get(`${SERVER_URL}/doctor/patient/patient-vital`, {
//         params: {
//           c_key: encryptedrsapkey,
//           c_value: value,
//         },
//       })
//       .then((response) => {
//         if (response.data.status === "200") {
//           let vdata = decryptByAES(response.data.data);
//           console.log("단위데이터", vdata);
//           let bp = new Array();
//           let pulse = new Array();
//           let temp = new Array();
//           let bs = new Array();
//           let we = new Array();
//           let spo2 = new Array();
//           let gforLimit = 100;
//           let forLimit = 100;
//           let sforLimit = 100;
//           let tforLimit = 100;
//           let wforLimit = 100;
//           if (vdata.GLUCOSE_LIST.length < gforLimit)
//             gforLimit = vdata.GLUCOSE_LIST.length;
//           if (vdata.PRESSURE_LIST.length < forLimit)
//             forLimit = vdata.PRESSURE_LIST.length;
//           if (vdata.SPO2_LIST.length < sforLimit)
//             sforLimit = vdata.SPO2_LIST.length;
//           if (vdata.TEMP_LIST.length < tforLimit)
//             tforLimit = vdata.TEMP_LIST.length;
//           if (vdata.WEIGHT_LIST.length < wforLimit)
//             wforLimit = vdata.WEIGHT_LIST.length;

//           for (let i = 0; i < gforLimit; i++) {
//             let bsobj = new Object();

//             bsobj = vdata.GLUCOSE_LIST[i];
//             bsobj.CREATE_TIME = localVitalFormDate(
//               vdata.GLUCOSE_LIST[i].CREATE_TIME
//             );

//             bsobj = JSON.stringify(bsobj);
//             //String 형태로 파싱한 객체를 다시 json으로 변환
//             if (bsobj !== undefined) {
//               bs.push(JSON.parse(bsobj));
//             }
//           }

//           for (let i = 0; i < forLimit; i++) {
//             let bpobj = new Object();
//             let jsonObj = new Object();

//             bpobj = vdata.PRESSURE_LIST[i];
//             bpobj.CREATE_TIME = localVitalFormDate(
//               vdata.PRESSURE_LIST[i].CREATE_TIME
//             );
//             jsonObj.CREATE_TIME = vdata.PRESSURE_LIST[i].CREATE_TIME;

//             jsonObj.PULSE_VAL = vdata.PRESSURE_LIST[i].PULSE_VAL;

//             bpobj = JSON.stringify(bpobj);
//             jsonObj = JSON.stringify(jsonObj);

//             //String 형태로 파싱한 객체를 다시 json으로 변환
//             if (bpobj !== undefined) {
//               bp.push(JSON.parse(bpobj));
//             }
//             if (jsonObj !== undefined) {
//               pulse.push(JSON.parse(jsonObj));
//             }
//           }

//           for (let i = 0; i < sforLimit; i++) {
//             let spo2obj = new Object();

//             spo2obj = vdata.SPO2_LIST[i];
//             spo2obj.CREATE_TIME = localVitalFormDate(
//               vdata.SPO2_LIST[i].CREATE_TIME
//             );

//             spo2obj = JSON.stringify(spo2obj);

//             //String 형태로 파싱한 객체를 다시 json으로 변환
//             if (spo2obj !== undefined) {
//               spo2.push(JSON.parse(spo2obj));
//             }
//           }

//           for (let i = 0; i < tforLimit; i++) {
//             let tempobj = new Object();

//             tempobj = vdata.TEMP_LIST[i];
//             tempobj.CREATE_TIME = localVitalFormDate(
//               vdata.TEMP_LIST[i].CREATE_TIME
//             );

//             tempobj = JSON.stringify(tempobj);
//             //String 형태로 파싱한 객체를 다시 json으로 변환
//             if (tempobj !== undefined) {
//               temp.push(JSON.parse(tempobj));
//             }
//           }

//           for (let i = 0; i < wforLimit; i++) {
//             let weobj = new Object();

//             weobj = vdata.WEIGHT_LIST[i];
//             weobj.CREATE_TIME = localVitalFormDate(
//               vdata.WEIGHT_LIST[i].CREATE_TIME
//             );

//             weobj = JSON.stringify(weobj);

//             if (weobj !== undefined) {
//               we.push(JSON.parse(weobj));
//             }
//           }

//           dispatch({
//             type: "GET_VITAL_DATA_ALL",
//             BP: bp,
//             PULSE: pulse,
//             TEMP: temp,
//             BS: bs,
//             WE: we,
//             SPO2: spo2,
//           });
//         }
//       })
//       .catch((err) => console.log(err));
//   };
// };

export const serachVitalData = (patientid, startdate, enddate, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      patient_id: patientid,
      start_date: moment(startdate[0]).utc().format("YYYYMMDD"),
      end_date: moment(enddate[0]).utc().format("YYYYMMDD"),
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/patient/patient-vital`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })

      .then((response) => {
        if (response.data.status === "200") {
          let vdata = decryptByAES(response.data.data);
          let bp = new Array();
          let pulse = new Array();
          let temp = new Array();
          let bs = new Array();
          let we = new Array();
          let spo2 = new Array();
          let band = new Array();
          let gforLimit = 100;
          let forLimit = 100;
          let sforLimit = 100;
          let tforLimit = 100;
          let wforLimit = 100;
          let bandforLimit = 100;
          if (vdata.GLUCOSE_LIST.length < gforLimit)
            gforLimit = vdata.GLUCOSE_LIST.length;
          if (vdata.PRESSURE_LIST.length < forLimit)
            forLimit = vdata.PRESSURE_LIST.length;
          if (vdata.SPO2_LIST.length < sforLimit)
            sforLimit = vdata.SPO2_LIST.length;
          if (vdata.TEMP_LIST.length < tforLimit)
            tforLimit = vdata.TEMP_LIST.length;
          if (vdata.WEIGHT_LIST.length < wforLimit)
            wforLimit = vdata.WEIGHT_LIST.length;
          if (vdata.BAND_LIST.length < bandforLimit)
            bandforLimit = vdata.BAND_LIST.length;

          for (let i = 0; i < gforLimit; i++) {
            let bsobj = new Object();

            bsobj = vdata.GLUCOSE_LIST[i];
            bsobj.CREATE_TIME = localVitalFormDate(
              vdata.GLUCOSE_LIST[i].CREATE_TIME
            );

            bsobj = JSON.stringify(bsobj);
            //String 형태로 파싱한 객체를 다시 json으로 변환
            if (bsobj !== undefined) {
              bs.push(JSON.parse(bsobj));
            }
          }

          for (let i = 0; i < forLimit; i++) {
            let bpobj = new Object();
            let jsonObj = new Object();

            bpobj = vdata.PRESSURE_LIST[i];
            bpobj.CREATE_TIME = localVitalFormDate(
              vdata.PRESSURE_LIST[i].CREATE_TIME
            );
            jsonObj.CREATE_TIME = vdata.PRESSURE_LIST[i].CREATE_TIME;

            jsonObj.PULSE_VAL = vdata.PRESSURE_LIST[i].PULSE_VAL;

            bpobj = JSON.stringify(bpobj);
            jsonObj = JSON.stringify(jsonObj);

            //String 형태로 파싱한 객체를 다시 json으로 변환
            if (bpobj !== undefined) {
              bp.push(JSON.parse(bpobj));
            }
            if (jsonObj !== undefined) {
              pulse.push(JSON.parse(jsonObj));
            }
          }

          for (let i = 0; i < sforLimit; i++) {
            let spo2obj = new Object();

            spo2obj = vdata.SPO2_LIST[i];
            spo2obj.CREATE_TIME = localVitalFormDate(
              vdata.SPO2_LIST[i].CREATE_TIME
            );

            spo2obj = JSON.stringify(spo2obj);

            //String 형태로 파싱한 객체를 다시 json으로 변환
            if (spo2obj !== undefined) {
              spo2.push(JSON.parse(spo2obj));
            }
          }

          for (let i = 0; i < tforLimit; i++) {
            let tempobj = new Object();

            tempobj = vdata.TEMP_LIST[i];
            tempobj.TEMP_VAL = convertWeight(
              vdata.TEMP_LIST[i].TEMP_VAL
            ).toFixed(2);
            tempobj.CREATE_TIME = localVitalFormDate(
              vdata.TEMP_LIST[i].CREATE_TIME
            );

            tempobj = JSON.stringify(tempobj);
            //String 형태로 파싱한 객체를 다시 json으로 변환
            if (tempobj !== undefined) {
              temp.push(JSON.parse(tempobj));
            }
          }

          for (let i = 0; i < wforLimit; i++) {
            let weobj = new Object();

            weobj = vdata.WEIGHT_LIST[i];
            weobj.WEIGHT_VAL = convertWeight(
              vdata.WEIGHT_LIST[i].WEIGHT_VAL
            ).toFixed(2);
            weobj.CREATE_TIME = localVitalFormDate(
              vdata.WEIGHT_LIST[i].CREATE_TIME
            );

            weobj = JSON.stringify(weobj);

            if (weobj !== undefined) {
              we.push(JSON.parse(weobj));
            }
          }

          for (let i = 0; i < bandforLimit; i++) {
            let bandobj = new Object();

            bandobj = vdata.BAND_LIST[i];
            bandobj.CREATE_TIME = localVitalFormDate(
              vdata.BAND_LIST[i].CREATE_TIME
            );

            bandobj = JSON.stringify(bandobj);

            if (bandobj !== undefined) {
              band.push(JSON.parse(bandobj));
            }
          }

          dispatch({
            type: "SEARCH_VITAL_DATA",
            BP: bp,
            PULSE: pulse,
            TEMP: temp,
            BS: bs,
            WE: we,
            SPO2: spo2,
            BAND: band,
          });
        }
      })
      .catch((err) => console.log(err));
  };
};

export const convertUnit = (id, length, weight, temp, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: id,
      unit_length: length,
      unit_weight: weight,
      unit_temp: temp,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .post("https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php", {
        url: `${SERVER_URL2}/doctor/account/measure-unit`,
        c_key: encryptedrsapkey,
        c_value: value,
        method: "PUT",
      })
      .then((response) => {
        let decryptedres = decryptByAES(response.data.data);
        // window.location.reload();
      })
      .catch((err) => console.log(err));
  };
};

export const getInitialData = () => {
  return async (dispatch) => {
    await axios.get("/api/datalist/initial-data").then((response) => {
      dispatch({ type: "GET_ALL_DATA", data: response.data });
    });
  };
};

export const filterData = (value) => {
  return (dispatch) => dispatch({ type: "FILTER_DATA", value });
};

export const deleteData = (obj) => {
  return (dispatch) => {
    axios
      .post("/api/datalist/delete-data", {
        obj,
      })
      .then((response) => {
        dispatch({ type: "DELETE_DATA", obj });
      });
  };
};

export const updateData = (obj) => {
  return (dispatch, getState) => {
    axios
      .post("/api/datalist/update-data", {
        obj,
      })
      .then((response) => {
        dispatch({ type: "UPDATE_DATA", obj });
      });
  };
};

export const addData = (obj) => {
  return (dispatch, getState) => {
    let params = getState().dataList.params;
    axios
      .post("/api/datalist/add-data", {
        obj,
      })
      .then((response) => {
        dispatch({ type: "ADD_DATA", obj });
        dispatch(getData(params));
      });
  };
};

export const goPCL = (patientid) => {
  return (dispatch) => {
    dispatch({
      type: "SAVE_PATIENTID",
      data: patientid,
    });
    history.push("/past-consult-list");
  };
};

export const mPCL = (patientid) => {
  return (dispatch) => {
    dispatch({
      type: "SAVE_PATIENTID",
      data: patientid,
    });
  };
};

export const getPastConulstList = (patientid, pageamount, pagenum, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      patient_id: patientid,
      page_amount: pageamount,
      page_num: pagenum,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/patient/consults`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let pcdata = decryptByAES(response.data.data);
        let totalPage = Math.ceil(pcdata.COUNT / 5);
        console.log("TOTAL : ", totalPage);

        if (response.data.status === "200") {
          console.log("과거진료리스트: ", response);

          dispatch({
            type: "GET_PAST_CONSULT_LIST",
            data: pcdata.COUSULT_LIST,
            totalpage: totalPage,
          });
        }
      })
      .catch((err) => console.log(err));
  };
};

export const getFaq = (pageamount, pagenum, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      search_text: "",
      page_amount: pageamount,
      page_num: pagenum,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/setting/faqs`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let faqdata = decryptByAES(response.data.data);
        let totalPage = Math.ceil(faqdata.COUNT / 5);
        if (response.data.status === "200") {
          dispatch({
            type: "GET_FAQ",
            data: faqdata.FAQ_LIST,
            totalPages: totalPage,
          });
        } else {
          alert("FAQ를 불러오지 못하였습니다.");
        }
      })
      .catch((err) => console.log(err));
  };
};

export const getNameFaqData = (pageamount, pagenum, fname, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      search_text: fname,
      page_amount: pageamount,
      page_num: pagenum,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/setting/faqs`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let faqdata = decryptByAES(response.data.data);
        let totalPage = Math.ceil(faqdata.COUNT / 5);
        if (response.data.status === "200") {
          dispatch({
            type: "GET_FAQ_NAME",
            data: faqdata.FAQ_LIST,
            totalPages: totalPage,
          });
        } else {
          alert(response.data.message);
        }
      })
      .catch((err) => console.log(err));
  };
};

export const getNotice = (pageamount, pagenum, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      page_amount: pageamount,
      page_num: pagenum,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/setting/notices`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let noticedata = decryptByAES(response.data.data);
        let totalPage = Math.ceil(noticedata.COUNT / 5);
        if (response.data.status === "200") {
          dispatch({
            type: "GET_NOTICE",
            data: noticedata.NOTICE_LIST,
            totalpage: totalPage,
          });
        } else {
          alert("FAQ를 불러오지 못하였습니다.");
        }
      })
      .catch((err) => console.log(err));
  };
};

export const getVitalSettingData = (userid, patientid) => {
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL_TEST}/doctor/vital/base-patient`, {
        params: {
          user_id: userid,
          patient_id: patientid,
        },
      })
      .then((response) => {
        if (response.data.status === "200" && response.data.data !== null) {
          let vdata = response.data.data;
          dispatch({
            type: "GET_VITALDATA_SETTING",
            data: vdata,
          });

          history.push("/vitaldatasetting");
        } else {
          alert("생체정보를 불러오지 못하였습니다.");
        }
      })

      .catch((err) => console.log(err));
  };
};

export const resetVitalData = () => {
  return (dispatch) => {
    dispatch({
      type: "RESET_VITAL_DATA",
      BP: [],
      PULSE: [],
      TEMP: [],
      BS: [],
      WE: [],
      SPO2: [],
      BAND: [],
    });
  };
};

export const resetappodata = () => {
  return (dispatch) => {
    dispatch({
      type: "RESET_APPO_DATA",
      appointment: "",
      rtime: "",
    });
  };
};

// 암호화
// export const getVitalSettingData = (userid, patientid, key) => {
//   let encryptedrsapkey = encryptByPubKey(key);
//   let value = AES256.encrypt(
//     JSON.stringify({
//       user_id: userid,
//       patient_id: patientid,
//     }),
//     AESKey
//   );
//   return async (dispatch) => {
//     await axios
//       .get(`${SERVER_URL}/doctor/vital/base-patient`, {
//         params: {
//           c_key: encryptedrsapkey,
//           c_value: value,
//         },
//       })
//       .then((response) => {
//         if (response.data.status === "200" && response.data.data !== null) {
//           let vdata = decryptByAES(response.data.data);
//           dispatch({
//             type: "GET_VITALDATA_SETTING",
//             data: vdata,
//           });

//           history.push("/vitaldatasetting");
//         } else {
//           alert("생체정보를 불러오지 못하였습니다.");
//         }
//       })

//       .catch((err) => console.log(err));
//   };
// };

export const postMDNoteData = (
  userid,
  apponum,
  cc,
  ros,
  dx,
  rx,
  notevital,
  key
) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      appoint_num: apponum,
      note_cc: cc,
      note_ros: ros,
      note_dx: dx,
      note_rx: rx,
      note_vital: notevital,
    }),
    AESKey
  );
  return (dispatch) => {
    axios
      .post("https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php", {
        url: `${SERVER_URL2}/doctor/treatment/md-note`,
        c_key: encryptedrsapkey,
        c_value: value,
        method: "POST",
      })
      .then((response) => {
        if (response.data.status === "200") {
        } else {
          alert("MD Note 저장에 문제가 발생했습니다.\n다시 시도해 주십시오");
        }
      })
      .catch((err) =>
        alert(
          err +
            "\n네트워크 문제로 진료노트 저장에 문제가 발생했습니다.\n다시 시도해 주십시오 "
        )
      );
  };
};

export const postPrescriptionData = (userid, apponum, filename, file) => {
  let frm = new FormData();
  frm.append("user_id", userid);
  frm.append("file_name", file);
  frm.append("appoint_num", apponum);
  console.log(frm);
  return (dispatch) => {
    axios
      .post(`${SERVER_URL_TEST}/doctor/treatment/prescription`, frm)

      .then((response) => {
        console.log(response);
        if (response.data.status === "200") {
          // alert("업로드가 완료되었습니다.");
        } else {
          // alert("처방전 업로드에 문제가 발생했습니다.\n다시 시도해 주십시오");
        }
      });
  };
};

// 암호화
// export const postPrescriptionData = (userid, apponum, filename, file) => {
//   let frm = new FormData();
//   frm.append("user_id", userid);
//   frm.append("file_name", file);
//   frm.append("appoint_num", apponum);
//   console.log(frm);
//   return (dispatch) => {
//     axios
//       .post(`${IMG_SERVER_URL}/doctor/treatment/prescription`, frm, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })

//       .then((response) => {
//         console.log(response);
//         if (response.data.status === "200") {
//           // alert("업로드가 완료되었습니다.");
//         } else {
//           // alert("처방전 업로드에 문제가 발생했습니다.\n다시 시도해 주십시오");
//         }
//       });
//     // .catch((err) =>
//     //   alert(
//     //     err +
//     //       "\n네트워크 문제로 처방전 업로드에 문제가 발생했습니다.\n다시 시도해 주십시오 "
//     //   )
//     // );
//   };
// };

export const postPayData = (userid, apponum, paypatient, paytotal, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      appoint_num: apponum,
      pay_patient: paypatient,
      pay_total: paytotal,
    }),
    AESKey
  );
  return (dispatch) => {
    axios
      .post("https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php", {
        url: `${SERVER_URL}/doctor/treatment/payment`,
        c_key: encryptedrsapkey,
        c_value: value,
        method: "POST",
      })
      .then((response) => {
        if (response.data.status === "200") {
          // alert("결제정보가 저장되었습니다.");
        } else {
          // alert("결제정보 저장에 문제가 발생했습니다.\n다시 시도해 주십시오");
        }
      });
    // .catch((err) =>
    //   alert(
    //     err +
    //       "\n네트워크 문제로 결제정보 저장에 문제가 발생했습니다.\n다시 시도해 주십시오 "
    //   )
    // );
  };
};

export const putStateComplete = (userid, apnum, apstate, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      appoint_num: apnum,
      appoint_state: apstate,
    }),
    AESKey
  );
  return (dispatch) => {
    axios
      .post("https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php", {
        url: `${SERVER_URL2}/doctor/treatment/treatment-state`,
        c_key: encryptedrsapkey,
        c_value: value,
        method: "PUT",
      })
      .then(sendMessage(userid, apnum, apstate, key))
      .catch((err) => console.log(err));
  };
};

export const sendMessage = (userid, apnum, apstate, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      appoint_num: apnum,
      appoint_state: apstate,
    }),
    AESKey
  );
  return (dispatch) => {
    axios
      .post("https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php", {
        url: `${SERVER_URL2}/doctor/treatment/send-message`,
        c_key: encryptedrsapkey,
        c_value: value,
        method: "PUT",
      })
      .then((response) => {
        // let messageres = decryptByAES(response.data.data);
        console.log("messageres: ", response);
      })
      .catch((err) => console.log(err));
  };
};

export const initPharmacy = () => {
  return async (dispatch) => {
    dispatch({
      type: "INIT_PHARMACY",
      data: "",
    });
  };
};

export const getPharmacy = (patientid, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      patient_id: patientid,
    }),
    AESKey
  );
  return async (dispatch) => {
    await axios
      .get(`${SERVER_URL2}/doctor/treatment/pharmacy`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })
      .then((response) => {
        let phdata = decryptByAES(response.data.data);

        dispatch({
          type: "GET_PHARMACY",
          data: phdata,
        });
      })

      .catch((err) => console.log(err));
  };
};

export const pushCloseSignal = (userid, appointnum, state, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      appoint_num: appointnum,
      state_doc: state,
    }),
    AESKey
  );
  return (dispatch) => {
    axios
      .post("https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php", {
        url: `${SERVER_URL2}/doctor/treatment/involve-state`,
        c_key: encryptedrsapkey,
        c_value: value,
        method: "PUT",
      })
      .then((response) => {
        console.log("화상진료상태", response);
      })
      .catch((err) => console.log(err));
  };
};

export const pushEndCloseSignal = (userid, appointnum, state, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      appoint_num: appointnum,
      state_doc: state,
    }),
    AESKey
  );
  return (dispatch) => {
    axios
      .post("https://teledoc.hicare.net:450/lv1/_api/api.aes.post.php", {
        url: `${SERVER_URL2}/doctor/treatment/involve-state`,
        c_key: encryptedrsapkey,
        c_value: value,
        method: "PUT",
      })
      .then((response) => {
        if (response.data !== undefined) {
          setTimeout(() => history.push("/analyticsDashboard"), 1000);
        }
      })
      .catch((err) => console.log(err));
  };
};
