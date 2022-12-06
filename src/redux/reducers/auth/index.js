import { combineReducers } from "redux";
import { login } from "./loginReducer";
import { register } from "./registerReducers";
import { cipher } from "./cipherReducer";

const authReducers = combineReducers({
  login,
  register,
  cipher,
});

export default authReducers;
