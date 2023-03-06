/*eslint-disable*/

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUserName, setUserId, setUserAuth, setUserAddTime } from "../store";

const API_URL = "https://api.ez2archive.kr"
// const state = useSelector( (state) => state )

// const login = () => {
//   axios.post(`${API_URL}/login`, {
//     "password": password,
//     "userId": id
//   }, {
//     withCredentials: true
//   })
// }

// const identify = () => {
//   const dispatch = useDispatch()
//   const AT = localStorage.getItem("accessToken");
//     axios
//       .get(`${API_URL}/myInfo` , {
//         headers: {
//           Authorization: `Bearer ${AT}`
//         }
//       })
//       .then((res) => {
//         dispatch(setUserName(res.data.data.name))
//         dispatch(setUserId(res.data.data.userId))
//         dispatch(setUserAuth(res.data.data.authority))
//         dispatch(setUserAddTime(res.data.data.addTime))
//       })
// }

const idCheck = (e) => {
  axios
    .get(`${API_URL}/idCheck?userId=${e.target.value}`)
}

const emailCheck = (e) => {
  axios
    .get(`${API_URL}/emailCheck?email=${e.target.value}`)
}

const AuthService = {
  // login,
  // identify,
  idCheck,
  emailCheck
}

export default AuthService;