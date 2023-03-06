/*eslint-disable*/
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setRankCleanKeyAndDifficulty, cleanClass } from "./../../store"

const PleaseSelectRank = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(cleanClass())
    dispatch(setRankCleanKeyAndDifficulty())
  }, [])
  
  return (
    <div className="pleaseSelectBox">
      <img src={process.env.PUBLIC_URL + '/source/pleaseSelect.png'} alt="PleaseSelect"></img>
      <h3>키와 난이도를 선택해주세요!</h3>
      <h5>설마 누가 8키를 하겠어</h5>
    </div>
  )
}

export default PleaseSelectRank