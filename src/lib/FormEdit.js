import store from "@/store";

import { useRoute } from "vue-router";

import { ref } from "vue";

const post_edit = ( requestAPI, afterUpdate, afterDelete, defaultData = {} ) => {

  store.commit( "getLocalSettings" );

  const data = ref(defaultData);

  const route = useRoute();

  const withProcessing = (apiCall, onSuccess, onError = (e) => console.log(e.response.data.message)) => {
    store.commit("setProcessing", true);
    apiCall().then(
      (response) => {
        store.commit("setProcessing", false);
        onSuccess(response);
      },
      (error) => {
        store.commit("setProcessing", false);
        onError(error);
      }
    );
  };

  /*
  * REQUEST DATA FROM SERVER
  */
  const fetchDataFromServer = (id) =>
    withProcessing(
      () => requestAPI({ id }),
      (response) => { data.value = response.data; }
    );

  if ( route.query && route.query.id ) {
    fetchDataFromServer(route.query.id);
  }

  const createOrUpdateData = (ev) => {
    ev.preventDefault();
    const params = { ...data.value, method: "post" };
    withProcessing(
      () => requestAPI(params),
      (response) => afterUpdate(response.data)
    );
  };

  /*
   * DELETE POST FROM SERVER
   */
  const deleteData = () => {
    if (!confirm("Are you sure you want to delete this information?")) return;

    const params = {
      method: "delete",
      id: data.value.id,
      reassign: store.state.settings.id,
    };

    if ( route.name === 'NewCategory' ) params.force = true;

    withProcessing(
      () => requestAPI(params),
      (response) => afterDelete(response.data)
    );
  };


  return {
    data,
    fetchDataFromServer,
    createOrUpdateData,
    deleteData,
  };
};

export default post_edit;
