const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}

//补零
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  } return i;
}

function updateTime(oDateEnd) {
  var pastDate = new Date(oDateEnd)
  var oDateNow = new Date();
  var iRemain = 0;
  var iDay = 0;
  var iHour = 0;
  var iMin = 0;
  var iSec = 0;
  var iMs = 0;
  iRemain = (pastDate.getTime() - oDateNow.getTime());
  if (iRemain <= 0) {
    //iRemain = 0;
    return 0;
  }
  iDay = parseInt(iRemain / 86400000);
  iRemain %= 86400000;
  iHour = parseInt(iRemain / 3600000);
  iRemain %= 3600000;
  iMin = parseInt(iRemain / 60000);
  iRemain %= 60000;
  iSec = parseInt(iRemain/1000);
  iRemain %= 1000;
  iMs = parseInt(iRemain)

  //return addZero(iDay) + "天" + addZero(iHour) + ":" + addZero(iMin) + ":" + addZero(iSec);
  return { 'iDay': iDay, 'iHour': addZero(iHour), 'iMin': addZero(iMin), "iSec": addZero(iSec), "iMs": addZero(iMs)}
}

module.exports = {
  formatTime: formatTime,
  randomNum: randomNum,
  updateTime: updateTime
}
