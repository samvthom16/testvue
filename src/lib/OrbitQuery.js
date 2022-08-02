import { useInfiniteQuery } from "vue-query"
import { ref, computed } from 'vue'

const query = ( params, API, queryConfig = {} ) => {

  const page = ref( 1 )

  const fetchItems = ( { pageParam = 1 } ) => {
    var clonedParams = JSON.parse( JSON.stringify( params ) )
    clonedParams.page = pageParam;
    return API( clonedParams )
  }

  const { data, fetchNextPage, status, isFetchingNextPage } = useInfiniteQuery( ['OrbitQuery', params ], fetchItems, queryConfig )

  // COMPUTATION OF ITEMS FROM DATA PAGES
  const items = computed( () => {
    var arr = [];
    if( data.value && data.value.pages ){

      //console.log( data.value.pages )

      for( var index in data.value.pages ){
        if( data.value.pages[index].data ){
          for( var key in data.value.pages[index].data ){
            arr.push( data.value.pages[index].data[key] )
          }
        }
      }
    }
    return arr;
  } )

  const total = computed( () => {
    if( data.value && data.value.pages && data.value.pages[0] &&
      data.value.pages[0].headers && data.value.pages[0].headers['x-wp-total'] )
      return parseInt( data.value.pages[0].headers['x-wp-total'] )
    return 0
  } )

  const hasMorePages = computed( () => {
    if( data.value && data.value.pages && data.value.pages[0] &&
      data.value.pages[0].headers && data.value.pages[0].headers['x-wp-totalpages'] && data.value.pages.length < data.value.pages[0].headers['x-wp-totalpages'] )
      return true;
    return false;
  } )

  const loadMore = () => {
    //console.log( 'load more' )
    //console.log( hasMorePages.value )
    if( hasMorePages.value ){
      page.value += 1;

      //console.log( page.value )

      //console.log( isFetchingNextPage.value )

      fetchNextPage.value( { pageParam: page.value } )
    }
  }

  const scrollComponent = ref( null )

  const watchScroll = () => {
    let element = scrollComponent.value;
    if( !isFetchingNextPage.value && element && element.getBoundingClientRect().bottom < window.innerHeight ){
      loadMore();
    }
  }

  return {
    items,
    total,
    loadMore,
    hasMorePages,
    page,
    watchScroll,
    scrollComponent,
    status,
    fetchNextPage,
    isFetchingNextPage
  }
}

export default query
