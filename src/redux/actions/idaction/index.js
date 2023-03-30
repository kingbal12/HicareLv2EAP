export const saveemail = (email) => {
  return (dispatch) => {
    localStorage.setItem("EMAIL_ID", email);
  };
};

export const delemail = (email) => {
  return (dispatch) => {
    localStorage.setItem("EMAIL_ID", email);
  };
};
