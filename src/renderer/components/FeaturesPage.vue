<template>
  <component :is="feature"/>
</template>

<script>
  import { mapState } from 'vuex'

  import InitFeature from './FeaturesPage/InitFeature'
  import VisuFeature from './FeaturesPage/VisuFeature'
  import AnimFeature from './FeaturesPage/AnimFeature'
  import VideoFeature from './FeaturesPage/VideoFeature'

  export default {
    name: 'features-page',
    components: {
      InitFeature,
      VisuFeature,
      AnimFeature,
      VideoFeature
    },

    computed: mapState({
      feature: state => `${state.feature.current}-feature`
    }),

    mounted: function () {
      this.$electron.ipcRenderer.on('send-feature', (event, feature) => {
        this.$store.commit('FEATURE_CHANGE', feature)
      })
    }
  }
</script>

<style scoped>

</style>
