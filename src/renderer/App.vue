<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'yves-le-frigo'
  }
</script>

<style>
  :not(input):not(textarea),
  :not(input):not(textarea)::after,
  :not(input):not(textarea)::before {
    -webkit-user-select: none;
    user-select: none;
    cursor: default;
  }
  a:not([draggable=true]), img:not([draggable=true]) {
    -webkit-user-drag: none;
    user-drag: none;
  }
  a[href^="http://"],
  a[href^="https://"],
  a[href^="ftp://"] {
    -webkit-user-drag: auto;
    user-drag: auto;
  }

  html, body, #app {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
</style>
