import axios from "axios";
import domain from "common/common";

const http = axios.create({
  // baseURL: 'http://localhost:8081/',
  baseURL: "http://" + domain + "/pay",
  // baseURL: "http://45.142.215.141:8006/pay",
  // baseURL: 'http://192.168.131.212:8081/',
  // baseURL: 'http://51.83.223.48:8081/',
  headers: {
    "Content-type": "application/json",
  },
});

const getContract = (quote_id, cb) => {
  const url = "getContract";
  let params = {
    quote_id: quote_id,
  };
  sendPostRequest(url, params, cb);
};

const getTxInfo = (id, txid, cb) => {
  const url = "getTxInfo";
  let params = {
    id: id,
    txid: txid,
  };
  sendPostRequest(url, params, cb);
};

const requestApproveContract = (id, name, cb) => {
  const url = "signContract";
  let params = {
    id: id,
    name: name,
  };
  sendPostRequest(url, params, cb);
}

const sendPostRequest = (url, params, cb) => {
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };
  http
    .post(url, params, config)
    .then((response) => {
      console.log(response);
      var resp = response.data;
      cb(resp);
    })
    .catch((err) => {
      console.log(url, err);
    });
};

export { getContract, getTxInfo, requestApproveContract };
