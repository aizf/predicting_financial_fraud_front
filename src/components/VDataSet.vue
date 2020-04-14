<template>
  <a-card title="DataSet">
    <p>Overview</p>
    <p>训练集未舞弊公司数量：{{label_0_train}}</p>
    <p>训练集舞弊公司数量：{{label_1_train}}</p>
    <p>测试集未舞弊公司数量：{{label_0_test}}</p>
    <p>测试集舞弊公司数量：{{label_1_test}}</p>
    <a-divider />

    <p>blackList</p>
    <a-checkbox :checked="blackList" @change="blackList=!blackList">blackList</a-checkbox>
    <a-divider />

    <p>selectedDims</p>
    <a-row>
      <a-col v-for="item in Object.keys(dimStatus)" :span="6" :key="item">
        <a-checkbox :checked="dimStatus[item]" @change="selectedDimsChange(item)">{{item}}</a-checkbox>
      </a-col>
    </a-row>
    <a-divider />

    <p>train_ratio</p>
    <a-input-number :min="0" :max="1" :step="0.1" v-model="train_ratio" />
    <a-divider />

    <p>multiple</p>
    <a-input-number :min="0" :step="0.1" v-model="multiple" />
  </a-card>
</template>

<script>
export default {
  name: "VDataSet",
  props: {
    dims: Array
  },
  data() {
    return {
      label_0_train: "...",
      label_1_train: "...",
      label_0_test: "...",
      label_1_test: "...",
      blackList: false,
      dimStatus: {
        DEPI: false,
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
      train_ratio: 0.7,
      multiple: 1
    };
  },
  computed: {
    selectedDims() {
      const selectedDims = [];
      this.dims.forEach(d => {
        if (this.dimStatus[d]) {
          selectedDims.push(d);
        }
      });
      return selectedDims;
    }
  },
  mounted() {
    this.getDims();
  },
  methods: {
    selectedDimsChange(item) {
      this.dimStatus[item] = !this.dimStatus[item];
      this.$emit("selectedDimsChange", this.selectedDims);
      //   console.log(this.selectedDims);
    },
    getDims() {
      return this.$axios
        .post("/search_information", {
          info: "dims"
        })
        .then(res => {
          this.$emit("getDims", { errors: false, dims: res.data.dims });
        })
        .catch(error => {
          // 请求失败处理
          // console.log(error);
          this.$emit("getDims", { errors: error, dims: [] });
          // alert("bug了,芮憨憨！！！");
        });
    },
    getDatasetOverview() {
      return this.$axios.post("/search_information", {
        info: "dataset"
      });
    },
    handleDatasetOverview(data) {
      this.label_0_train = data["label_0_train"];
      this.label_1_train = data["label_1_train"];
      this.label_0_test = data["label_0_test"];
      this.label_1_test = data["label_1_test"];
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>
