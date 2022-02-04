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
  makeRequest: function( options ){
    var api;

    var headers = {};
    if( options.headers ){
      headers = options.headers
    }

		if( options.method == 'post' ){
			api = axios.post( options.url, options.data, { headers: headers } );
		}
		else if( options.method == 'delete' ){
			//console.log( headers );
			api = axios.delete( options.url, { data: options.data, headers: headers } );
		}
		else{
      api = axios.get( options.url, { headers: headers } );
		}

		return api;
	},
}

export default api
