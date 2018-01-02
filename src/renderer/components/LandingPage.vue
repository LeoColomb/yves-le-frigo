<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
      <feature-button feature="visu" color="info" full-name="Voix normale"/>
      <feature-button feature="visu" color="danger" full-name="Voix peur"/>
      <feature-button feature="visu" color="primary" full-name="Voix douce"/>
      <feature-button feature="visu" color="warning" full-name="Voix Julien Lepers"/>
      <feature-button feature="visu" color="success" full-name="Voix émotion"/>
      <feature-button feature="visu-chant" color="link" full-name="Voix chantée"/>

      <feature-button feature="anim-gateau" color="black" full-name="Gâteau"/>
      <feature-button feature="anim-3d" color="black" full-name="Femme en 3D"/>
      <feature-button feature="anim-cravate" color="black" full-name="Cravate"/>
      <feature-button feature="anim-produit" color="black" full-name="Produits"/>
      <feature-button feature="anim-echecs" color="black" full-name="Voix normale"/>
      <feature-button feature="anim-echecs" color="black" full-name="Jeu d'échecs"/>

      <feature-button feature="battery" color="dark" full-name="Batterie faible"/>
    </main>
  </div>
</template>

<script>
  import FeatureButton from './LandingPage/FeatureButton'

  export default {
    name: 'landing-page',
    components: { FeatureButton },
    methods: {
      open (link) {
        this.$electron.remote.getCurrentWindow().getParentWindow().loadURL(link)
      }
    }
  }
</script>

<style>
  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 3em 3em;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 200px;
  }

  main {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  main > button {
    flex-grow: 1;
    min-width: 10em;
    margin-bottom: 1em;
    margin-right: 1em;
  }
</style>
