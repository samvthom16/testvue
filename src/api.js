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
  }
}

export default api
