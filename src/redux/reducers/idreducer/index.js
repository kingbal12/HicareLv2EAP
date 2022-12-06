export const idReducer = (
  state = { userRole: "admin", 
  email: "",
 }, action) => {
  switch (action.type) {
    case "SAVE_EMAIL": {
      return { ...state, email: action.payload }
    }
    case "DEL_EMAIL": {
      return { ...state, email: action.payload }
    }
    default: {
      return state
    }
  }
}
