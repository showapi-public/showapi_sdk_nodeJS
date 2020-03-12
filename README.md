> 注: 该nodejsSDK内部使用axios请求库,
>对于基本数据类型, 例如字符串(包括base64),可以在实例化时,通过option一次性传入, 也可以用addTextPara方法一个个传入;对于文件对象, 仅能使用>addFilePara传入
>对比jsSDK版本: 1, fileToBase64的使用略有区别; 2, nodejsSDK使用secret字段代替showapi_sign

## 使用方式
```javascript
const instance = new jsSDK(option)
instance.post()
  .then(response){console.log(response.data)}
  .catch(err){console.log(err)}
```


## api

### option

| 参数| 说明| 类型| 默认值 |
|  -- | -- | -- | --|
|showapi_appid| 应用id| string| ''
|secret | 密钥| string | ''
| url | ajax时调用的url地址 | string|''
|...| 其他请求参数| any | -


### 实例方法

| 方法名 | 说明| 参数
|  -- | -- | -- |
| addTextPara | 向option对象中添加请求参数, | 参数名,参数值
| addFilePara | 向option对象中添加文件类型的值, 文件上传只能通过调用addFilePara方法传入, 尝试在option中传入是无效的|参数名,参数值
| fileToBase64 | 这是一个同步操作, 具体使用方式请查看demo, | path或fs.ReadStream对象
| post | 发送post请求,返回Promise对象,  | 接受一个对象,用于axios,比如设置超时: post({timeout:2000})

## demo
  
  [以二维码生成与识别接口为例]( https://www.showapi.com/apiGateway/view/?apiCode=887&pointCode=2) 

 ```javascript
 // base64 代码示例
  var fs = require('fs');
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
   ```


