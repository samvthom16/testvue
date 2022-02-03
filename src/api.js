import axios from 'axios'

const api = {
  request: function( url, headers = {} ){
    return axios.get( url, { headers: headers } );
  },
  post: function( url, params ){
    return axios.post( url, params );
  },
  requestUser: function( account_url, user_id ){
    var url = account_url + '/wp-json/wp/v2/inpursuit-members/' + user_id;
    return this.request( url );
  },
  requestUsers: function( account_url, page ){
    var url = account_url + '/wp-json/wp/v2/inpursuit-members/?orderby=title&order=asc&page=' + page;
    return this.request( url );
  },
  requestHistory: function( options ){
    var url = options.account_url + '/wp-json/inpursuit/v1/history';
    if( options.id ){
      url += '/' + options.id;
    }
    url += '?page=' + options.page;
    //console.log( url );
    return this.request( url );
  },
  requestProfile: function( options ){
    var url = options.account_url + '/wp-json/wp/v2/users/me?context=edit';
    return this.request( url, options.headers );
  }
}

export default api
