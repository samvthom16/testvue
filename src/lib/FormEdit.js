import store from "@/store";

import { useRoute } from "vue-router";

import { ref } from "vue";

const post_edit = ( requestAPI, afterUpdate, afterDelete, defaultData = {} ) => {

  store.commit( "getLocalSettings" );

  const data = ref(defaultData);

  const route = useRoute();


  /*
  * REQUEST DATA FROM SERVER
  */
  const fetchDataFromServer = ( id ) => {  console.log( 'fetch from server' )

    // ENABLE LOADING
    store.commit("setProcessing", true);

    requestAPI( { id: id } ).then(
      (response) => {
        // ENABLE LOADING
        store.commit("setProcessing", false);

        //console.log( response.data )
        data.value = response.data;
      },
      (error) => {
        console.log(error.response.data.message);
        store.commit("setProcessing", false); // DISABLE LOADING
      }
    );
  };

  //if ( route.query && route.query.id && route.name === "EditTeamMember" ) {
  if ( route.query && route.query.id ) {
    fetchDataFromServer(route.query.id);
  }

  const createOrUpdateData = (ev) => {
    ev.preventDefault();

    // ENABLE LOADING
    store.commit("setProcessing", true);

    var params = data.value;
    params.method = "post";

    // CHANGE THE FORMAT OF THE DATE
    //if( newPost.date ){
    //newPost.date = new Date( newPost.date ).toISOString();
    //}

    requestAPI(params).then(
      (response) => {
        // DISABLE LOADING
        store.commit("setProcessing", false);

        afterUpdate(response.data);
      },
      (error) => {
        console.log(error.response.data.message);
        store.commit("setProcessing", false); // DISABLE LOADING
      }
    );
  };

  //console.log( route.name )

  /*
   * DELETE POST FROM SERVER
   */
  const deleteData = () => {
    if (confirm("Are you sure you want to delete this information?")) {
      // ENABLE LOADING
      store.commit("setProcessing", true);

      var params = {
        method: "delete",
        id: data.value.id,
        reassign: store.state.settings.id,
      };

      // SPECIAL CONDITION FOR THE TERM EDIT
      if( route.name == 'NewCategory' )
        params.force = true;


      //console.log( params )
      requestAPI(params).then(
        (response) => {
          // DISABLE LOADING
          store.commit("setProcessing", false);

          //console.log( response.data )

          afterDelete(response.data);
        },
        (error) => {
          console.log(error.response.data.message);
        }
      );
    }
  };


  return {
    data,
    fetchDataFromServer,
    createOrUpdateData,
    deleteData,
  };
};

export default post_edit;
