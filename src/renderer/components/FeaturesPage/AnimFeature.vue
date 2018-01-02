<template>
  <div class="cont">
    <img :src="`static/features/anim/${this.modifier}.gif`">
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'anim-feature',

    computed: mapState({
      modifier: state => state.feature.modifier
    })
  }
</script>

<style scoped>
  .cont {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: space-around;
    height: 100vh;
    width: 100%;
    background: black;
  }

  .cont img {
    max-height: 100vh;
  }

</style>
