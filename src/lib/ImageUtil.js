import API from '@/api'

const ImageUtil = () => {

  const handleImageSelection = ( ev, localCallback, serverCallback ) => {
    if( ev.target.files ){

      var files = ev.target.files;
      var file = files[0];

      var reader = new FileReader();
      reader.onload = function (e) {
        localCallback( e.target.result );
      }

      // ONLY ADD IMAGES
      if( file && file.type && file.type.indexOf( 'image' ) !== -1 ){
        reader.readAsDataURL( file );

        upload( file, serverCallback );
      }
    }
  }

  const upload = ( file, callback ) => {
    var selectedImage = new FormData();
    selectedImage.append( "file", file );

    //console.log( API )
    //console.log( callback )

    /* ADD NEW IMAGE */
    API.createAttachment( selectedImage ).then( ( response ) => {
        callback( response.data.source_url, response.data.id );
      },( error ) => {
        console.log( error );
      }
    );
    
  }

  return {
    handleImageSelection,
    upload
  }

}

export default ImageUtil
