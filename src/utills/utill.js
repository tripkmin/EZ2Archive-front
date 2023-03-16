
export const keyCapsToNumKey = (keyCaps) => {
  switch(keyCaps){
    case 'FOUR':
      return '4K';
    case 'FIVE':
      return '5K';
    case 'SIX':
      return '6K';
    case 'EIGHT':
      return '8K';
    default: 
      // nothing
  }
}

export const rankFilter = (rank) => {
  switch(rank){
    case 0:
    case 1:
      return '하';
    case 2:
    case 3:
      return '중하';
    case 4:
    case 5:
      return '중상';
    case 6:
    case 7:
      return '상';
    case 8:
    case 9:
      return '최상';
    case -99:
      return '-';
    default: 
      // nothing
  }
}

export const gradeConvert = (dbGrade) => {
  switch(dbGrade){
    case "SPPP" : return "S⁺⁺⁺"
    case "SPP" : return "S⁺⁺"
    case "SP" : return "S⁺"
    case "S" : return "S"
    case "AP" : return "A⁺"
    case "A" : return "A"
    case "B" : return "B"
    case "C" : return "C"
    case "D" : return "D"
    case "E" : return "E"
    case "F" : return "F"
    default: // nothing
  }
}

export const getPlayStatusClass = (songinfo) => {
  const { isAllCool, isNoMiss } = songinfo
  if (isAllCool) { return "all-cool" }
  else if (isNoMiss) { return "all-combo" }
  else if (isPlayed(songinfo)) { return "clear" }
  else { return "no-play" }
}

export const isPlayed = (songinfo) => {
  const { score, percentage, id, grade } = songinfo
  if (percentage > 0 && id > 0 && score > 0 && grade){ return true }
  else { return false }
}
