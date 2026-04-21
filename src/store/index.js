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
  }
  return API.makeRequest({ url: url, headers: headers, method: "get" });
}

export default createStore({
  state: {
    settings: {},
    workspaces: [],
    account: {},
    processing: false,
    errors: [],
    post: {},
    teamMember: {},
    cachedMember: {},
  },
  mutations: {
    getLocalSettings(state) {
      // Migrate legacy single-workspace to workspaces array
      if (localStorage.inpursuit_settings && !localStorage.inpursuit_workspaces) {
        const existing = JSON.parse(localStorage.inpursuit_settings);
        if (existing?.account_url) {
          localStorage.inpursuit_workspaces = JSON.stringify([existing]);
        }
      }

      if (localStorage.inpursuit_workspaces) {
        state.workspaces = JSON.parse(localStorage.inpursuit_workspaces);
      }

      if (localStorage.inpursuit_settings) {
        state.settings = JSON.parse(localStorage.inpursuit_settings);
      }

      return state.settings;
    },
    saveLocalSettings(state, payload) {
      state.settings = payload;
      localStorage.inpursuit_settings = JSON.stringify(payload);
    },
    flushLocalSettings(state) {
      // Remove the active workspace from the list
      const active = state.settings?.account_url;
      const remaining = state.workspaces.filter((w) => w.account_url !== active);
      state.workspaces = remaining;
      localStorage.inpursuit_workspaces = JSON.stringify(remaining);

      if (remaining.length > 0) {
        // Switch to next available workspace
        const next = remaining[0];
        state.settings = next;
        localStorage.inpursuit_settings = JSON.stringify(next);
      } else {
        state.settings = {};
        localStorage.inpursuit_settings = null;
      }
    },
    addWorkspace(state, payload) {
      const idx = state.workspaces.findIndex(
        (w) => w.account_url === payload.account_url
      );
      if (idx >= 0) {
        state.workspaces[idx] = payload;
      } else {
        state.workspaces.push(payload);
      }
      localStorage.inpursuit_workspaces = JSON.stringify(state.workspaces);
    },
    switchWorkspace(state, account_url) {
      const workspace = state.workspaces.find(
        (w) => w.account_url === account_url
      );
      if (!workspace) return;
      state.settings = workspace;
      localStorage.inpursuit_settings = JSON.stringify(workspace);
      // Force full reload to flush vue-query cache
      window.location.href = "/";
    },
    setPost(state, payload) {
      state.post = payload;
      return state.post;
    },
    setTeamMember(state, payload) {
      state.teamMember = payload;
      return state.teamMember;
    },
    setCachedMember(state, data) {
      state.cachedMember = data;
      return state.cachedMember;
    },
    clearCachedMember(state) {
      state.cachedMember = [];
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
    addWorkspace(context, payload) {
      context.commit("addWorkspace", payload);
    },
    switchWorkspace(context, account_url) {
      context.commit("switchWorkspace", account_url);
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
