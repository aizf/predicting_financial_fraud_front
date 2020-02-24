<template>
  <div id="app">
    <p>blackList</p>
    <a-checkbox :checked="blackList" @change="blackList=!blackList">blackList</a-checkbox>
    <a-divider />

    <p>selectedDims</p>
    <a-checkbox
      v-for="item in Object.keys(dims)"
      :checked="dims[item]"
      @change="dims[item]=!dims[item]"
      :key="item"
    >{{item}}</a-checkbox>
    <a-divider />

    <p>train_test_ratio</p>
    <a-input-number :min="0" :max="1" :step="0.1" v-model="train_test_ratio" />
    <a-divider />

    <p>multiple</p>
    <a-input-number :min="0" :step="0.1" v-model="multiple" />
    <a-divider />

    <p>n_estimators</p>
    <a-input-number :min="1" :step="1" v-model="n_estimators" />
    <a-divider />

    <a-button type="primary" :loading="loading" @click="commit">commit</a-button>
    <a-divider />
    <a-divider />

    <p>未舞弊公司正确预测率：{{label_0_score}}</p>
    <p>舞弊公司正确预测率：{{label_1_score}}</p>
    <p>总体正确预测率：{{score}}</p>
    <p :style="{color:'red'}">{{errors}}</p>

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
      label_0_score: null,
      label_1_score: null,
      score: null,
      loading: false,
      errors: null,
      res: {
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
        label_0_score: [],
        label_1_score: [],
        score: []
      }
    };
  },
  computed: {
    columns() {
      const keys_0 = Object.keys(this.dims);
      const keys_1 = ["label_0_score", "label_1_score", "score"];
      const keys = [...keys_0, ...keys_1];

      return keys.map(d => ({
        title: d,
        dataIndex: d,
        key: d
      }));
    },
    dataSource() {
      const keys_0 = Object.keys(this.dims);
      return this.res.label_0_score.map((d, i) => {
        const dict = { key: i };

        keys_0.forEach(d => {
          dict[d] = this.res.dims[d][i];
        });

        dict["label_0_score"] = this.res.label_0_score[i];
        dict["label_1_score"] = this.res.label_1_score[i];
        dict["score"] = this.res.score[i];

        return dict;
      });
    }
  },
  methods: {
    commit() {
      this.loading = true;
      this.errors = null;
      axios
        .post("http://49.233.132.179:5000/predicting_financial_fraud", {
        // .post("http://localhost:5000/predicting_financial_fraud", {
          blackList: this.blackList,
          selectedDims: this.getDims(this.dims),
          train_test_ratio: this.train_test_ratio,
          multiple: this.multiple,
          n_estimators: this.n_estimators
        })
        .then(response => {
          // console.log(response);
          let data = response.data;
          // console.log(data);
          this.label_0_score = data["label_0_score"];
          this.label_1_score = data["label_1_score"];
          this.score = data["score"];
          this.saveRes();
          this.loading = false;
        })
        .catch(error => {
          // 请求失败处理
          this.loading = false;
          this.errors = error;
          // console.log(error);
        });
    },
    getDims(dims) {
      const selectedDims = [];
      Object.keys(dims).forEach(d => {
        if (dims[d]) {
          selectedDims.push(d);
        }
      });
      return selectedDims;
    },
    saveRes() {
      const { dims, label_0_score, label_1_score, score } = this.res;

      Object.keys(dims).forEach(d => {
        if (this.dims[d]) {
          dims[d].push(1);
        } else {
          dims[d].push(0);
        }
      });

      label_0_score.push(this.label_0_score);
      label_1_score.push(this.label_1_score);
      score.push(this.score);
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
  margin: 0px 100px 0 100px;
  padding-top: 20px;
}
</style>
