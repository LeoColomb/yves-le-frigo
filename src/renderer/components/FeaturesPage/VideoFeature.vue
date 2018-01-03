<template>
  <div class="cont">
    <video id="video-element" autoplay="autoplay">
      <source type="video/mp4" :src="`static/features/video/${this.modifier}.mp4`"/>
    </video>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'video-feature',

    computed: {
      ...mapState({
        modifier: state => state.feature.modifier
      }),
      ...mapGetters('feature', [
        'getModifierState'
      ])
    },

    mounted: () => {
      const video = document.getElementById('video-element')
      this.$store.watch(this.getModifierState, () => video.load())
    }
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

  .cont video {
    max-height: 100vh;
  }

</style>
