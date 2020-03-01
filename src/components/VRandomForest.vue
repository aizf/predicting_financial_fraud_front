<template>
  <a-card title="RandomForest">
    <p>n_estimators</p>
    <a-input-number :min="1" :step="1" v-model="n_estimators" />
    <a-divider />
    <p>特征重要性</p>
    <a-row v-for="(val, key) in feature_importances" :key="key">
      <a-col :span="12">{{key}}</a-col>
      <a-col :span="12">{{val}}</a-col>
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
    scores: Object
  },
  data() {
    return { n_estimators: 10 };
  },
  computed: {
    feature_importances() {
      // console.log(this.scores.RandomForest.feature_importances);
      return this.scores.RandomForest.feature_importances;
    }
  },
  methods: {},
  watch: {}
};
</script>

<style scoped>
</style>
