import axios from "axios";
import { history } from "../../../history";
import AES256 from "aes-everywhere";
import { SERVER_URL2 } from "../../../config";
import { encryptByPubKey, decryptByAES, AESKey } from "../auth/cipherActions";

// Get Initial Emails
export const getappoints = (userid, startdate, pageamont, pagenum) => {
  return async (dispatch) => {
    console.log("api실행됨", userid, "리듀서 부분에서 문제가 생김");
    await axios
      .get("https://teledoc.hicare.net:446/v1/doctor/appointment/dashboard", {
        params: {
          user_id: userid,
          start_date: "20210101",
          page_amount: 5,
          page_num: 1,
        },
      })
      .then((response) => {
        let appoints;
        if (response.data.status === "200") {
          appoints = response.data.data;
          // console.log(response, "response")
          dispatch({
            type: "GET_APPOINTS",
            payload: {
              appointsdata: appoints,
            },
          });
        }
      })
      .catch((err) => console.log(err));
  };
};

export const getDayAppoints = () => {
  return async (dispatch) => {
    dispatch({
      type: "GET_DAY_APPOINTS",
      payload: "d",
    });
  };
};

export const getMonAppoints = () => {
  return async (dispatch) => {
    dispatch({
      type: "GET_MON_APPOINTS",
      payload: "m",
    });
  };
};

export const getKmedicineList = (userid, durgname, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      drug_name: durgname,
    }),
    AESKey
  );
  return (dispatch) => {
    axios
      .get(`${SERVER_URL2}/doctor/treatment/ko-drugs`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })

      .then((response) => {
        let kmedicinelist = decryptByAES(response.data.data);
        console.log(kmedicinelist);
        dispatch({
          type: "GET_KMEDLIST",
          data: kmedicinelist,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const getFdaDrugs = (userid, edicode, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      edi_code: edicode,
    }),
    AESKey
  );
  return (dispatch) => {
    axios
      .get(`${SERVER_URL2}/doctor/treatment/fda-drugs`, {
        params: {
          c_key: encryptedrsapkey,
          c_value: value,
        },
      })

      .then((response) => {
        let fdalist = decryptByAES(response.data.data);
        console.log(fdalist);
        dispatch({
          type: "GET_FDALIST",
          data: fdalist,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const putEtcOtc = (userid, apnum, fdacodes, fdatexts, key) => {
  let encryptedrsapkey = encryptByPubKey(key);
  let value = AES256.encrypt(
    JSON.stringify({
      user_id: userid,
      appoint_num: apnum,
      fda_codes: fdacodes,
      fda_texts: fdatexts,
    }),
    AESKey
  );
  return (dispatch) => {
    axios
      .post("https://health.iot4health.co.kr/lv1/_api/api.aes.post.php", {
        url: `${SERVER_URL2}/doctor/treatment/etc-otc`,
        c_key: encryptedrsapkey,
        c_value: value,
        method: "PUT",
      })
      .then((response) => {
        console.log("complete", response);
      });
  };
};
