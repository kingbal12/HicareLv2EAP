const initialState = {
  COUNT_DAY: 0,
  COUNT_MON: 0,
  APPOINT_LIST: [],
  startend: "d",
};

const appoints = (state = initialState, action) => {
  switch (action.type) {
    case "GET_APPOINTS":
      return { ...state, appoints: action.payload };

    case "GET_DAY_APPOINTS":
      return { ...state, startend: action.payload };

    case "GET_MON_APPOINTS":
      return { ...state, startend: action.payload };

    default:
      return { ...state };
  }
};
export default appoints;
