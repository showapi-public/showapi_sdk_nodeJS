仅适用于调用showapi.com的接口!  基于axios, 所以实例的request方法 等同于axiox.request, [axios 文档地址](https://github.com/axios/axios#axiosrequestconfig)
`每次调用request方法都需要重新实例化`
 
### 安装

#### yarn

```bash
yarn add axios mime-types form-data
```

#### npm

```bash
npm i axios mime-types form-data
```

### 使用方式
```js
require Showapi from 'showapi_sdk_nodeJS' // 暂时未发布该版本到npm, 请先引用文件夹下的index.js

// 配置showapi_appid 和 secret, 位于 https://www.showapi.com/console#/myApp
const instance = new Showapi({
showapi_appid: '', // 必填
secret: '', // 必填
showapi_timestamp:'',// 非必填
showapi_res_gzip:'' // 非必填
})
instance.request({
  url:''
}).then(()=>{})
```

### 兼容性
本sdk使用了 ES6 Promises以及部分es6特性, 请确保你的环境支持它


### playground
因为每次调用request方法都需要重新调用 new Showapi(), 为方便管理, 您可以再次封装一下,比如:

```js
// showapiRequest.js
const Showapi = require('showapi_sdk_nodeJS')

const showapiRequest = function(){
  const axios =  new Showapi({
    showapi_appid: '', 
    secret: '', 
  })
  return instance
}
module.exports = showapiRequest()

// 调用时
const showapiRequest = require('./../showapiRequest.js')
showapiRequest.request({
  url:'https://route.showapi.com/9-4',
  method:'get',
  params:{
    ip:'113.78.19.201'
  }
}).then(res=> console.log(res))
```


### 实例方法

| 方法名 | 说明| 参数
|  -- | -- | -- |
|  request | 发起http请求, 等同于axios的request方法 | 请查看axios文档
| markupFile | 标记文件, 请求参数是文件时,请务必使用调用该方法,| file
| filePathToBase64 | 工具函数,作用是将文件转为base64 | 文件路径



