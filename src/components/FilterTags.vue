<template>
  <div class="grid grid-row-2 content-start">
    <div class="text-sm font-semibold mb-2">{{ tag }}</div>

    <ul :name="tag" class="ks-cboxtags">
      <div :value="id" v-for="(subTag, id) in tagData" :key="subTag">
        <div class="lex flex-wrap float-left">
          <li>
            <input
              type="checkbox"
              :id="id"
              :value="id"
              v-model="selectedFilters"
              @click="onChipClicked(id)"
            />
            <label :for="id"> {{ subTag }} </label>
          </li>
        </div>
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FilterTags",
  data() {
    return {
      isChipListVisible: false,
      selectedFilters: [],
      filterTagAndIds: {
        tag: "",
        filterIds: "",
      },
    };
  },
  props: {
    tagkey: String,
    tag: String,
    tagData: Object,
    selectedFilterData: String,
  },

  created() {
    if (
      this.selectedFilterData !== undefined ||
      this.selectedFilterData === ""
    ) {
      this.selectedFilters = this.selectedFilterData.split(",");
    }
  },
  methods: {
    getFilterData() {
      this.$emit("filterTags", this.filterTagAndIds);
    },

    onChipClicked(id) {
      // clear ids for selecting only one filter
      this.selectedFilters = [];

      //add or remove filter from the list

      if (this.selectedFilters.includes(id)) {
        this.selectedFilters.splice(this.selectedFilters.indexOf(id), 1);
      } else {
        this.selectedFilters.push(id);
      }

      let ids = this.selectedFilters.join(",");

      this.filterTagAndIds["tag"] = this.tagkey;
      this.filterTagAndIds["filterIds"] = ids;

      this.getFilterData();
    },
  },
};
</script>

<style scoped>



ul.ks-cboxtags {
  list-style: none;
  padding-bottom: 10px;
}

ul.ks-cboxtags li {
  display: inline;
}
ul.ks-cboxtags li label {
  display: inline-block;
  background-color: transparent;
  border: 1px solid lightgray;
  color: black;
  border-radius: 10px;
  white-space: nowrap;
  margin: 3px 5px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

ul.ks-cboxtags li label {
  padding: 6px 12px;
  cursor: pointer;
}

ul.ks-cboxtags li label::before {
  display: none;
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  font-weight: 900;
  font-size: 12px;
  padding: 2px 6px 2px 2px;
  transition: transform 0.3s ease-in-out;
}

ul.ks-cboxtags li input[type="checkbox"]:checked + label::before {
  display: none;
  transition: transform 0.3s ease-in-out;
}

ul.ks-cboxtags li input[type="checkbox"]:checked + label {
  border: 1px solid orange;
  background-color: transparent;
  transition: all 0.2s;
}

ul.ks-cboxtags li input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  display: none;
}
</style>
