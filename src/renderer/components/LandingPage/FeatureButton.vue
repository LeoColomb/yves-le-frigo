<template>
  <button :class="`button is-medium is-${color}`">
    <span>
      <img :src="imageUrl">
    </span>
    {{ fullName }}
  </button>
</template>

<script>
  export default {
    name: 'feature-button',

    props: {
      feature: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      fullName: {
        type: String,
        required: true
      }

    },

    data () {
      return {
        imageUrl: `static/home/${this.feature}.png`
      }
    }
  }
</script>

<style scoped>
  button {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    height: auto;
    text-align: center;
    text-wrap: normal;
  }

  /*button > span {
    width: 100%;
  }*/

  button img {
    max-width: 60%;
    max-height: 4em;
    margin-top: 0.5em;
    margin-bottom: 0.2em;
  }
</style>
