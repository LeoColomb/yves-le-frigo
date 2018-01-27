<template>
  <component :is="feature" class="compo"/>
</template>

<script>
  import { mapState } from 'vuex'

  import InitFeature from './FeaturesPage/InitFeature'
  import VisuFeature from './FeaturesPage/VisuFeature'
  import VideoFeature from './FeaturesPage/VideoFeature'
  import ImageFeature from './FeaturesPage/ImageFeature'
  import VeilleFeature from './FeaturesPage/VeilleFeature'

  export default {
    name: 'features-page',
    components: {
      InitFeature,
      VisuFeature,
      VideoFeature,
      ImageFeature,
      VeilleFeature
    },

    computed: mapState({
      feature: state => `${state.feature.current}-feature`
    }),

    mounted: function () {
      this.$electron.ipcRenderer.on('send-feature', (event, feature) => {
        this.$store.commit('FEATURE_CHANGE', feature)
      })
      this.$electron.ipcRenderer.on('send-action', (event, action) => {
        this.$store.commit('ACTION_CHANGE', action)
      })
    }
  }
</script>

<style scoped>
  .compo {
    border: none;
  }
</style>
