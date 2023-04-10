// export const API_URL = "https://api.ez2archive.kr"


export const API_URL = process.env.REACT_APP_NODE_ENV === 'development' ?
  "https://api.blueshell.cyou/v1" :
  "https://api.ez2archive.kr/v1"

export const AT = localStorage.getItem("accessToken")
// export const API_URL = ""