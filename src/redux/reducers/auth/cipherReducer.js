export const cipher = (state = {}, action) => {
  switch (action.type) {
    case "SAVE_PUBLICKEY": {
      return { ...state, rsapublickey: action.payload };
    }

    default: {
      return state;
    }
  }
};
