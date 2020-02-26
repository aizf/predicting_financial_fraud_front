<template>
  <a-card title="RandomForest">
    <p>n_estimators</p>
    <a-input-number :min="1" :step="1" v-model="n_estimators" />
    <a-divider />
    <p>特征重要性</p>
    <a-row>
      <a-col :span="12">
        <a-row v-for="dim in selectedDims" :key="dim">{{dim}}</a-row>
      </a-col>

      <a-col :span="12">
        <a-row v-for="(fi,index) in scores.RandomForest.feature_importances" :key="index">{{fi}}</a-row>
      </a-col>
    </a-row>
    <a-divider />
    <a-row>
      <a-col :span="12">
        <p>未舞弊公司正确预测率：</p>
      </a-col>
      <a-col :span="12">
        <p>{{scores.RandomForest.label_0_score}}</p>
      </a-col>
      <a-col :span="12">
        <p>舞弊公司正确预测率：</p>
      </a-col>
      <a-col :span="12">
        <p>{{scores.RandomForest.label_1_score}}</p>
      </a-col>
      <a-col :span="12">
        <p>总体正确预测率：</p>
      </a-col>
      <a-col :span="12">
        <p>{{scores.RandomForest.score}}</p>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  name: "VRandomForest",
  props: {
    scores: Object,
    selectedDims: Array
  },
  data() {
    return { n_estimators: 10 };
  },
  methods: {},
  watch: {}
};
</script>

<style scoped>
</style>
