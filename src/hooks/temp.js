import axios from "axios";

const identify = () => {
  const AT = localStorage.getItem("accessToken");
    axios
      .get('https://api.ez2archive.kr/members/myInfo' , {
        headers: {
          Authorization: `Bearer ${AT}`
        }
      })
      .then((res) => {
        dispatch(setUserName(res.data.data.name))
        dispatch(setUserId(res.data.data.userId))
        dispatch(setUserAuth(res.data.data.authority))
        dispatch(setUserAddTime(res.data.data.addTime))
      })
      
}