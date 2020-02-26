<template>
  <a-card title="LogisticRegression">
    <p>123213213</p>
    <!-- <a-input-number :min="1" :step="1" v-model="n_estimators" /> -->
    <a-divider />
    <p>decision function</p>
    <p>{{decisionFun}}</p>
    <a-checkbox :checked="ifFixed" @change="ifFixed=!ifFixed"></a-checkbox>
    <span>toFixed</span>
    <a-input-number :min="0" :disabled="!ifFixed" v-model="toFixed" />
    <a-divider />
    <a-row>
      <a-col :span="12">
        <p>未舞弊公司正确预测率：</p>
      </a-col>
      <a-col :span="12">
        <p>{{scores.LogisticRegression.label_0_score}}</p>
      </a-col>
      <a-col :span="12">
        <p>舞弊公司正确预测率：</p>
      </a-col>
      <a-col :span="12">
        <p>{{scores.LogisticRegression.label_1_score}}</p>
      </a-col>
      <a-col :span="12">
        <p>总体正确预测率：</p>
      </a-col>
      <a-col :span="12">
        <p>{{scores.LogisticRegression.score}}</p>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  name: "VLogisticRegression",
  props: {
    scores: Object,
    selectedDims: Array,
    newClf: Boolean
  },
  data() {
    return { decisionFun: "...", ifFixed: true, toFixed: 5 };
  },
  methods: {
    getDecisionFun() {
      const selectedDims = this.selectedDims;
      const n = selectedDims.length;
      // 数组合并比字符串相加快
      const coefStr = [];
      const coefficient = this.scores.LogisticRegression.coef[0];
      // console.log(this.scores.LogisticRegression.coef);
      const intercept = this.scores.LogisticRegression.intercept[0];
      // console.log(this.scores.LogisticRegression.intercept);

      for (let i = 0; i < n; i++) {
        if (coefficient[i] >= 0 && i != 0) {
          coefStr.push(" + ");
        }
        coefStr.push(
          this.ifFixed ? coefficient[i].toFixed(this.toFixed) : coefficient[i]
        );
        coefStr.push(" * ");
        coefStr.push(selectedDims[i]);
      }

      if (intercept >= 0) {
        coefStr.push(" + ");
      }
      coefStr.push(this.ifFixed ? intercept.toFixed(this.toFixed) : intercept);

      // console.log(coefStr);
      this.decisionFun = coefStr.join("");
    }
  },
  watch: {
    ifFixed() {
      if (this.scores.LogisticRegression.coef === "...") {
        return;
      }
      this.getDecisionFun();
    },
    toFixed() {
      if (this.scores.LogisticRegression.coef === "...") {
        return;
      }
      this.getDecisionFun();
    },
    newClf(val) {
      if (val) {
        this.getDecisionFun();
      }
    }
  }
};
</script>

<style scoped>
</style>
