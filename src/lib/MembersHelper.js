import {ref} from 'vue'

const membershelper = ( style = 'ListWithImage', event_id = 0 ) => {

  const totalItems = ref( 0 )

  const params = ref( {
    unique_id   : 1,
    per_page    : 10,
    post_type   : 'inpursuit-members',
    style       : style,
    orderby     : 'title',
    order       : 'asc',
    pagination  : 1,
    search      : ''
  } )

  if( event_id ){
    params.value.event_id = event_id
  }

  const onSearch = ( searchText ) => {
    params.value.search = searchText
    params.value.unique_id++;
  }

  const selectDropdownItem = ( data ) => {

    params.value[ data.name ] = data.value

    if( data.name == 'orderby' && data.value == 'title' ) params.value.order = 'asc'
    if( data.name == 'orderby' && data.value == 'id' ) params.value.order = 'desc'

    if( data.name == 'member_status' && data.value == 'all' ) params.value.member_status = ''

    if( data.name == 'status' && data.value == 'all' ) params.value.status = 'publish,draft'

    params.value.unique_id++;
  }
  
  const totalChanged = ( total ) => totalItems.value = total

  return {
    params,
    onSearch,
    selectDropdownItem,
    totalChanged,
    totalItems
  }
}

export default membershelper
