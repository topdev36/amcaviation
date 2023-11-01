import axios from 'axios';
import domain from "common/common";
import Cookies from 'universal-cookie';

const http = axios.create({
  // baseURL: 'http://localhost:8081/',
  baseURL: 'http://' + domain + '/sales',
  // baseURL: 'http://45.142.215.141:8006/sales',
  // baseURL: 'http://192.168.131.212:8081/',
  // baseURL: 'http://51.83.223.48:8081/',
  headers: {
    'Content-type': 'application/json'
  },
  withCredentials: true
});

const httpLogin = axios.create({
  // baseURL: 'http://localhost:8081/',
  baseURL: 'http://' + domain + '/',
  // baseURL: 'http://45.142.215.141:8006/sales',
  // baseURL: 'http://192.168.131.212:8081/',
  // baseURL: 'http://51.83.223.48:8081/',
  headers: {
    'Content-type': 'application/json'
  },
  withCredentials: true
});

const cookies = new Cookies(null, { path: '/'});

const uploadFile = (file, cb) => {
    const url = 'uploadFile';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
    };
    http.post(url, formData, config).then((response) => {
      var resp = response.data;  
      if(resp.success == true){
        cb(resp)
      }else{cookies.set('statusLogin', 0)}
    }).catch((err) => { console.log(err); cb(null); });
}

const requestPaymentLink = (params, cb) => {
  const url = 'generateLink';
  http.post(url, params).then((response) => {
    var resp = response.data;
    if(resp.success == true){
      return cb(resp.link);
    }else{cookies.set('statusLogin', 0)}
    return cb(null);
  }).catch((err) => { console.log(err); });  
}

const getAllContracts = (cb) => {
  const url = 'getAllContracts';
  http.post(url, {}).then((response) => {
    if(response.data.success == false)
      cookies.set('statusLogin', 0);
    cb(response.data);
  }).catch((err) => { console.log(err); });  
}

const deleteContracts = (selected, cb) => {
  const url = 'deleteContracts';
  http.post(url, {quote_ids: selected}).then((response) => {
    if(response.data.success == false)
      cookies.set('statusLogin', 0);
    cb(response.data)
  }).catch((err) => { console.log(err); });  
}

const login = (tokenId) => {
  const url = 'login';
  return httpLogin.post(url, {tokenId: tokenId}).catch((err) => console.log(err));
}

const logout = (tokenId) => {
  const url = 'login';
  return httpLogin.post(url, {tokenId: tokenId}).catch((err) => console.log(err));
}

const submit2FA = (code) => {
  const url = "verify2fa";
  return httpLogin.post(url, {code: code}).catch((err) => console.log(err));
}

export {uploadFile, requestPaymentLink, getAllContracts, deleteContracts, submit2FA, login, logout}



