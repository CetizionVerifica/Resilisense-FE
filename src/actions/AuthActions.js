import axios from "axios";
//import {BrowserRouter} from 'react-router-dom'
import { message } from "antd";
import { localeSwitch } from "../actions";
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_USER,
  AUTH_MSG,
} from "./types";

export const signinUser = ({ email, password }) => {
  return function (dispatch) {
    axios
      .post("/api/signin", { email, password })
      .then((response) => {
        console.log("response", response);
        localStorage.setItem("token", response.data.token); // eslint-disable-line
        dispatch({ type: AUTH_USER });
      })
      .catch(() => {
        message.error("bad login info");
        dispatch(authError("bad login info"));
      });
  };
};

export function signupUser(fields) {
  return function (dispatch) {
    //submit email/password to the server
    axios
      .post("/api/signup", fields)
      .then((response) => {
        // if request is good..
        //-update state to indicate it authenticated
        //dispatch({type: AUTH_USER})
        //-save the jwt token
        //localStorage.setItem('token', response.data.token) // eslint-disable-line
        //-redirect to the route '/fdashboard'
        // BrowserRouter.push('/')
        dispatch({ type: AUTH_MSG, payload: true });
      })
      .catch((response) => {
        //console.log(response)
        //if request is bad..
        //show an error to the user
        //dispatch(authError(response.data.error))
        message.error("Your email address is already registered.");
      });
  };
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error,
  };
}
export function signoutUser() {
  localStorage.removeItem("token"); // eslint-disable-line
  // refresh window
  // window.location.reload(true);
  // localStorage.clear();
  // window.location.reload();
  // location.reload(true);
  // console.log
  window.location.href = "/signin";
  return { type: UNAUTH_USER };
}

export const fetchUser = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  // axios.get('/api/current_user', {
  //   headers: {authorization: localStorage.getItem('token')}, // eslint-disable-line
  // }).then(({data}) => {
  // if (data) {
  //   dispatch({type: FETCH_USER, payload: data})
  //   dispatch(localeSwitch(data.lang))
  // } else {
  //   signoutUser()
  // }
  // }).catch(() => {
  //   signoutUser()
  // })
  try {
    const result = await axios.get("/api/current_user", {
      headers: { authorization: token }, // eslint-disable-line
    });
    if (result) {
      const { data } = result;
      if (data) {
        dispatch({ type: FETCH_USER, payload: data });
        dispatch(localeSwitch(data.lang));
      } else {
        signoutUser();
      }
    }
  } catch (error) {
    signoutUser();
  }
};
