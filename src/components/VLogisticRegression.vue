<template>
  <a-card title="LogisticRegression">
    <a-tabs :defaultActiveKey="LR_type" @change="tabsChange">
      <a-tab-pane tab="use model func" key="1" forceRender>
        <p>{{decisionFun}}</p>
        <a-checkbox :checked="ifFixed" @change="ifFixed=!ifFixed"></a-checkbox>
        <span>toFixed</span>
        <a-input-number :min="0" :disabled="!ifFixed" v-model="toFixed" />
      </a-tab-pane>

      <a-tab-pane tab="use customize func" key="2" forceRender>
        <a-row v-for="dim in selectedDims" :key="dim">
          <a-col :span="17">
            <a-input-number size="small" v-model="custCoef[dim]" :style="{width:'90%'}" />
          </a-col>
          <a-col :span="2">
            <span>*</span>
          </a-col>
          <a-col :span="5">{{dim}}</a-col>
        </a-row>
        <a-col :span="17">
          <a-input-number size="small" v-model="custIntercept" :style="{width:'90%'}" />
        </a-col>
      </a-tab-pane>
    </a-tabs>

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
    return {
      decisionFun: "...",
      ifFixed: true,
      toFixed: 5,
      custCoef: {
        DEPI: 0,
        GAIN: 0,
        LOSS: 0,
        TATA1: 0,
        TATA2: 0,
        CHCS: 0,
        OTHREC: 0,
        GMI: 0,
        GMIII: 0,
        SGAI: 0,
        CHROA: 0,
        AQI: 0,
        LVGI: 0,
        DSRI: 0,
        SGI: 0,
        SOFTAS: 0,
        CHINV: 0,
        CHREC: 0
      },
      custIntercept: 0,
      LR_type: "1"
    };
  },
  computed: {},
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

      this.resetCustCoefInter(coefficient, intercept);
    },
    resetCustCoefInter(coefficient, intercept) {
      // 重置自定义参数

      this.selectedDims.forEach((dim, i) => {
        this.custCoef[dim] = coefficient[i];
      });
      this.custIntercept = intercept;
    },
    tabsChange(key) {
      // console.log(typeof(key));
      this.LR_type = key;
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
