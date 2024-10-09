<template>
  <img alt="Vue logo" src="./assets/logo.png">
<RouterView/>
</template>

<script>


export default {
  name: 'App',
  components: {
}
}
</script>

<style>

html, body , #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

}
#app {

  background-color: #313236;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #a9a9a9;


}

a {
        text-decoration: underline;
        cursor: pointer;
        color: orange;
    }

</style>
