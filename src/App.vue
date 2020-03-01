<template>
  <div id="app">
    <div :style="{margin:'0 0 0 0'}">
      <VDataSet
        ref="VDataSet"
        :dims="dims"
        @getDims="handleGetDims"
        @selectedDimsChange="handleSelectedDimsChange"
        :style="{width: '500px',float:'left'}"
      />
      <VRandomForest
        ref="VRandomForest"
        :scores="scores"
        :style="{width: '360px',float:'left'}"
      />
      <VLogisticRegression
        ref="VLogisticRegression"
        :scores="scores"
        :selectedDims="selectedDims"
        :newClf="newClf"
        :style="{width: '360px',float:'left'}"
      />
    </div>

    <a-divider />
    <div class="float-right">
      <a-button :loading="loadingDownload" @click="download">Download Table</a-button>
      <a-button type="primary" :loading="loadingCommit" @click="commit">commit</a-button>
    </div>
    <a-divider />

    <p v-show="!!errors" :style="{color:'red'}">{{errors}}</p>

    <a-table :columns="columns" :dataSource="dataSource" bordered></a-table>
  </div>
</template>

<script>
// import echarts from "echarts";
import * as XLSX from "xlsx";
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
      dims: [],
      selectedDims: [],
      scores: {
        RandomForest: {
          label_0_score_test: "...",
          label_1_score_test: "...",
          score_test: "...",
          label_0_score_train: "...",
          label_1_score_train: "...",
          score_train: "...",
          feature_importances: "..."
        },
        LogisticRegression: {
          label_0_score_test: "...",
          label_1_score_test: "...",
          score_test: "...",
          label_0_score_train: "...",
          label_1_score_train: "...",
          score_train: "...",
          coef: "..."
        }
      },

      newClf: false,
      loadingDownload: false,
      loadingCommit: false,
      errors: null,

      results: [],
      methods: ["RandomForest", "LogisticRegression"],
      score_types: [
        "label_0_score_test",
        "label_1_score_test",
        "score_test",
        "label_0_score_train",
        "label_1_score_train",
        "score_train"
      ]
    };
  },
  computed: {
    columns() {
      const cols = [];
      // dims
      const dims = this.dims;
      cols.push([
        {
          title: "dims",
          children: dims.map(d => ({
            title: d,
            dataIndex: d
          }))
        }
      ]);

      // number of dataset
      cols.push(
        ["train_noFraud", "train_fraud", "test_noFraud", "test_Fraud"].map(
          d => ({
            title: d,
            dataIndex: d
          })
        )
      );

      // scores
      cols.push(
        this.methods.map(method => {
          return {
            title: method,
            children: this.score_types.map(type => ({
              title: type,
              dataIndex: method + type
            }))
          };
        })
      );

      return cols.reduce((res, d, i) => {
        if (i === 0) {
          return (res = d);
        }
        return (res = [...res, ...d]);
      });
    },
    dataSource() {
      return this.results.map((res, i) => {
        return { ...res, key: i };
      });
    }
  },
  methods: {
    commit() {
      this.loadingCommit = true;
      this.errors = null;
      this.newClf = false;

      this.getPredicting()
        .then(pred => {
          this.$refs.VDataSet.getDatasetOverview().then(dso => {
            this.$refs.VDataSet.handleDatasetOverview(dso.data);
            this.saveRes();
            this.newClf = true;
            this.loadingCommit = false;
          });
          this.handlePredicting(pred.data);
        })
        .catch(error => {
          // 请求失败处理
          this.loadingCommit = false;
          this.errors = error;
          // console.log(error);
          alert("bug了,芮憨憨！！！");
        });

      // axios
      //   .all([this.getPredicting(), this.$refs.VDataSet.getDatasetOverview()])
      //   .then(
      //     axios.spread((pred, dso) => {
      //       // console.log(pred);
      //       console.log(dso);
      //       this.handlePredicting(pred.data);
      //       this.$refs.VDataSet.handleDatasetOverview(dso.data);
      //       this.newClf = true;
      //       this.loadingCommit = false;
      //     })
      //   )
      //   .catch(error => {
      //     // 请求失败处理
      //     this.loadingCommit = false;
      //     this.errors = error;
      //     // console.log(error);
      //     alert("bug了,芮憨憨！！！");
      //   });
    },
    getPredicting() {
      const LR_type = this.$refs.VLogisticRegression.LR_type;
      const data = {
        blackList: this.$refs.VDataSet.blackList,
        selectedDims: this.selectedDims,
        train_ratio: this.$refs.VDataSet.train_ratio,
        multiple: this.$refs.VDataSet.multiple,
        n_estimators: this.$refs.VRandomForest.n_estimators,
        LR_type: LR_type
      };
      if (LR_type === "2") {
        data["coefficient"] = this.selectedDims.map(dim => {
          return this.$refs.VLogisticRegression.custCoef[dim];
        });
        data["intercept"] = this.$refs.VLogisticRegression.custIntercept;
      }
      return this.$axios.post("/predicting_financial_fraud", data);
    },
    handleGetDims({ errors, dims }) {
      if (errors) {
        this.errors = errors;
      } else {
        this.dims = dims;
      }
    },
    handlePredicting(data) {
      this.scores = data;
    },
    handleSelectedDimsChange(selectedDims) {
      this.selectedDims = selectedDims;
      // console.log(this.selectedDims);
    },
    saveRes() {
      const result = {};
      // dims selected
      // const dimStatus = this.$refs.VDataSet.dimStatus;
      // this.dims.forEach(d => {
      //   result[d] = dimStatus[d] ? 1 : 0;
      // });

      // dims significance
      const dimStatus = this.$refs.VDataSet.dimStatus;
      this.dims.forEach(d => {
        result[d] = dimStatus[d]
          ? this.scores.RandomForest.feature_importances[d]
          : "-";
      });

      // number of dataset
      result["train_noFraud"] = this.$refs.VDataSet.label_0_train;
      result["train_fraud"] = this.$refs.VDataSet.label_1_train;
      result["test_noFraud"] = this.$refs.VDataSet.label_0_test;
      result["test_Fraud"] = this.$refs.VDataSet.label_1_test;

      // scores
      const methods = this.methods;
      const score_types = this.score_types;
      methods.forEach(method => {
        score_types.forEach(type => {
          result[method + type] = this.scores[method][type];
        });
      });
      this.results.push(result);
    },
    download() {
      this.loadingDownload = true;
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(this.results);
      XLSX.utils.book_append_sheet(wb, ws, "sheet1");
      XLSX.writeFile(wb, "results.xlsx");
      this.loadingDownload = false;
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
<style scoped>
.ant-btn {
  margin-right: 8px;
  margin-bottom: 12px;
}
.float-right {
  text-align: right;
}
</style>
