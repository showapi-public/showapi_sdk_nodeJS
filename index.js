/* eslint-disable */
const axios = require('axios')
var crypto = require('crypto')
const mime = require('mime-types') // 文件类型
const FormData = require('form-data')
const fs = require('fs')
const querystring = require('querystring')
// md5加密
function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

/**
 * 生成签名的时间戳
 * @return {字符串}
 */
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

/**
 * @param {obj} 除secret外的参数对象
 */
function getSortString (secret, obj) {
  return Object.keys(obj).sort().reduce(function (result, curr) {
    result += `${curr}${obj[curr]}`
    return result
  }, '') + secret
}

function App (globalConfig) {
  this.globalConfig = { ...globalConfig }
  this.hasFile = false
  this.form = {}
}

App.prototype = {

  markupFile (file) {
    // 非第一次调用
    if (this.form instanceof FormData) {
    } else { // 第一次调用
      this.form = new FormData()
    }
    this.hasFile = true
    file.showapiMarkup = true
    return file
  },
  /**
     * 签名
     *  https://www.showapi.com/book/view/3105/40
     */
  getSignString (outParams, globalConfig) {
    const params = { ...outParams }
    const { showapi_appid, secret, showapi_timestamp,showapi_res_gzip } = globalConfig

    for (const [k, v] of Object.entries(params)) {
      // 去除空值的参数
      if (v === undefined || v === '') {
        delete params[k]
      }
      // 文件对象
      if (v.showapiMarkup) {
        delete params[k]
        delete outParams[k].showapiMarkup
        delete outParams[k]

      }
    }

    const sort = getSortString(secret, {
      ...params,
      showapi_appid,
      ...showapi_timestamp && { showapi_timestamp: showapi_timestamp },
      ...showapi_res_gzip && { showapi_res_gzip: showapi_res_gzip },
    })
    console.log('sortString', sort)
    return md5(sort)
  },

  /**
        * 文件转base64
        */
  filePathToBase64 (path) {
    let data = fs.readFileSync(path)
    data = Buffer.from(data).toString('base64')
    const base64 = 'data:' + mime.lookup(path) + ';base64,' + data
    return base64
  },

  request (config) {
    const method = config.method || 'get'

    const axios1 = axios.create()
    // 请求拦截器, 导致之后调用时, headers被强制设为了formData
    axios1.interceptors.request.use(function (requestConfig) {
      if (requestConfig.data instanceof FormData) {
        Object.assign(requestConfig.headers, requestConfig.data.getHeaders())
      }
      return requestConfig
    },  function(error){
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    })

        // Add a response interceptor
        axios1.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
          const res = response.data
          console.log('res', res)
          if (res.showapi_res_code === 0) {
            return res.showapi_res_body
          } else {
            return Promise.reject(new Error(res.showapi_res_error || 'Error'))
          }
        
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    });

    if (method.toLowerCase() === 'get') {
      const { params = {}, ...scoped } = config
      const { showapi_appid, showapi_timestamp,showapi_res_gzip } = this.globalConfig
      const sign = this.getSignString(params, this.globalConfig)
      console.log('sign___-', sign)
      this.form = {
        showapi_appid: showapi_appid,
        showapi_sign: sign,
        ...showapi_timestamp && { showapi_timestamp: showapi_timestamp },
        ...showapi_res_gzip && {showapi_res_gzip: showapi_res_gzip},
        ...params // 调用request传入的参数
      }
      console.log('get_form', this.form )
      return axios1({
        params: this.form,
        ...scoped
      })
    }

    if (method.toLowerCase() === 'post') {
      const { data = {}, ...scoped } = config
      const { showapi_appid, showapi_timestamp ,showapi_res_gzip} = this.globalConfig

      const sign = this.getSignString(data, this.globalConfig)
      console.log('sign___-', sign)
      console.log('hasFile-', this.hasFile,this.form)

      if (this.hasFile) { // 文件上传
        this.form.append('showapi_appid', showapi_appid)
        this.form.append('showapi_sign', sign)
        showapi_timestamp && this.form.append('showapi_timestamp', showapi_timestamp)
        showapi_res_gzip && this.form.append('showapi_timestamp', showapi_res_gzip)
        for (const [k, v] of Object.entries(data)) {
          console.log('for', k, typeof v, v)
          this.form.append(k, v)
        }

        return axios1({
          data: this.form,
          ...scoped
        })
      } else { // 非文件上传
        this.form = {
          showapi_appid: showapi_appid,
          showapi_sign: sign,
          ...showapi_timestamp && { showapi_timestamp: showapi_timestamp },
          ...showapi_res_gzip && {showapi_res_gzip:showapi_res_gzip},
          ...data
        }

        return axios1({
          data: querystring.stringify(this.form),
          ...scoped
        })
      }
    }
  }

}

module.exports = App
