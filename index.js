'use strict';

var axios = require('axios');
var crypto = require('crypto');

var fs = require('fs');
const mineType = require('mime-types') // 文件类型
var _=require('underscore');
var moment=require('moment');
var FormData=require("form-data")
var DEBUG=false;
var Default_option={
    showapi_timestamp:moment().format('YYYYMMDDHHmmss')
}

/**
 * 必传secret参数, 
 * @param {<object>}} 非文件类型的应用级和系统级参数
 */
function SDK(config){
    const {url, ...option} = config
    this.url = url
    this.option = {...Default_option, ...option} // 非文件参数
    this.otherOption = {} // // 文件参数 ,也就是fs.ReadStream对象?
    log("create request:",this);
}
SDK.prototype={
    // 检验必传参数
        validate:function(){
            const requiredList = ['secret','showapi_appid']
            const optionKeys = Object.keys(this.option)
        
            return requiredList.every(item => {
                const isInclude = optionKeys.includes(item)
                if(!isInclude){
            console.error('nativeValidate error',`缺失参数: ${item}` );
                
                }
                return isInclude
     
            })
            
        },
    print:function(){
        console.info('###Default_option:',Default_option)
        console.info('###request instance:',this);
        console.info('###send params:',createSecretParam(this))
    },

    addTextPara:function(name,value){
        this.option = {...this.option, [name]:value}
        log('###add text params:',name,'=',value);
    },

    addFilePara:function(name,pathOrReadStream){
        if(typeof pathOrReadStream === 'string'){ // 如果是路径
            this.otherOption[name]=fs.createReadStream(pathOrReadStream)
        }else{ // 如果是文件:fs.ReadStream对象
            this.otherOption[name]=pathOrReadStream;
        }
        log('###add file params:',name,'=',pathOrReadStream);
    },
    /**
     * 
     * @param {<string> | <Buffer> | <URL>} 文件路径
     * @return base64字符串
     * 文件转base64
     */
    fileToBase64(pathOrReadStream){
        let data = undefined
        if(typeof pathOrReadStream === 'string'){
            data = fs.createReadStream(pathOrReadStream)
        }else{
            data = pathOrReadStream
        }
        let base64 = `data:${mineType.lookup(pathOrReadStream)};base64,${data}}`
        return base64
        },

    /**
     * 把非文件对象和文件对象append到FormData对象内
     * 
     */
    generateFormData(){
        let fd=new FormData()
       const mergedOption = {...createSecretParam(this)}
        for(let [k,v] of Object.entries(mergedOption)){
            fd.append(k,v)
          }
          return fd
    },
/**
 * 
 * @param {<object>} scope axios的配置对象,比如timeout
 */
    post:function(scope){
        if (this.validate()){
            const fd = this.generateFormData()
            console.log('post',createSecretParam(this));
            return axios({ 
                method: 'post',
                url:this.url,
                data: fd,
                headers:fd.getHeaders(),
                ...scope
                })
        }else{
           return Promise.reject('参数检验不通过')
        }
     
    },
}

/**
 * 将option加密后合并上otherOption,并返回
 */
function createSecretParam(sdk){
   let params = sdk.option

    var sortArray= _.sortBy(_.pairs(params),function(item){
        return item[0]
    });
    log('sort params:',sortArray);
    var str="";
    _.each(sortArray,function(item){
        if(!_.isEmpty(item[0])&&!_.isEmpty(item[1])){
            str+=item[0]+item[1];
        }
    })
    str+=params.secret;
    
    log('secret string:',str)
    // 非文件参数md5
    str=crypto.createHash('md5').update(str).digest('hex');
// 合并上文件参数
    _.extend(params,sdk.otherOption)
    params.showapi_sign=str;
    log('send params:',params)
    return params;
}

function error(msg){
    logError(msg);
    return {
        showapi_res_code:-1,
        showapi_res_error:msg
    }
}
function log(){
    var args=Array.apply(null,arguments)
    args.unshift("###showapiSDK debug###")
    DEBUG&&console.info.apply(console,args);
}
function logError(){
    var args=Array.apply(null,arguments)
    args.unshift("###showapiSDK debug###")
    DEBUG&&console.error.apply(console,args);
}

const debug = function(isDebug){
  DEBUG=!!isDebug;
}

module.exports = SDK
