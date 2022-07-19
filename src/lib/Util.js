import store from '@/store'
import API from '@/api'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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

  getPostEditLink: function( post ){
    var route = {
      name		: "",
      params 	: { post: JSON.stringify( post ) },
      query   : { id: post.id }
    };

    //console.log( route );

    if( post.type != undefined && post.type == 'inpursuit-members' ){
      route.name = "NewMember";
    }
    else if( post.type != undefined && post.type == 'inpursuit-events' ){
      route.name = "NewEvent";
    }
    return route;
  },

  debounceEvent: function( callback, timeout = 600 ){
    clearTimeout( this.debounce );
    this.debounce = setTimeout(() => {
      callback();
    }, timeout);
  },

  fetchSettings: function( callback ){

    // ENABLE LOADING
    store.commit( 'setProcessing', true )

    API.requestSettings().then( ( response ) => {

      // DISABLE LOADING
      store.commit( 'setProcessing', false )

      // CALLBACK FUNCTION
      callback( response.data )

    } )
  },

  _getFormattedDate: function( date, prefomattedDate = false, hideYear = false ) {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) {
      // Adding leading zero to minutes
      minutes = `0${ minutes }`;
    }

    if (prefomattedDate) {
      // Today at 10:20
      // Yesterday at 10:20
      return `${ prefomattedDate }, ${ hours }:${ minutes }`;
    }

    if (hideYear) {
      // 10. January at 10:20
      return `${ day } ${ month }, ${ hours }:${ minutes }`;
    }

    // 10. January 2017. at 10:20
    return `${ day } ${ month } ${ year }, ${ hours }:${ minutes }`;
  },

  timeAgo: function( dateParam ){
    if (!dateParam) {
      return null;
    }

    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();


    if (seconds < 5) {
      return 'now';
    } else if (seconds < 60) {
      return `${ seconds } seconds ago`;
    } else if (seconds < 90) {
      return 'about a minute ago';
    } else if (minutes < 60) {
      return `${ minutes } minutes ago`;
    } else if (isToday) {
      return this._getFormattedDate(date, 'Today'); // Today at 10:20
    } else if (isYesterday) {
      return this._getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
    } else if (isThisYear) {
      return this._getFormattedDate(date, false, true); // 10. January at 10:20
    }

    return this._getFormattedDate(date); // 10. January 2017. at 10:20
  }

}
