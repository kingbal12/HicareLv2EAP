export const register = (state = {}, action) => {
  switch (action.type) {
    case "SET_TERMS": {
      return { ...state, terms: action.payload }
    }
    case "SIGNUP_WITH_EMAIL": {
      return { ...state, values: action.payload }
    }
    case "SIGNUP_WITH_JWT":
      return {
        ...state,
        values: action.payload
      }
    case "REGISTER_USER":
        return {
          ...state,
          values: action.payload
        }
    case "REGISTER_PHONE":
      return {
        ...state,
        values: action.payload
      }
    case "VERIFY_EMAIL": {
      return { ...state, verify: action.payload }
    }
    case "REGISTER4_STATUS": {
      return { ...state, register4: action.payload}
    }
    case "MYINFO_STATUS": {
        return { ...state, myinfoval: action.payload}
    }
    default: {
      return state
    }
  }
}
