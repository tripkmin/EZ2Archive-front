/*eslint-disable*/

const NotFound = () => {
  return (
    <div className="notfound">
      <img src={process.env.PUBLIC_URL + '/source/notFound.png'} alt="PleaseSelect"></img>
      <h3>404 NOT FOUND</h3>
      <h5>해당 리소스를 찾을 수 없습니다</h5>
    </div>
  );
};

export default NotFound;
