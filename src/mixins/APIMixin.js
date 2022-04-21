import API from '@/api.js'
//import { filter } from 'core-js/core/array';

export default {
  methods: {
    getAuthHeaders() {
      var component = this;

      var username = component.$store.state.settings.username;
      var password = component.$store.state.settings.password;

      var headers = {};
      if (username && password) {
        headers = {
          'Authorization': 'Basic ' + btoa( username + ':' + password ),
          'Content-Type': 'application/x-www-form-urlencoded'
        };
      }
      return headers;
    },

    requestUser(user_id) {
      var component = this;
      var endpoint = '/wp-json/wp/v2/inpursuit-members/' + user_id;
      return API.makeRequest({
        url: component.$store.state.settings.account_url + endpoint,
        method: 'get',
        headers: component.getAuthHeaders()
      });
    },

    requestUsers(page, search = '', filterData = {}) {
      var component = this;
      var endpoint = '/wp-json/wp/v2/inpursuit-members/';

      //console.log(filterData);

      // var str = '';
      // var i = 0;
      // for (var key in filterData) {
      //   if (parseInt(filterData[key])) {
      //     if (i == 0) str += '?';
      //     str += key + '=' + filterData[key];
      //     if (i < (Object.keys(filterData).length - 1)) str += '&';
      //     i++;
      //   }
      // }

      // console.warn("str == " + str);

      // endpoint += str;


      var data = {
        'orderby': 'title',
        'order': 'asc',
        'page': page,
        'search': search,
      };

      let finalData = Object.assign(data, filterData);

      return API.makeRequest({
        url: component.$store.state.settings.account_url + endpoint,
        method: 'get',
        data: finalData,
        headers: component.getAuthHeaders()
      });
    },

    requestHistory(options) {
      var component = this;
      var endpoint = '/wp-json/inpursuit/v1/history';
      if (options.id) {
        endpoint += '/' + options.id;
      }
      if (options.page) {
        endpoint += '?page=' + options.page;
      }

      return API.makeRequest({
        url: component.$store.state.settings.account_url + endpoint,
        method: 'get',
        headers: component.getAuthHeaders()
      });
    },

    requestProfile() {
      var component = this;
      var endpoint = '/wp-json/wp/v2/users/me?context=edit';
      return API.makeRequest({
        url: component.$store.state.settings.account_url + endpoint,
        method: 'get',
        headers: component.getAuthHeaders()
      });
    },

    deleteComment(comment_id) {
      var component = this;
      var endpoint = '/wp-json/inpursuit/v1/comments/' + comment_id;
      var headers = component.getAuthHeaders();
      return API.makeRequest({
        url: component.$store.state.settings.account_url + endpoint,
        method: 'delete',
        headers: headers
      });
    },

    postComment(post_id, comment) {
      var component = this;
      var endpoint = '/wp-json/inpursuit/v1/comments';
      var headers = component.getAuthHeaders();
      headers['Content-Type'] = 'application/json';

      return API.makeRequest({
        url: component.$store.state.settings.account_url + endpoint,
        method: 'post',
        data: {
          comment: comment,
          post: post_id
        },
        headers: headers
      });
    }
  }
}
