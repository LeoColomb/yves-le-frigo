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
    })
  }
</script>

<style scoped>

</style>
