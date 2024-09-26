import { createStore } from "vuex";
import API from "../api.js";

function authRequest(state, url) {
  var username = state.settings.username;
  var password = state.settings.password;

  var headers = {};

  if (username && password) {
    headers = {
      Authorization: "Basic " + btoa(username + ":" + password),
      "Content-Type": "application/x-www-form-urlencoded",
    };
    //console.log( headers );
  }
  return API.makeRequest({ url: url, headers: headers, method: "get" });
}

export default createStore({
  state: {
    settings: {},
    account: {},
    processing: false,
    errors: [],
    post: {},
    teamMember: {},
  },
  mutations: {
    getLocalSettings(state) {
      if (localStorage.inpursuit_settings) {
        state.settings = JSON.parse(localStorage.inpursuit_settings);
      }
      return state.settings;
    },
    saveLocalSettings(state, payload) {
      state.settings = payload;
      localStorage.inpursuit_settings = JSON.stringify(payload);
    },
    flushLocalSettings() {
      localStorage.inpursuit_settings = null;
    },
    setPost(state, payload) {
      state.post = payload;
      return state.post;
    },
    setTeamMember(state, payload) {
      state.teamMember = payload;
      return state.teamMember;
    },

    /*
     * THIS FUNCTION MAKES A SERVER REQUEST TO GET ALL
     * THE ACCOUNT SETTINGS
     * IMPORTANT FUNCTION CALL THAT IS CALLED ONCE FOR EVERY BROWSER RELOAD
     * THIS FUNCTION SHOULD BE CALLED BEFORE PULLING ANY OTHER DATA
     */
    getAccountSettings(state) {
      var url = state.settings.account_url + "/wp-json/inpursuit/v1/settings";

      authRequest(state, url).then(
        (response) => {
          return (state.account = response.data);
        },
        (error) => {
          state.error = "" + error;
          //console.log( '' + error );
        }
      );
      return state.account;
    },
    setProcessing(state, flag) {
      state.processing = flag;
      return state.processing;
    },
    notifyError(state, errorText) {
      state.errors.push(errorText);
      return state.errors;
    },
    flushError(state, index) {
      state.errors.splice(index, 1);
      return state.errors;
    },
  },
  actions: {
    getLocalSettings(context) {
      context.commit("getLocalSettings");
    },
    saveLocalSettings(context, payload) {
      context.commit("saveLocalSettings", payload);
    },
    flushLocalSettings(context) {
      context.commit("flushLocalSettings");
    },
    getAccountSettings(context, url) {
      context.commit("getAccountSettings", url);
    },
    setProcessing(context, flag) {
      context.commit("setProcessing", flag);
    },
    notifyError(context, errorText) {
      var text = "" + errorText;
      context.commit("notifyError", text);
    },
    flushError(context, index) {
      context.commit("flushError", index);
    },
  },
  modules: {},
});
