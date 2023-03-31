/*eslint-disable*/

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const PleaseSelectAchievement = () => {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const { userName, userId, userAuth, userAddTime } = state.userinfo

  useEffect(() => {
    console.log('선택안내문')
  }, [])

  const checkUserInformation = (userName, userId, userAuth, userAddTime) => {
    if (userName && userId && userAuth && userAddTime) {
      return true
    } else {
      return false
    }
  }
  return (
    <div className="pleaseSelectBox">
      {checkUserInformation(userName, userId, userAuth, userAddTime) ? (
        <>
          <img
            src={process.env.PUBLIC_URL + '/source/pleaseSelectA.png'}
            alt="PleaseSelectAchievement"
          ></img>
          <h3>키와 난이도를 선택해주세요!</h3>
        </>
      ) : (
        <>
          <img
            src={process.env.PUBLIC_URL + '/source/pleaseLogin.png'}
            alt="PleaseSelectAchievement"
          ></img>
          <h3>로그인이 필요합니다!</h3>
          <h5>좋은 말할 때 로그인하십쇼</h5>
        </>
      )}
    </div>
  )
}

export default PleaseSelectAchievement
