const helper = () => {

  var debounce = null

  const debounceEvent = ( callback, timeout = 600 ) => {
    clearTimeout( debounce );
    debounce = setTimeout(() => {
      callback();
    }, timeout );
  }

  return {
    debounceEvent
  }
}

export default helper
