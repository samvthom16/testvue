import axios from 'axios'

const api = {
  /*
  request: function( url, headers = {} ){
    return axios.get( url, { headers: headers } );
  },
  post: function( url, params ){
    return axios.post( url, params );
  },
  */
  makeRequest: function (options) {
    var api;

    var headers = {};
    if (options.headers) {
      headers = options.headers
    }

    if (options.method == 'post') {
      api = axios.post(options.url, options.data, { headers: headers });
    }
    else if (options.method == 'delete') {
      //console.log( headers );
      api = axios.delete(options.url, { data: options.data, headers: headers });
    }
    else {

      var params = {};
      if (options.data) {
        params = options.data;
      }

      api = axios.get(options.url, {
        params: params,
        headers: headers
      });
    }

    return api;
  },

  requestVerifyMail: function (base_url, params = {}) {

    var url = base_url + '/wp-json/inpursuit/v1/verify/';
    return this.makeRequest({
      url: url,
      method: 'post',
      data: params,
    });
  },

  requestAuthenticateEmailAddress: function (base_url, params = {}) {

    var url = base_url + '/wp-json/inpursuit/v1/authentication/';
    return this.makeRequest({
      url: url,
      method: 'post',
      data: params,
    });
  },

}

export default api
