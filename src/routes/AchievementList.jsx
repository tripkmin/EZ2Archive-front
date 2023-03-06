/*eslint-disable*/

const AchievementList = () => {

  return (
    <>
      <div className="pleaseWait">
        <p><strong>5, 6, 8키</strong>의 <strong>레벨 16</strong>곡들은 서열 투표를 진행할 예정입니다.</p>
      </div>
      <div className="rank-orderlist-wrapper">
        <div className="header">
          <h1 className="theme-pp">{props.selectedKey.toUpperCase()} </h1>
          <h1>{selectedDifficulty}</h1>
        </div>
        {/* Songs 클래스 네임 변경할것 */}
        <div className="flex-grow-1">
        {/* 서열 9부터 0까지 내림차순으로 반환함 */}
        {
          levelIndex.map((detailDifficulty, index) => { 
            const copylist = [...list]
            // 서열값이 있는지 확인하고 있으면 JSX 출력, 없으면 null 뱉기
            return list.filter(songlist => songlist.rank === detailDifficulty[0] || songlist.rank === detailDifficulty[1]).length !== 0
            ? <div className="order-box" key={index}>
                <span className="order-grade">{detailDifficultyFilter(detailDifficulty[0])}</span>
                <div className='order-list'>
                {/* 특정 서열(ex:19.최상 → 19.9과 19.8)에 해당하는 곡명과 이미지들 전부 출력 */}
                {/* 오름차순이 켜져있으면 난이도(EZ,NM,HD,SHD) > 이름 순으로 정렬해서 표시하도록 할 것. 내림차순이면 (SHD,HD,NM,EZ)*/}
                {
                  copylist.filter(songlist => songlist.rank === detailDifficulty[0] || songlist.rank === detailDifficulty[1]).sort((a,b)=>{
                    const x = a.difficulty;
                    const y = b.difficulty;
                    //내림차순이면 난이도 정렬 역시 내림차순으로 (SHD → EZ), 오름차순이면 (EZ → SHD)순으로 정렬.
                    if(state.rankUserSelected.isDescending === true){
                      // SHD 정렬 먼저
                      if (x.length < y.length) return 1;
                      if (x.length > y.length) return -1;
                      // 그다음 EZ, NM, HD의 뒷 글자(Z, M, D)를 가지고 정렬
                      if (x.slice(x.length-1, x.length) > y.slice(y.length-1, y.length)) return 1;
                      if (x.slice(x.length-1, x.length) < y.slice(y.length-1, y.length)) return -1;
                    } else {
                      // SHD 정렬 먼저
                      if (x.length > y.length) return 1;
                      if (x.length < y.length) return -1;
                      // 그다음 EZ, NM, HD의 뒷 글자(Z, M, D)를 가지고 정렬
                      if (x.slice(x.length-1, x.length) < y.slice(y.length-1, y.length)) return 1;
                      if (x.slice(x.length-1, x.length) > y.slice(y.length-1, y.length)) return -1;
                    }
                  }).map((filteredElement, index)=>{
                    const renamed = filteredElement.name.toLowerCase().replace(/ /g, "").replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/g, "");
                    return (
                      <div className="song-wrapper" key={index}>
                        <div className="song-infobox">
                          <div className="imgbox no-drag">
                            <img src={process.env.PUBLIC_URL + '/musicdisk/'+ renamed + '.webp'} alt={filteredElement.name} onError={handleImgError}></img>
                            <div className="shadowbox"></div>
                            <span className={`level-badge ${filteredElement.difficulty}`}>{filteredElement.difficulty}</span>
                          </div>
                          <div className="testing no-drag">
                            <div className="testing-contents">
                            {
                              filteredElement.name.length > 13
                              ? 
                                <div className="testing-title" style={{width:`${filteredElement.name.length*30}px`}}>
                                  <h5 className="width-50">{filteredElement.name}</h5>
                                  <h5 className="width-50">{filteredElement.name}</h5>
                                </div>
                              : 
                                <div className="testing-title">
                                  <h5 className="animation-paused">{filteredElement.name}</h5>
                                </div>
                            }
                            {
                              filteredElement.artist.length > 24
                              ? <div className="testing-artist" style={{width:`${filteredElement.artist.length*20}px`}}>
                                  <span className="width-50">{filteredElement.artist}</span>
                                  <span className="width-50">{filteredElement.artist}</span>
                                </div>
                              : <div className="testing-artist">
                                  <span className="animation-paused">{filteredElement.artist}</span>
                                </div>
                            }
                              <table>
                                <tbody>
                                  <tr>
                                    <td>NOTES</td>
                                    <td>{filteredElement.totalNote}</td>
                                  </tr>
                                  <tr>
                                    <td>BPM</td>
                                    <td>{filteredElement.bpm}</td>
                                  </tr>
                                  <tr>
                                    <td>CATEGORY</td>
                                    <td>{filteredElement.category}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          {
                            state.rankUserSelected.songTitleView === true
                            ? <p className="song-title">{filteredElement.name} </p> 
                            : null
                          }
                        </div>
                      </div>
                      )
                  })
                }
                </div>
              </div>
            : null
          })
        }
        </div>
      </div>
    </>
  )
}

export default AchievementList