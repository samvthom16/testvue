import { useInfiniteQuery } from "vue-query"
import { ref, computed } from 'vue'

const query = ( params, API, queryConfig = {} ) => {

  const page = ref( 1 )

  const fetchItems = ( { pageParam = 1 } ) => {
    var clonedParams = JSON.parse( JSON.stringify( params ) )
    clonedParams.page = pageParam;
    return API( clonedParams )
  }

  const { data, fetchNextPage, status } = useInfiniteQuery( ['OrbitQuery', params ], fetchItems, queryConfig )

  // COMPUTATION OF ITEMS FROM DATA PAGES
  const items = computed( () => {
    var arr = [];
    if( data.value && data.value.pages ){
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

  const hasMorePages = computed( () => {
    if( data.value && data.value.pages && data.value.pages[0] &&
      data.value.pages[0].headers && data.value.pages[0].headers['x-wp-totalpages'] && page.value < data.value.pages[0].headers['x-wp-totalpages'] )
      return true;
    return false;
  } )

  const loadMore = () => {
    if( hasMorePages.value ){
      page.value += 1;
      fetchNextPage.value( { pageParam: page.value } )
    }
  }

  const scrollComponent = ref( null )

  const watchScroll = () => {
    let element = scrollComponent.value;
    if( element && element.getBoundingClientRect().bottom < window.innerHeight ){
      loadMore();
    }
  }

  return {
    items,
    loadMore,
    hasMorePages,
    page,
    watchScroll,
    scrollComponent,
    status,
    fetchNextPage
  }
}

export default query
