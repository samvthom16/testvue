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

  cleanParams: function( params ){
    params = JSON.parse( JSON.stringify( params ) );
    var removeAttr = ['pagination', 'style', 'post_type', 'method'];
    for( var index in removeAttr ){
      var key = removeAttr[ index ];
      if( params[ key ] ){
        delete params[ key ];
      }
    }
    return params;
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

  requestUsers: function( params = {} ){

    var url = this._getURL( '/wp-json/wp/v2/users' );

    if( params.id )
      url = this._getURL( '/wp-json/wp/v2/users/' + params.id )

    if( !params.method || params.method == 'get' )
      url += "?context=edit"

    var data = this.cleanParams( params )

    if( params.method == 'delete' ){
      data.id = params.id
      data.force = true
      data.reassign = 1
    }

    return this.makeRequest(  {
      url     : url,
      method  : params.method ? params.method : 'get',
      data    : data,
      headers : this.getAuthHeaders()
    } );
  },

  requestUser: function( user_id, params = {} ){
    return this.makeRequest(  {
      url     : this._getURL( '/wp-json/wp/v2/users/' + user_id + '?context=edit' ),
      method  : params.method ? params.method : 'get',
      data    : params,
      headers : this.getAuthHeaders()
    } );
  },

  requestComments: function( params = {} ){
    return this.makeRequest(  {
      url   : this._getURL( '/wp-json/inpursuit/v1/comments' ),
      data  : params,
      headers : this.getAuthHeaders()
    } );
  },

}

export default api
