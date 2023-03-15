/*eslint-disable*/

import axios from "axios";

const API_URL = "https://api.ez2archive.kr"

const getAndSetSongs = (key) => {
  axios
    .get(`${API_URL}rank/list/${key}/${selectedLevel}`)
    .then((res) => { return setList(res.data.data) })
    .catch((err) => { console.log(err) })
}
const UserService = {

}

export default UserService;