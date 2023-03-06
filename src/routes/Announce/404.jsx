/*eslint-disable*/

const NotFound = () => {
  return (
    <div className="notfound">
      <img src={process.env.PUBLIC_URL + '/source/notFound.png'} alt="PleaseSelect"></img>
      <h3>404 Not Found</h3>
      <h5>순순히 뒤로가기를 눌러봅시다</h5>
    </div>
  )
}

export default NotFound;