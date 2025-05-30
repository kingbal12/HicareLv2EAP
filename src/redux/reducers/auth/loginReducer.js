export const login = (state = { userRole: "admin", email: "" }, action) => {
  switch (action.type) {
    // 로그인 리듀서 부분
    case "LOGIN_WITH_JWT": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_EMAIL": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_FB": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_TWITTER": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_GOOGLE": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_GITHUB": {
      return { ...state, values: action.payload }
    }
    
    case "LOGOUT_WITH_JWT": {
      return { ...state, values: action.payload}
    }
    case "LOGOUT_WITH_FIREBASE": {
      return { ...state, values: action.payload}
    }
    case "CHANGE_ROLE": {
      return { ...state, userRole: action.userRole }
    }
    default: {
      return state
    }
  }
}
