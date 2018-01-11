<template>
  <div :class="`cont ${this.modifier}`">
    <div class="border"></div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'init-feature',

    computed: mapState({
      modifier: state => state.feature.modifier
    })
  }
</script>

<style scoped>
  .cont {
    width: 100%;
    height: 100vh;
    padding: 3em;
    background: white;
  }

  .cont.black {
    background: black;
  }

  .border {
    width: 100%;
    height: 100%;
    border: 3em black solid;
  }
</style>
