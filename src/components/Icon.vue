<template>
  <svg
    v-if="type == 'filter'"
    version="1.1"
    class="w-8"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 100 100"
    style="enable-background: new 0 0 100 100"
    xml:space="preserve"
  >
    <g id="Layer_1"></g>
    <g id="Layer_2">
      <path
        d="M59.5,61.5v15c0,1.3-1.1,2.4-2.4,2.4h-0.1c-1.3,0-2.4-1.1-2.4-2.4v-15c0-1.3,1.1-2.4,2.4-2.4h0.1
      C58.4,59.1,59.5,60.2,59.5,61.5z"
      />
      <path
        d="M30.5,42.6v15c0,1.3-1.1,2.4-2.4,2.4H28c-1.3,0-2.4-1.1-2.4-2.4v-15c0-1.3,1.1-2.4,2.4-2.4h0.1
      C29.4,40.2,30.5,41.2,30.5,42.6z"
      />
      <path
        d="M65.9,23.5v15c0,1.3-1.1,2.4-2.4,2.4h-0.1c-1.3,0-2.4-1.1-2.4-2.4v-15c0-1.3,1.1-2.4,2.4-2.4h0.1
      C64.9,21.2,65.9,22.2,65.9,23.5z"
      />
      <path
        d="M63.1,33.5H23.2c-1.2,0-2.1-0.9-2.1-2.1v-0.7c0-1.2,0.9-2.1,2.1-2.1h39.9c1.2,0,2.1,0.9,2.1,2.1v0.7
      C65.2,32.5,64.3,33.5,63.1,33.5z"
      />
      <path
        d="M76.8,52.5H36.9c-1.2,0-2.1-0.9-2.1-2.1v-0.7c0-1.2,0.9-2.1,2.1-2.1h39.9c1.2,0,2.1,0.9,2.1,2.1v0.7
      C78.9,51.6,78,52.5,76.8,52.5z"
      />
      <path
        d="M55.6,71.4H23.2c-1.2,0-2.1-0.9-2.1-2.1v-0.7c0-1.2,0.9-2.1,2.1-2.1h32.4c1.2,0,2.1,0.9,2.1,2.1v0.7
      C57.7,70.5,56.7,71.4,55.6,71.4z"
      />
      <path
        d="M76.5,71.4H65.9c-1.4,0-2.4-1.1-2.4-2.4v0c0-1.4,1.1-2.4,2.4-2.4h10.6c1.4,0,2.4,1.1,2.4,2.4v0
      C78.9,70.3,77.8,71.4,76.5,71.4z"
      />
      <path
        d="M28,52.5h-4.8c-1.2,0-2.1-0.9-2.1-2.1v-0.7c0-1.2,0.9-2.1,2.1-2.1H28c1.2,0,2.1,0.9,2.1,2.1v0.7
      C30.1,51.6,29.2,52.5,28,52.5z"
      />
      <path
        d="M76.8,33.5h-4.1c-1.2,0-2.1-0.9-2.1-2.1v-0.7c0-1.2,0.9-2.1,2.1-2.1h4.1c1.2,0,2.1,0.9,2.1,2.1v0.7
      C78.9,32.5,78,33.5,76.8,33.5z"
      />
    </g>
  </svg>

  <!-- HOME ICON -->
  <svg
    v-else-if="type == 'Home'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg"

    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>

  <svg
    v-else-if="type == 'Event'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd" />
  </svg>



  <!-- PROFILE ICON -->
  <svg
    v-else-if="type == 'Profile'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg"

    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>

  <!-- LOCATION ICON -->
  <svg
    v-else-if="type == 'Location'"
    xmlns="http://www.w3.org/2000/svg"
    class="w-4 inline"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>

  <!-- GENDER (PERSON) ICON -->
  <svg
    v-else-if="type == 'Gender'"
    xmlns="http://www.w3.org/2000/svg"
    class="w-4 inline"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>

  <!-- GROUP ICON -->
  <svg
    v-else-if="type == 'Group'"
    xmlns="http://www.w3.org/2000/svg"
    class="w-4 inline"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>

  <!-- PROFESSION ICON -->
  <svg
    v-else-if="type == 'Profession'"
    xmlns="http://www.w3.org/2000/svg"
    class="w-4 inline"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>

  <!-- STATUS ICON -->
  <svg
    v-else-if="type == 'Status'"
    xmlns="http://www.w3.org/2000/svg"
    class="w-4 inline"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>

  <!-- ERROR ICON -->
  <svg
    v-else-if="type == 'Error'"
    class="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
      clip-rule="evenodd"
    ></path>
  </svg>

  <!-- CLOSE ICON -->
  <svg
    v-else-if="type == 'Close'"
    class="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clip-rule="evenodd"
    ></path>
  </svg>

  <!-- HISTORY (PLAY) ICON -->
  <svg
    v-else-if="type == 'History'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>

  <!-- COMMENT (MESSAGE) ICON -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    v-else-if="type == 'Comment'"
    v-bind="$attrs"
    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
  </svg>


  <!-- DELETE ICON -->
  <svg
    v-else-if="type == 'Delete'"
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
  <svg
    v-else-if="type == 'Back'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  <svg
    v-else-if="type == 'Plus'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
  </svg>
  <svg
    v-else-if="type == 'CircularLoader'"
    class="animate-spin h-5 w-5 text-white mr-2"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
  <svg
    v-else-if="type == 'Clock'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <svg
    v-else-if="type == 'Members'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
  <svg
    v-else-if="type == 'Check'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
  </svg>
  <svg
    v-else-if="type == 'Chevron-Down'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
  <svg
    v-else-if="type == 'Edit'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
  <svg
    v-else-if="type == 'Archive'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
  <svg
    v-else-if="type == 'Search'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg" class="" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
  <svg
    v-else-if="type == 'Right-Arrow'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#aaa" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
  </svg>
  <svg
    v-else-if="type == 'Single-User'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
  <svg
    v-else-if="type == 'Team'"
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg"
    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
  </svg>
</template>
<script>
export default {
  props: {
    type: String,
  },
};
</script>
