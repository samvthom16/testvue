import router from "@/router";
import API from "@/api";
import store from "@/store";

import Util from "@/lib/Util";

import { useRoute } from "vue-router";
import { ref } from "vue";

const post_edit = (
  post_type = "inpursuit-members",
  textfields = {},
  dropdownfields = {},
  defaultPost = {},
  checkboxFields = {}
) => {
  store.commit("getLocalSettings");

  const settings = ref({});
  const fields = ref([]);
  const route = useRoute();
  const post = ref(defaultPost);

  for (var slug in textfields) {
    var type = "text";
    var component = "TextField";

    switch (slug) {
      case "birthday":
      case "wedding":
      case "date":
        type = "date";
        break;
      case "content":
        component = "TextAreaField";
        type = "";
    }

    fields.value.push({
      type: type,
      id: slug,
      label: textfields[slug],
      component: component,
      value: "",
    });
  }

  /*
   * PARSES SETTINGS TEXT FROM TAXONOMY SLUG & TERM ID
   */
  const _getSettingsTextFromID = (slug, id) => {
    //console.log( 'settings => ' + slug + ' : ' + id )

    if (settings.value[slug] && settings.value[slug][id])
      return settings.value[slug][id];
    return "";
  };

  /*
   * FEED VALUES INTO THE FORM
   * THIS COULD BE POST PASSED FROM PROPS
   * OR FETCHED FROM THE SERVER
   */
  const feedFormFromPost = (postData) => {
    post.value = postData;

    for (var i = 0; i < fields.value.length; i++) {
      var slug = fields.value[i]["id"];

      if (fields.value[i] && (slug == "title" || slug == "content")) {
        // CHECK FOR POST TITLE
        fields.value[i]["value"] = post.value[slug]["raw"];
      } else if (fields.value[i] && slug == "date") {
        // CHECK FOR DATE INFORMATION
        var dateArr = post.value.date.split("T");
        if (dateArr.length) fields.value[i]["value"] = dateArr[0];
      } else if (fields.value[i] && (slug == "birthday" || slug == "wedding")) {
        // CHECK FOR SPECIAL DATES INFORMATION
        var temp_date = post.value.special_events[slug];
        if (temp_date) {
          var dateArr = temp_date.split("T");
          if (dateArr.length) fields.value[i]["value"] = dateArr[0];
        }
      } else if (post.value[slug] && Array.isArray(post.value[slug])) {
        // CHECK FOR CHECKBOX INFORMATION
        if (slug === "group") fields.value[i]["value"] = post.value[slug];
        else
          fields.value[i]["value"] = _getSettingsTextFromID(
            slug,
            post.value[slug][0]
          );
      } else if (
        post.value[slug] &&
        fields.value[i].type &&
        fields.value[i].type == "text"
      ) {
        // CHECK FOR TEXTBOXBOX INFORMATION
        fields.value[i]["value"] = post.value[slug];
      } else if (post.value[slug]) {
        // CHECK FOR DROPDOWN INFORMATION
        fields.value[i]["value"] = _getSettingsTextFromID(
          slug,
          post.value[slug]
        );
      }
    }
  };

  /*
   * REQUEST POST FROM SERVER BY POST ID
   */
  const fetchPostFromServer = (post_id) => {
    API.requestPost(post_type, post_id, { context: "edit" }).then((response) =>
      feedFormFromPost(response.data)
    );
  };

  /*
   * CREATE NEW POST
   */
  const createPost = (newPost) => {
    // ENABLE LOADING
    store.commit("setProcessing", true);

    API.createPost(newPost).then(
      (response) => {
        // DISABLE LOADING
        store.commit("setProcessing", false);

        redirectToSinglePost(response.data);
      },
      (error) => {
        console.log(error.response);
      }
    );
  };

  /*
   * UPDATE EXISTING POST
   */
  const updatePost = (newPost, post_id) => {
    // ENABLE LOADING
    store.commit("setProcessing", true);

    newPost["method"] = "post";
    API.requestPost(post_type, post_id, newPost).then(
      (response) => {
        // DISABLE LOADING
        store.commit("setProcessing", false);

        redirectToSinglePost(response.data);
      },
      (error) => {
        console.log(error.response.data.message);
      }
    );
  };

  const changeDateToISOString = (datestr) => new Date(datestr).toISOString();

  const createOrUpdatePost = (post = {}) => {
    var newPost = Object.assign(
      {
        post_type: post_type,
        status: "publish",
      },
      post
    );

    var form = document.querySelector("form");
    var formData = new FormData(form);
    for (var key of formData.keys()) {
      var value;

      if (key === "inpursuit-group") {
        value = formData.getAll(key);
      } else {
        value = formData.get(key);
      }

      if (value && value !== "Choose") {
        newPost[key] = value;
      }
    }

    // CHANGE THE FORMAT OF THE DATE
    if (newPost.date) {
      newPost.date = changeDateToISOString(newPost.date);
      //new Date( newPost.date ).toISOString();
    }

    if (newPost.birthday || newPost.wedding) {
      if (!newPost.special_events) newPost.special_events = {};
      if (newPost.birthday)
        newPost.special_events.birthday = changeDateToISOString(
          newPost.birthday
        );
      if (newPost.wedding)
        newPost.special_events.wedding = changeDateToISOString(newPost.wedding);
    }

    if (route.query && route.query.id) {
      updatePost(newPost, route.query.id);
    } else {
      createPost(newPost);
    }
  };

  /*
   * DELETE POST FROM SERVER
   */
  const deletePost = (post_id) => {
    // ENABLE LOADING
    store.commit("setProcessing", true);

    var params = { method: "delete" };
    API.requestPost(post_type, post_id, params).then(() => {
      // DISABLE LOADING
      store.commit("setProcessing", false);

      redirectToPosts();
    });
  };

  /*
   * REDIRECT TO SINGLE POST AFTER UPDATING OR CREATING NEW POST
   */
  const redirectToSinglePost = (post) => {
    if (window.history.length > 2) router.go(-1);
    else router.push(Util.getPostLink(post));

    const newPost = ref(post);
    store.commit("setPost", newPost);
    store.commit("setCachedMember", newPost);
  };

  /*
   * REDIRECT TO MEMBERS LIST
   * MOST PORBABLY CALLED AFTER DELETING THE POST
   */
  const redirectToPosts = () => router.push({ name: "Members" });

  /*
   * SET FORM VALUES FROM THE POST RESPONSE
   * EITHER PASSED THROUGH THE PROPS
   * OR FETCH FROM THE SERVER
   */
  const setFormValues = () => {
    if (route.query && route.query.params && route.query.params.post) {
      feedFormFromPost(route.query.params.post);
    } else if (route.query && route.query.id) {
      fetchPostFromServer(route.query.id);
    }
  };

  /*
   * REQUEST SETTINGS API FROM SERVER
   */
  const fetchSettingsFromServer = () => {
    Util.fetchSettings((data) => {
      settings.value = data;

      // ITERATE THROUGH THE DROPDOWNFIELDS TO SET OPTIONS DATA
      for (var key in dropdownfields) {
        if (data[key]) {
          let finalOptions = Object.assign(
            {
              Choose: "Choose",
            },
            data[key]
          );
          fields.value.push({
            id: key,
            label: dropdownfields[key],
            component: "DropDownField",
            value: "Choose",
            options: finalOptions,
          });
        }
      }

      for (var key in checkboxFields) {
        if (data[key]) {
          let finalOptions = Object.assign({}, data[key]);
          fields.value.push({
            id: key,
            label: checkboxFields[key] || key,
            component: "CheckboxGroupField",
            value: [],
            options: finalOptions,
          });
        }
      }

      // SET FORM VALUES FROM THE POST
      setFormValues();
    });
  };

  /*
   * FIRST FUNCTION TO BE CALLED
   */
  fetchSettingsFromServer();

  return {
    post,
    fields,
    createOrUpdatePost,
    deletePost,
    fetchPostFromServer,
    redirectToSinglePost,
    redirectToPosts,
  };
};

export default post_edit;
