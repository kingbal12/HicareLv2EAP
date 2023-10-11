import axios from "axios";
import AES256 from "aes-everywhere";
import { SERVER_URL } from "../../../config";

const crypto = require("crypto");

// AES key 생성
export const AESKey = window.crypto
  .getRandomValues(new Uint32Array(1))
  .toString();

// 공개키 GET
export const getPublicKey = () => {
  return (dispatch) => {
    axios
      .get(`${SERVER_URL}/crypt/public-key`, {})
      .then((response) => {
        if (response.status === 200) {
          let publickey = response.data.data;
          console.log("publickey:", publickey);

          sessionStorage.setItem("pkey", publickey);
          dispatch({
            type: "SAVE_PUBLICKEY",
            payload: { publickey },
          });
        }
      })
      .catch((err) => console.log(err));
  };
};

//RSA 암호화
export const encryptByPubKey = (pubkey) => {
  return crypto
    .publicEncrypt(
      {
        key:
          "-----BEGIN PUBLIC KEY-----\n" +
          pubkey +
          "\n-----END PUBLIC KEY-----",
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(AESKey, "utf8")
    )
    .toString("base64");
};

//AES 복호화
export const decryptByAES = (data) => {
  let decrypted = AES256.decrypt(data, AESKey);
  return JSON.parse(decrypted);
};
