import store from "@/store";
import API from "@/api";

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale( en );

export default {
  //debounce  : null,

  // REMOVE EMPTY PARAMS THAT COME FROM DEFAULT ATTRIBUTES
  removeEmptyParams: (params) => {
    for (var key in params) {
      if (!params[key]) {
        delete params[key];
      }
    }
    return params;
  },

  getPostLink: function (post) {
    if (!post) return {};

    var route = {
      name: "",
      params: { id: post.id },
      //state: { post }
    };

    //console.log( route );

    if (post.type != undefined && post.type == "inpursuit-members") {
      route.name = "SingleMember";
    } else if (post.type != undefined && post.type == "inpursuit-events") {
      route.name = "SingleEvent";
    }
    return route;
  },

  getPostEditLink: function (post) {
    var route = {
      name: "",
      //state: { post },
      query: { id: post.id },
    };

    //console.log( route );

    if (post.type != undefined && post.type == "inpursuit-members") {
      route.name = "NewMember";
    } else if (post.type != undefined && post.type == "inpursuit-events") {
      route.name = "NewEvent";
    }
    return route;
  },

  /*
   * LEADERSHIP TEAM ACCESS
   */
  getUserEditLink: function (user) {
    return {
      name: "NewTeamMember",
      params: { user: JSON.stringify(user) },
      query: { id: user.id },
    };
  },
  getUserLink: function (teamMember) {
    return {
      name: "SingleTeamMember",
      params: { teamMember: JSON.stringify(teamMember), id: teamMember.id },
    };
  },
  // RETURN TRUE IF ROLE EXISTS IN THE LIST ELSE FALSE
  hasUserRole: function ({ user, searchRole }) {
    const roles = user?.roles || [];
    if (!roles.length || !searchRole) return false;
    return roles.includes(searchRole.toLowerCase());
  },

  /*
  debounceEvent: function( callback, timeout = 600 ){
    //console.log( timeout )
    clearTimeout( this.debounce );
    this.debounce = setTimeout(() => {
      callback();
    }, timeout);
  },
  */

  fetchSettings: function (callback) {
    // ENABLE LOADING
    store.commit("setProcessing", true);

    API.requestSettings().then((response) => {
      // DISABLE LOADING
      store.commit("setProcessing", false);

      // CALLBACK FUNCTION
      callback(response.data);
    });
  },

  timeAgo: function (dateParam) {

    const timeAgo = new TimeAgo( 'en-US' );


    return timeAgo.format( new Date( dateParam ) );
  },
};
