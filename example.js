
var fs = require('fs');

  // 以二维码生成与识别接口为例 https://www.showapi.com/apiGateway/view/?apiCode=887&pointCode=2


  // base64 代码示例
  var instance = new SDK({
    url: 'https://route.showapi.com/887-4',
    showapi_appid: '',
    secret: '',
  })

  const file = fs.createReadStream('./static/xxx.png')
  const base64 = instance.fileToBase64(file)
  instance.addTextPara('imgData',base64)
  instance.post()
  .then(response =>{console.log('res', response.data)})
  .catch(error => console.log('error', error))


  // 普通文本 代码示例
  var instance = new SDK({
    url: 'https://route.showapi.com/887-1',
    showapi_appid: '',
    secret: '',
    content:'我是内容'
  })
  instance.post()
  .then(response =>{console.log('res', response.data)})
  .catch(error => console.log('error', error))

  // 文件上传 代码示例
  var instance = new SDK({
    url: 'https://route.showapi.com/887-2',
    showapi_appid: '',
    secret: '',

  })
  instance.addFilePara('img','./static/xxx.png')
  instance.post()
  .then(response =>{console.log('res', response.data)})
  .catch(error => console.log('error', error))

