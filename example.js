// 单例模式, 时间戳只能在request时传入,
const fs = require('fs')

const SDK = require('./index')
function createTimestamp () {
  const date = new Date()
  const yyyy = String(date.getFullYear())
  const MM = String(date.getMonth() + 1).padStart(2, '0') // number
  const DD = String(date.getDate()).padStart(2, '0')
  const HH = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return yyyy + MM + DD + HH + mm + ss
}

const instance = new SDK({
  showapi_appid: '',
  secret: '',
  showapi_timestamp: createTimestamp()
})

// const instance = s
const stream = fs.createReadStream('./static/xxx.png')
console.log('createReadStream', Buffer.isBuffer(stream))
const file = fs.readFileSync('./static/xxx.png')
console.log('file', Buffer.isBuffer(file))
const base64 = instance.filePathToBase64('./static/xxx.png')

instance.request({
  url: 'https://route.showapi.com/887-2',
  method: 'post',
  data: {
    img: instance.markupFile(fs.readFileSync('./static/xxx.png'))
  }

}).then(res => {
  console.log('resData', res.status, JSON.stringify(res.data))
  console.log('resConfig', res.status, res.config)
}).catch(error => {
  console.log(error)
  if (error.response) {
    console.log('Error-Staus', error.response.status)
    // console.log('Error-Data', error.response.data)
  } else if (error.request) {
    console.log('error.request', error.request)
  } else {
    console.log('Error', error.message)
  }
  // console.log('ErrorConfig', error.config)
})
