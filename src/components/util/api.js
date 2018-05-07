window.getUrlParms = function(name){
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return unescape(r[2]);
    return null;
}

window.addToken=function(obj){
    let newObj=obj || {}
    newObj.token=sessionStorage.getItem("token")
    //console.log(newObj)
    return newObj
}

import axios from 'axios';

const instance = axios.create({})
const multipart = axios.create({
    withCredentials: true})

instance.defaults.transformRequest = [function (data) {
    let newData = ''
    for (let k in data) {
        newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
    }
    return newData
}]
multipart.interceptors.request.use(function (config) {
    config.headers['Content-Type'] = 'multipart/form-data'
    return config
})

export {
    instance, multipart
}
