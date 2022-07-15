export default{

  debounce  : null,

  getPostLink: function( post ){
    var route = {
      name		: "",
      params 	: { id : post.id, post: JSON.stringify( post ) }
    };

    //console.log( route );

    if( post.type != undefined && post.type == 'inpursuit-members' ){
      route.name = "SingleMember";
    }
    else if( post.type != undefined && post.type == 'inpursuit-events' ){
      route.name = "SingleEvent";
    }
    return route;
  },

  debounceEvent: function( callback, timeout = 600 ){
    clearTimeout( this.debounce );
    this.debounce = setTimeout(() => {
      callback();
    }, timeout);
  },

}
