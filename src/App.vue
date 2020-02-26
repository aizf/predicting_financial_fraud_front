<template>
  <div id="app">
    <div :style="{margin:'0 0 0 0'}">
      <VDataSet
        ref="VDataSet"
        :dims="dims"
        @selectedDimsChange="handleSelectedDimsChange"
        :style="{width: '500px',float:'left'}"
      />
      <VRandomForest
        ref="VRandomForest"
        :scores="scores"
        :selectedDims="selectedDims"
        :style="{width: '360px',float:'left'}"
      />
      <VLogisticRegression
        :scores="scores"
        :selectedDims="selectedDims"
        :newClf="newClf"
        :style="{width: '360px',float:'left'}"
      />
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
import VDataSet from "@/components/VDataSet.vue";
import VRandomForest from "@/components/VRandomForest.vue";
import VLogisticRegression from "@/components/VLogisticRegression.vue";

export default {
  name: "App",
  components: { VDataSet, VRandomForest, VLogisticRegression },
  mounted() {
    document.title = "芮憨憨";
    // console.log(this);
  },
  data() {
    return {
      dims: [
        "GAIN",
        "LOSS",
        "TATA1",
        "TATA2",
        "CHCS",
        "OTHREC",
        "GMI",
        "GMIII",
        "SGAI",
        "CHROA",
        "AQI",
        "LVGI",
        "DSRI",
        "SGI",
        "SOFTAS",
        "CHINV",
        "CHREC"
      ],
      selectedDims: [],
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

      newClf: false,
      loading: false,
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
    columns() {
      const dims = this.dims;

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
      const dims = this.dims;
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
      this.newClf = false;
      axios
        // .post("http://49.233.132.179:5000/predicting_financial_fraud", {
        .post("http://localhost:5000/predicting_financial_fraud", {
          blackList: this.$refs.VDataSet.blackList,
          selectedDims: this.selectedDims,
          train_test_ratio: this.$refs.VDataSet.train_test_ratio,
          multiple: this.$refs.VDataSet.multiple,
          n_estimators: this.$refs.VRandomForest.n_estimators
        })
        .then(response => {
          // console.log(response);
          let data = response.data;
          // console.log(data);
          this.scores = data;
          this.saveRes();

          this.newClf = true;
          this.loading = false;
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
      this.dims.forEach(d => {
        if (this.$refs.VDataSet.dimStatus[d]) {
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
    handleSelectedDimsChange(selectedDims) {
      this.selectedDims = selectedDims;
      // console.log(this.selectedDims);
    }
  },
  watch: {}
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
