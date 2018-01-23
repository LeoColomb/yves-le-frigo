<template>
  <div class="cont">
    <img src="static/features/image/clip.png"/>
  </div>
</template>

<script>
  export default {
    name: 'image-feature'
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
  }

  .cont img {
    width: auto;
    height: 80vh;
  }
</style>
