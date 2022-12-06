export const savelang = (lang) => {
  return (dispatch) => {
    dispatch({
      type: "SAVE_LANG",
      payload: {
        lang,
      },
    });
  };
};

export const saveRegister3 = (
  hospitalname,
  businessnumber,
  zipcode,
  address1,
  address2,
  phonenumber,
  accountname,
  bankname,
  accountnumber
) => {
  return (dispatch) => {
    dispatch({
      type: "SAVE_REGISTER3",
      payload: {
        hospitalname,
        businessnumber,
        zipcode,
        address1,
        address2,
        phonenumber,
        accountname,
        bankname,
        accountnumber,
      },
    });
  };
};

export const saveRegister4 = (
  medicalpart,
  medicalable,
  medicaldesc,
  medicalnum,
  userdesc,
  previewURL
) => {
  return (dispatch) => {
    dispatch({
      type: "SAVE_REGISTER4",
      payload: {
        medicalpart,
        medicalable,
        medicaldesc,
        medicalnum,
        userdesc,
        previewURL,
      },
    });
  };
};

export const cookieSchedules = (events) => {
  return (dispatch) => {
    console.log(events);
    dispatch({
      type: "SAVE_SCHDULES",
      payload: {
        events,
      },
    });
  };
};

export const saveMyinfo = (medicalpart, medicalable, medicaldesc, userdesc) => {
  return (dispatch) => {
    dispatch({
      type: "SAVE_MYINFO",
      payload: {
        medicalpart,
        medicalable,
        medicaldesc,
        userdesc,
      },
    });
  };
};

export const saveCookieConsult = (
  cc,
  diagnosis,
  txrx,
  recommendation,
  paytotal,
  paypatient
) => {
  return (dispatch) => {
    dispatch({
      type: "SAVE_CONSULT",
      payload: {
        cc,
        diagnosis,
        txrx,
        recommendation,
        paytotal,
        paypatient,
      },
    });
  };
};

export const saveImage = (filename) => {
  return (dispatch) => {
    dispatch({
      type: "SAVE_IMAGE",
      payload: {
        filename,
      },
    });
  };
};

export const resetCookie = () => {
  return (dispatch) => {
    dispatch({
      type: "RESET",
      payload: {},
    });
  };
};
