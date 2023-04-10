/*eslint-disable*/

import { useDispatch } from "react-redux";
import { setModalDefault } from "../../store";

const EmailSent = () => {
  const dispatch = useDispatch()

  return (
    <div className="sign-complete">
      <h3 className="theme-pp">이메일을 확인해주세요.</h3>
      <span>입력하신 주소로 인증 요청 메일을 보냈습니다.<br/>혹시 이메일이 오지 않았다면 스팸함을 확인해보세요.</span>
        <button onClick={()=>{dispatch(setModalDefault())}}>닫기</button>
    </div>
  )
}

export default EmailSent