export const cookiesReducer = (
  state = {
    userRole: "admin",
    lang: "ko",
    email: "",
    register3: {
      hospitalname: "",
      businessnumber: "",
      zipcode: "",
      address1: "",
      address2: "",
      phonenumber: "",
      accountname: "",
      bankname: "",
      accountnumber: "",
    },
    register4: {
      medicalpart: "01",
      medicalable: "",
      medicaldesc: "",
      medicalnum: "",
      userdesc: "",
      previewURL: "",
    },
    myinfo: {
      medicalpart: "01",
      medicalable: "",
      medicaldesc: "",
      userdesc: "",
    },
    consult: {
      cc: "",
      diagnosis: "",
      txrx: "",
      recommendation: "",
      paytotal: "",
      paypatient: "",
    },
    filename: "",
    events: [],
  },
  action
) => {
  switch (action.type) {
    case "SAVE_LANG": {
      return { ...state, lang: action.payload };
    }
    case "SAVE_EMAIL": {
      return { ...state, email: action.payload };
    }
    case "DEL_EMAIL": {
      return { ...state, email: action.payload };
    }
    case "SAVE_REGISTER3": {
      return { ...state, register3: action.payload };
    }
    case "SAVE_REGISTER4": {
      return { ...state, register4: action.payload };
    }
    case "SAVE_SCHDULES": {
      return { ...state, events: action.payload };
    }
    case "SAVE_MYINFO": {
      return { ...state, myinfo: action.payload };
    }
    case "SAVE_CONSULT": {
      return { ...state, consult: action.payload };
    }
    case "SAVE_IMAGE": {
      return { ...state, filename: action.payload };
    }
    case "LOGIN_WITH_JWT": {
      return {
        ...state,
        myinfo: {
          medicalpart: "01",
          medicalable: "",
          medicaldesc: "",
          userdesc: "",
        },
        consult: {
          cc: "",
          diagnosis: "",
          txrx: "",
          recommendation: "",
          paytotal: "",
          paypatient: "",
        },
        filename: "",
      };
    }

    case "RESET": {
      return {
        ...state,
        register3: {
          hospitalname: "",
          businessnumber: "",
          zipcode: "",
          address1: "",
          address2: "",
          phonenumber: "",
          accountname: "",
          bankname: "",
          accountnumber: "",
        },
        register4: {
          medicalpart: "01",
          medicalable: "",
          medicaldesc: "",
          medicalnum: "",
          userdesc: "",
          previewURL: "",
        },
      };
    }
    default: {
      return state;
    }
  }
};
