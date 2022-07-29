//import router from '@/router'
//import API from '@/api'
import store from '@/store'

//import Util from "@/lib/Util"

import { useRoute } from 'vue-router';
import { ref } from 'vue'

const post_edit = (
  requestAPI,
  afterUpdate,
  afterDelete,
  defaultData = {}
) => {

  store.commit( 'getLocalSettings' )

  //const settings = ref( {} )

  const data = ref( defaultData )

  const route = useRoute()



  /*
  * PARSES SETTINGS TEXT FROM TAXONOMY SLUG & TERM ID
  *
  const _getSettingsTextFromID = ( slug, id ) => {
    if( settings.value[ slug ] && settings.value[ slug ][ id ] ) return settings.value[ slug ][ id ]
    return ''
  }



  /*
  * REQUEST DATA FROM SERVER
  */



  const fetchDataFromServer = ( id ) => {

    // ENABLE LOADING
    store.commit( 'setProcessing', true )

    requestAPI( { id: id } ).then(
      ( response ) => {

        // ENABLE LOADING
        store.commit( 'setProcessing', false )

        //console.log( response.data )
        data.value = response.data
      }
    )
  }

  if( route.query && route.query.id ){
    fetchDataFromServer( route.query.id )
  }




  const createOrUpdateData = ( ev ) => {

    ev.preventDefault();

    // ENABLE LOADING
    store.commit( 'setProcessing', true )

    var params = data.value;
    params.method = 'post'

    // CHANGE THE FORMAT OF THE DATE
    //if( newPost.date ){
      //newPost.date = new Date( newPost.date ).toISOString();
    //}

    requestAPI( params ).then(
      ( response ) => {

        // DISABLE LOADING
        store.commit( 'setProcessing', false )

        afterUpdate( response.data )

      },
      ( error ) => {
        console.log( error.response.data.message )
      }
    );


  }

  /*
  * DELETE POST FROM SERVER
  */
  const deleteData = () => {

    if( confirm( 'Are you sure you want to delete this information?' ) ){

      // ENABLE LOADING
      store.commit( 'setProcessing', true )

      var params = { method  : 'delete', id: data.value.id }

      //console.log( params )
      requestAPI( params ).then(
        ( response ) => {

          // DISABLE LOADING
          store.commit( 'setProcessing', false )

          //console.log( response.data )

          afterDelete( response.data )

        },
        ( error ) => {
          console.log( error.response.data.message )
        }
      );

    }




  }

  /*
  * REDIRECT TO SINGLE POST AFTER UPDATING OR CREATING NEW POST
  */
  //const redirectToSinglePost = ( post ) => router.push( Util.getPostLink( post ) )

  /*
  * REDIRECT TO MEMBERS LIST
  * MOST PORBABLY CALLED AFTER DELETING THE POST
  */
  //const redirectToPosts = () => router.push( { name : 'Members' } )

  /*
  * SET FORM VALUES FROM THE POST RESPONSE
  * EITHER PASSED THROUGH THE PROPS
  * OR FETCH FROM THE SERVER
  *
  const setFormValues = () => {
    if( route.query && route.query.params && route.query.params.post ){
      feedFormFromPost( route.query.params.post )
    }
    else if( route.query && route.query.id ){
      fetchPostFromServer( route.query.id )
    }
  }

  /*
  * REQUEST SETTINGS API FROM SERVER
  *
  const fetchSettingsFromServer = () => {

    Util.fetchSettings( ( data ) => {

      settings.value = data

      // ITERATE THROUGH THE DROPDOWNFIELDS TO SET OPTIONS DATA
      for( var key in dropdownfields ){
        if( data[ key ] ){
          let finalOptions = Object.assign( {
            'Choose': 'Choose'
          }, data[ key ] );
          fields.value.push( {
            id        : key,
            label     : dropdownfields[ key ],
            component : 'DropDownField',
            value     : 'Choose',
            options   : finalOptions
          } )
        }
      }

      // SET FORM VALUES FROM THE POST
      setFormValues()

    } )
  }

  /*
  * FIRST FUNCTION TO BE CALLED
  */
  //fetchSettingsFromServer()

  return {
    data,
    fetchDataFromServer,
    createOrUpdateData,
    deleteData
    /*
    post,
    fields,

    deletePost,
    fetchDataFromServer,
    redirectToSinglePost,
    redirectToPosts
    */
  }

}

export default post_edit
