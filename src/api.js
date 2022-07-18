import axios from 'axios'

import store from '@/store'

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

  getAuthHeaders: function() {
    var username = store.state.settings.username;
    var password = store.state.settings.password;

    var headers = {};
    if (username && password) {
      headers = {
        'Authorization': 'Basic ' + btoa(username + ':' + password),
        //'Content-Type': 'application/x-www-form-urlencoded'
      };
    }
    return headers;
  },

  _getURL: ( endpoint ) => store.state.settings.account_url + endpoint,

  requestPosts: function( post_type, params = {} ){
    return this.makeRequest( {
        url     : this._getURL( '/wp-json/wp/v2/' + post_type + '/' ),
        method  : 'get',
        data    : params,
        headers : this.getAuthHeaders()
    } )
  },

  requestPost: function( post_type, post_id, params = {} ){

    //var data = params
    //delete data['method']
    //delete data['post_type']

    return this.makeRequest( {
        url     : this._getURL( '/wp-json/wp/v2/' + post_type + '/' + post_id ),
        method  : params.method ? params.method : 'get',
        data    : params,
        headers : this.getAuthHeaders()
    } )
  },

  requestHistory: function( params = {} ){
    return this.makeRequest( {
        url     : this._getURL( '/wp-json/inpursuit/v1/history' ),
        method  : 'get',
        data    : params,
    } )
  },

  requestSettings: function(){
    return this.makeRequest( {
      url     : this._getURL( '/wp-json/inpursuit/v1/settings' ),
      method  : 'get',
      headers : this.getAuthHeaders()
    } )
  },

  createPost: function( newPost ) {
    var post_type = newPost.post_type ? newPost.post_type : 'posts';
    return this.makeRequest( {
      url     : this._getURL( "/wp-json/wp/v2/" + post_type + "/" ),
      data    : newPost,
      method  : "post",
      headers : this.getAuthHeaders()
    } );
  },

  createAttachment: function( attachment ) {
    return this.makeRequest( {
      url     : this._getURL("/wp-json/wp/v2/media/"),
      data    : attachment,
      method  : "post",
      headers : this.getAuthHeaders()
    } );
  },

}

export default api
