<template>
  <div id="app"></div>
</template>

<script>
// import echarts from "echarts";
import ForceAtlas2GPU from "echarts-gl/src/chart/graphGL/ForceAtlas2GPU.js";

export default {
  name: "App",
  components: {},
  mounted() {
    // let force = new echarts.ForceAtlas2GPU();
    let force = new ForceAtlas2GPU();
    console.log(force);
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
