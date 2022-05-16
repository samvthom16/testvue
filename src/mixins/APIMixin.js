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
          'Authorization': 'Basic ' + btoa(username + ':' + password),
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

    requestEvent(event_id) {
      var component = this;
      var endpoint = '/wp-json/wp/v2/inpursuit-events/' + event_id;
      return API.makeRequest({
        url: component.$store.state.settings.account_url + endpoint,
        method: 'get',
        headers: component.getAuthHeaders()
      });
    },

    requestEvents(page, search = '', filterData = {}) {
      var component = this;
      var endpoint = '/wp-json/wp/v2/inpursuit-events/';

      var data = {
        'orderby': 'title',
        'order': 'asc',
        'page': page,
        'search': search,
        'status': 'publish',
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
    },

    addMember(name, email_address, phone_number, birth_date, wedding_date, gender, location, status) {

      var component = this;
      var endpoint = '/wp-json/wp/v2/inpursuit-members';
      var headers = component.getAuthHeaders();
      headers['Content-Type'] = 'application/json';

      return API.makeRequest({
        url: component.$store.state.settings.account_url + endpoint,
        method: 'post',
        data: {
          title: name,
          gender: gender,
          email: email_address,
          phone: phone_number,
          location: location,
          'special_events[birthday]': birth_date,
          'special_events[wedding]': wedding_date,
          status: status
        },
        headers: headers
      });


    },

    addEvent(title, date, description, event_type, location, status) {
      var component = this;
      var endpoint = '/wp-json/wp/v2/inpursuit-events';
      var headers = component.getAuthHeaders();
      headers['Content-Type'] = 'application/json';

      return API.makeRequest({
        url: component.$store.state.settings.account_url + endpoint,
        method: 'post',
        data: {
          title: title,
          date: date,
          description: description,
          'inpursuit-event-type': event_type,
          location: location,
          status: status
        },
        headers: headers
      });

    },

    updateAttendance(member_id, event_id, attended) {
      var component = this;
      var endpoint = '/wp-json/wp/v2/inpursuit-members/' + member_id;
      var headers = component.getAuthHeaders();
      headers['Content-Type'] = 'application/json';

      return API.makeRequest({
        url: component.$store.state.settings.account_url + endpoint,
        method: 'post',
        data: {
          event_id: event_id,
          attended: attended,
        },
        headers: headers
      });

    }
  }
}
