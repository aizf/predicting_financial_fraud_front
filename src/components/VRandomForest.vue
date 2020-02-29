<template>
  <a-card title="RandomForest">
    <p>n_estimators</p>
    <a-input-number :min="1" :step="1" v-model="n_estimators" />
    <a-divider />
    <p>特征重要性</p>
    <a-row v-for="dim in selectedDims" :key="dim">
      <a-col :span="12">{{dim}}</a-col>
      <a-col :span="12">{{scores.RandomForest.feature_importances[dims.indexOf(dim)]}}</a-col>
    </a-row>
    <a-divider />
    <p>测试集</p>
    <a-row>
      <a-col :span="12">
        <p>未舞弊公司正确预测率：</p>
      </a-col>
      <a-col :span="12">
        <p>{{scores.RandomForest.label_0_score_test}}</p>
      </a-col>
      <a-col :span="12">
        <p>舞弊公司正确预测率：</p>
      </a-col>
      <a-col :span="12">
        <p>{{scores.RandomForest.label_1_score_test}}</p>
      </a-col>
      <a-col :span="12">
        <p>总体正确预测率：</p>
      </a-col>
      <a-col :span="12">
        <p>{{scores.RandomForest.score_test}}</p>
      </a-col>
    </a-row>
    <a-divider />
    <p>训练集</p>
    <a-row>
      <a-col :span="12">
        <p>未舞弊公司正确预测率：</p>
      </a-col>
      <a-col :span="12">
        <p>{{scores.RandomForest.label_0_score_train}}</p>
      </a-col>
      <a-col :span="12">
        <p>舞弊公司正确预测率：</p>
      </a-col>
      <a-col :span="12">
        <p>{{scores.RandomForest.label_1_score_train}}</p>
      </a-col>
      <a-col :span="12">
        <p>总体正确预测率：</p>
      </a-col>
      <a-col :span="12">
        <p>{{scores.RandomForest.score_train}}</p>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  name: "VRandomForest",
  props: {
    scores: Object,
    dims: Array,
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
