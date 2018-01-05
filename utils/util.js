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
const formatDay = date => {
	return [date.split('T')[0].split('-')[1], date.split('T')[0].split('-')[2]].join('-');
}
module.exports = {
  formatTime: formatTime,
  formatDay: formatDay
}
