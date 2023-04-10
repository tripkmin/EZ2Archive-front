/*eslint-disable*/

export const keyCapsToNumKey = (keyCaps) => {
  switch (keyCaps) {
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
  switch (rank) {
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
  switch (dbGrade) {
    case "SPPP":
      return "S⁺⁺⁺"
    case "SPP":
      return "S⁺⁺"
    case "SP":
      return "S⁺"
    case "S":
      return "S"
    case "AP":
      return "A⁺"
    case "A":
      return "A"
    case "B":
      return "B"
    case "C":
      return "C"
    case "D":
      return "D"
    case "E":
      return "E"
    case "F":
      return "F"
    default: // nothing
  }
}

export const getPlayStatusClass = (songinfo) => {
  if (Object.keys(songinfo.userRecordData).length !== 0) {
    const {
      isAllCool,
      isNoMiss
    } = songinfo.userRecordData

    if (isAllCool) {
      return "all-cool"
    } else if (isNoMiss) {
      return "all-combo"
    } else {
      return "clear"
    }
  } else {
    return "no-play"
  }
}

export const getPlayStatusText = (songinfo) => {
  if (Object.keys(songinfo.userRecordData).length !== 0) {
    const {
      isAllCool,
      isNoMiss
    } = songinfo.userRecordData

    if (isAllCool) {
      return "All Cool"
    } else if (isNoMiss) {
      return "All Combo"
    } else {
      return "Played"
    }
  } else {
    return "Not Played"
  }
}


export const returnGrade = (grade) => {
  if (grade) {
    return grade
  } else if (grade === undefined) {
    return "none"
  }
}

export const formatPercent = (percent) => {
  const num = parseFloat(percent);

  if (isNaN(num)) {
    return "";
  }

  const numString = num.toString();
  const [intPart, decimalPart] = numString.split(".");

  if (decimalPart === "00") {
    return intPart;
  } else if (decimalPart?.charAt(1) === "0") {
    return intPart + "." + decimalPart?.charAt(0);
  } else {
    return numString;
  }
}

export const renamed = name => name.toLowerCase().replace(/ /g, "").replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/g, "");