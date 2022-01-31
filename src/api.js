import axios from 'axios'

const api = {
  request: function( url ){
    return axios.get( url );
  },
  post: function( url, params ){
    return axios.post( url, params );
  }
}

export default api
