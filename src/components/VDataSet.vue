<template>
  <a-card title="DataSet">
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

    <p>train_test_ratio</p>
    <a-input-number :min="0" :max="1" :step="0.1" v-model="train_test_ratio" />
    <a-divider />

    <p>multiple</p>
    <a-input-number :min="0" :step="0.1" v-model="multiple" />
    <a-divider />
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
      blackList: false,
      dimStatus: {
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
  methods: {
    selectedDimsChange(item) {
      this.dimStatus[item] = !this.dimStatus[item];
      this.$emit("selectedDimsChange", this.selectedDims);
    //   console.log(this.selectedDims);
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>
