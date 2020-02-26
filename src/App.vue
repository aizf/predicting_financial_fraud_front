<template>
  <div id="app">
    <div :style="{margin:'0 0 0 0'}">
      <a-card title="数设置据集" :style="{width: '500px',float:'left'}">
        <p>blackList</p>
        <a-checkbox :checked="blackList" @change="blackList=!blackList">blackList</a-checkbox>
        <a-divider />

        <p>selectedDims</p>
        <a-row>
          <a-col v-for="item in Object.keys(dims)" :span="6" :key="item">
            <a-checkbox :checked="dims[item]" @change="dims[item]=!dims[item]">{{item}}</a-checkbox>
          </a-col>
        </a-row>
        <a-divider />

        <p>train_test_ratio</p>
        <a-input-number :min="0" :max="1" :step="0.1" v-model="train_test_ratio" />
        <a-divider />

        <p>multiple</p>
        <a-input-number :min="0" :step="0.1" v-model="multiple" />
        <a-divider />
      </a-card>
      <a-card title="RandomForest" :style="{width: '360px',float:'left'}">
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
      <a-card title="LogisticRegression" :style="{width: '360px',float:'left'}">
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
    </div>

    <a-divider />
    <a-button type="primary" :loading="loading" @click="commit">commit</a-button>
    <a-divider />

    <p v-show="!!errors" :style="{color:'red'}">{{errors}}</p>

    <a-table :columns="columns" :dataSource="dataSource" bordered></a-table>
  </div>
</template>

<script>
// import echarts from "echarts";
import axios from "axios";

export default {
  name: "App",
  components: {},
  mounted() {
    document.title = "芮憨憨";
    // console.log(this);
  },
  data() {
    return {
      blackList: false,
      dims: {
        GAIN: false,
        LOSS: false,
        TATA1: false,
        TATA2: false,
        CHCS: false,
        OTHREC: false,
        GMI: false,
        GMIII: false,
        SGAI: false,
        CHROA: false,
        AQI: false,
        LVGI: false,
        DSRI: false,
        SGI: false,
        SOFTAS: false,
        CHINV: false,
        CHREC: false
      },
      train_test_ratio: 0.7,
      multiple: 1,
      n_estimators: 10,
      scores: {
        RandomForest: {
          label_0_score: "...",
          label_1_score: "...",
          score: "...",
          feature_importances: "..."
        },
        LogisticRegression: {
          label_0_score: "...",
          label_1_score: "...",
          score: "...",
          coef: "..."
        }
      },
      loading: false,
      decisionFun: "...",
      ifFixed: true,
      toFixed: 5,
      errors: null,
      res: {
        length: 0,
        dims: {
          GAIN: [],
          LOSS: [],
          TATA1: [],
          TATA2: [],
          CHCS: [],
          OTHREC: [],
          GMI: [],
          GMIII: [],
          SGAI: [],
          CHROA: [],
          AQI: [],
          LVGI: [],
          DSRI: [],
          SGI: [],
          SOFTAS: [],
          CHINV: [],
          CHREC: []
        },
        scores: {
          RandomForest: { label_0_score: [], label_1_score: [], score: [] },
          LogisticRegression: {
            label_0_score: [],
            label_1_score: [],
            score: []
          }
        }
      },

      methods: ["RandomForest", "LogisticRegression"],
      score_types: ["label_0_score", "label_1_score", "score"]
    };
  },
  computed: {
    selectedDims() {
      const dims = this.dims;
      const selectedDims = [];
      Object.keys(dims).forEach(d => {
        if (dims[d]) {
          selectedDims.push(d);
        }
      });
      return selectedDims;
    },
    columns() {
      const dims = Object.keys(this.dims);

      const col0 = [
        {
          title: "dims",
          children: dims.map(d => ({
            title: d,
            dataIndex: d
          }))
        }
      ];

      const col1 = this.methods.map(method => {
        return {
          title: method,
          children: this.score_types.map(type => ({
            title: type,
            dataIndex: method + type
          }))
        };
      });

      return [...col0, ...col1];
    },
    dataSource() {
      const dims = Object.keys(this.dims);
      const dicts = [];
      const n = this.res.length;
      for (let i = 0; i < n; i++) {
        const dict = { key: i };
        dims.forEach(dim => {
          dict[dim] = this.res.dims[dim][i];
        });
        this.methods.forEach(method => {
          this.score_types.forEach(type => {
            dict[method + type] = this.res.scores[method][type][i];
          });
        });
        dicts.push(dict);
      }

      return dicts;
    }
  },
  methods: {
    commit() {
      this.loading = true;
      this.errors = null;
      axios
        // .post("http://49.233.132.179:5000/predicting_financial_fraud", {
        .post("http://localhost:5000/predicting_financial_fraud", {
          blackList: this.blackList,
          selectedDims: this.selectedDims,
          train_test_ratio: this.train_test_ratio,
          multiple: this.multiple,
          n_estimators: this.n_estimators
        })
        .then(response => {
          // console.log(response);
          let data = response.data;
          // console.log(data);
          this.scores = data;
          this.saveRes();

          this.loading = false;

          this.getDecisionFun();
        })
        .catch(error => {
          // 请求失败处理
          this.loading = false;
          this.errors = error;
          // console.log(error);
          alert("bug了,芮憨憨！！！");
        });
    },
    saveRes() {
      const { dims, scores } = this.res;
      // dims
      Object.keys(dims).forEach(d => {
        if (this.dims[d]) {
          dims[d].push(1);
        } else {
          dims[d].push(0);
        }
      });
      // scores
      const methods = this.methods;
      const score_types = this.score_types;
      methods.forEach(method => {
        score_types.forEach(type => {
          scores[method][type].push(this.scores[method][type]);
        });
      });
      this.res.length++;
    },
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
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0px 3% 0 3%;
  padding-top: 20px;
}
</style>
