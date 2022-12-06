export const saveemail = (email) => {
  return dispatch => {
  
    dispatch({ type: "SAVE_EMAIL", payload: email })
  
   
  }
}

export const delemail = () => {
  return dispatch => {
    dispatch({ type: "DEL_EMAIL", payload: "" })
  }
}

