const initialState = {
  tokbox: { APPOINT_NUM: 0, TOK_KEY: "", TOK_SESSION: "", TOK_TOKEN: "" },
  noticedata: [],
  noticetotalPages: 0,
  faqdata: [],
  faqtotalPages: 0,
  countsmon: {},
  paydata: [],
  paytotalPages: 0,
  totalpay: 0,
  totalpaydata: [],
  apdata: [],
  aptotalPages: 0,
  data: [],
  params: null,
  allData: [],
  totalPages: 0,
  filteredData: [],
  totalRecords: 0,
  sortIndex: [],
  csdata: [],
  secondlist: [],
  patient: "",
  appointment: "",
  rtime: "",
  topappotime: "",
  BP: [],
  PULSE: [],
  TEMP: [],
  BS: [],
  WE: [],
  SPO2: [],
  BAND: [],
  pastconsulttotal: 0,
  pastconsultlist: [],
  vitaldata: "",
  pharmacy: "",
  history: [],
  pid: "",
  searchName: "",
};

const determinePopularity = (val) => {
  if (val >= 75) return { popValue: val, color: "success" };
  else if (val < 75 && val >= 55) return { popValue: val, color: "primary" };
  else if (val < 55 && val >= 35) return { popValue: val, color: "warning" };
  else if (val < 35 && val >= 0) return { popValue: val, color: "danger" };
  else return { popValue: 0, color: "danger" };
};

const moveIndex = (arr, from, to) => {
  let el = arr[from];
  arr.splice(from, 1);
  arr.splice(to, 0, el);
};

const getIndex = (arr, arr2, arr3, params = {}) => {
  if (arr2.length > 0) {
    let startIndex = arr.findIndex((i) => i.id === arr2[0].id) + 1;
    let endIndex = arr.findIndex((i) => i.id === arr2[arr2.length - 1].id) + 1;
    let finalArr = [startIndex, endIndex];
    return (arr3 = finalArr);
  } else {
    let finalArr = [arr.length - parseInt(params.perPage), arr.length];
    return (arr3 = finalArr);
  }
};

const DataListReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RESET_PATIENT_INFO":
      return {
        ...state,
        patient: "",
      };

    case "GET_TOKBOX":
      return {
        ...state,
        tokbox: action.data,
      };
    case "SAVE_PATIENTID":
      return {
        ...state,
        pid: action.data,
      };
    case "GET_FAQ":
      return {
        ...state,
        faqdata: action.data,
        faqtotalPages: action.totalPages,
        params: action.params,
        sortIndex: getIndex(
          state.allData,
          action.data,
          state.sortIndex,
          action.params
        ),
      };
    case "GET_FAQ_NAME":
      return {
        ...state,
        faqdata: action.data,
        faqtotalPages: action.totalPages,
        params: action.params,
        sortIndex: getIndex(
          state.allData,
          action.data,
          state.sortIndex,
          action.params
        ),
      };
    case "GET_NOTICE":
      return {
        ...state,
        noticedata: action.data,
        noticetotalPages: action.totalpage,
        params: action.params,
        sortIndex: getIndex(
          state.allData,
          action.data,
          state.sortIndex,
          action.params
        ),
      };
    case "GET_PAYMENT_TOTAL_DATA":
      return {
        ...state,
        totalpay: action.totalPay,
        totalpaydata: action.totalpaydata,
      };
    case "GET_PAYMENT_DATA":
      return {
        ...state,
        paydata: action.data.PAY_LIST,
        countsmon: action.data.COUNTS_MON,
        paytotalPages: action.totalPages,
        params: action.params,
        sortIndex: getIndex(
          state.allData,
          action.data,
          state.sortIndex,
          action.params
        ),
      };
    case "GET_APPOINT_DATA":
      return {
        ...state,
        apdata: action.data,
        aptotalPages: action.totalPages,
        params: action.params,
        sortIndex: getIndex(
          state.allData,
          action.data,
          state.sortIndex,
          action.params
        ),
      };
    case "RESET_APPOINT_DATA":
      return {
        ...state,
        apdata: action.data,
        aptotalPages: action.totalPages,
        params: action.params,
        sortIndex: getIndex(
          state.allData,
          action.data,
          state.sortIndex,
          action.params
        ),
      };
    case "GET_DATA":
      return {
        ...state,
        data: action.data,
        totalPages: action.totalPages,
        params: action.params,
        sortIndex: getIndex(
          state.allData,
          action.data,
          state.sortIndex,
          action.params
        ),
      };
    case "GET_NAME_DATA":
      return {
        ...state,
        data: action.data,
        totalPages: action.totalPages,
        params: action.params,
        sortIndex: getIndex(
          state.allData,
          action.data,
          state.sortIndex,
          action.params
        ),
        searchName: action.searchName,
      };
    case "RESET_NAME_DATA":
      return {
        ...state,
        searchName: action.searchName,
      };
    case "RESET_PAST_DATA":
      return {
        ...state,
        csdata: action.list,
      };

    case "RESET_APPOINTMENT_DATA":
      return {
        ...state,
        appointment: "",
      };
    case "GET_PATIENT_INFO":
      return {
        ...state,
        csdata: action.list,
        patient: action.info,
        appointment: action.appointment,
        rtime: action.rtime,
        topappotime: action.topappotime,
        secondlist: action.secondlist,
      };

    case "GET_VITAL_DATA":
      return {
        ...state,
        BP: action.BP,
        PULSE: action.PULSE,
        TEMP: action.TEMP,
        BS: action.BS,
        WE: action.WE,
        SPO2: action.SPO2,
        BAND: action.BAND,
      };

    case "RESET_VITAL_DATA":
      return {
        ...state,
        BP: action.BP,
        PULSE: action.PULSE,
        TEMP: action.TEMP,
        BS: action.BS,
        WE: action.WE,
        SPO2: action.SPO2,
        BAND: action.BAND,
      };

    case "RESET_APPO_DATA":
      return {
        ...state,
      };
    case "GET_VITAL_DATA_ALL":
      return {
        ...state,
        BP: action.BP,
        PULSE: action.PULSE,
        TEMP: action.TEMP,
        BS: action.BS,
        WE: action.WE,
        SPO2: action.SPO2,
        BAND: action.BAND,
      };
    case "SEARCH_VITAL_DATA":
      return {
        ...state,
        BP: action.BP,
        PULSE: action.PULSE,
        TEMP: action.TEMP,
        BS: action.BS,
        WE: action.WE,
        SPO2: action.SPO2,
        BAND: action.BAND,
      };
    case "GET_VITALDATA_SETTING":
      return {
        ...state,
        vitaldata: action.data,
      };
    case "INIT_PHARMACY":
      return {
        ...state,
        pharmacy: action.data,
      };
    case "GET_PHARMACY":
      return {
        ...state,
        pharmacy: action.data,
      };
    case "GET_ALL_DATA":
      return {
        ...state,
        allData: action.data,
        totalRecords: action.data.length,
        sortIndex: getIndex(action.data, state.data, state.sortIndex),
      };
    case "FILTER_DATA":
      let value = action.value;
      let filteredData = [];
      if (value.length) {
        filteredData = state.allData
          .filter((item) => {
            // let startsWithCondition =
            //   item.name.toLowerCase().startsWith(value.toLowerCase()) ||
            //   item.category.toLowerCase().startsWith(value.toLowerCase()) ||
            //   item.price.toLowerCase().startsWith(value.toLowerCase()) ||
            //   item.order_status.toLowerCase().startsWith(value.toLowerCase())

            // let includesCondition =
            //   item.name.toLowerCase().includes(value.toLowerCase()) ||
            //   item.category.toLowerCase().includes(value.toLowerCase()) ||
            //   item.price.toLowerCase().includes(value.toLowerCase()) ||
            //   item.order_status.toLowerCase().includes(value.toLowerCase())

            let startsWithCondition =
              item.APPOINT_TIME.toLowerCase().startsWith(value.toLowerCase()) ||
              item.F_NAME.toLowerCase().startsWith(value.toLowerCase()) ||
              item.GENDER.toLowerCase().startsWith(value.toLowerCase()) ||
              item.AGE.toLowerCase().startsWith(value.toLowerCase()) ||
              item.BIRTH_DT.toLowerCase().startsWith(value.toLowerCase()) ||
              item.NOTE_DX.toLowerCase().startsWith(value.toLowerCase()) ||
              item.FIRST_YN.toLowerCase().startsWith(value.toLowerCase()) ||
              item.SYMPTOM.toLowerCase().startsWith(value.toLowerCase()) ||
              item.ratings.toLowerCase().startsWith(value.toLowerCase());

            let includesCondition =
              item.APPOINT_TIME.toLowerCase().startsWith(value.toLowerCase()) ||
              item.F_NAME.toLowerCase().startsWith(value.toLowerCase()) ||
              item.GENDER.toLowerCase().startsWith(value.toLowerCase()) ||
              item.AGE.toLowerCase().startsWith(value.toLowerCase()) ||
              item.BIRTH_DT.toLowerCase().startsWith(value.toLowerCase()) ||
              item.NOTE_DX.toLowerCase().startsWith(value.toLowerCase()) ||
              item.FIRST_YN.toLowerCase().startsWith(value.toLowerCase()) ||
              item.SYMPTOM.toLowerCase().startsWith(value.toLowerCase()) ||
              item.ratings.toLowerCase().startsWith(value.toLowerCase());

            if (startsWithCondition) {
              return startsWithCondition;
            } else if (!startsWithCondition && includesCondition) {
              return includesCondition;
            } else return null;
          })
          .slice(state.params.page - 1, state.params.perPage);
        return { ...state, filteredData };
      } else {
        filteredData = state.data;
        return { ...state, filteredData };
      }
    case "ADD_DATA":
      let id = state.data.slice(-1)[0].id + 1;
      state.data.push({
        ...action.obj,
        id,
        popularity: determinePopularity(action.obj.popularity),
      });
      moveIndex(
        state.data,
        state.data.findIndex((item) => item.id === id),
        0
      );
      return {
        ...state,
        data: state.data,
        totalRecords: state.allData.length,
        sortIndex: getIndex(state.allData, state.data, state.sortIndex),
      };
    case "UPDATE_DATA":
      state.data.find((item) => {
        if (item.id === action.obj.id) {
          let popularity = determinePopularity(action.obj.popularity.popValue);
          return Object.assign(item, { ...action.obj, popularity });
        } else {
          return item;
        }
      });
      return { ...state };
    case "DELETE_DATA":
      let index = state.data.findIndex((item) => item.id === action.obj.id);
      let updatedData = [...state.data];
      updatedData.splice(index, 1);
      return {
        ...state,
        data: updatedData,
        totalRecords: state.allData.length,
        sortIndex: getIndex(
          state.allData,
          state.data,
          state.sortIndex,
          state.params
        ),
      };
    case "GET_PAST_CONSULT_LIST":
      return {
        ...state,
        pastconsultlist: action.data,
        pastconsulttotal: action.totalpage,
      };
    default:
      return state;
  }
};

export default DataListReducer;
