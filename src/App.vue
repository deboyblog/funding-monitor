<template>
  <div id="app">
    <AppHeader />
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppHeader from "./components/AppHeader.vue";

@Component({
  components: {
    AppHeader
  }
})
export default class App extends Vue {}
</script>
<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  height: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: transparent;
}
</style>
