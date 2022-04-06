<template>
  <!-- <li class="inline-block p-2 w-1/2">
    <select :name="tag" class="border p-2 px-4 w-full">
      <option value="0">Choose {{ tag }}</option>
      <option :value="id" v-for="(subtag, id) in tagData" :key="subtag">
        {{ subtag }}
      </option>
    </select>
  </li> -->

  <!-- <li class="inline-block p-1">
    <div :name="tag" class="text-sm font-semibold mb-2">{{ tag }}</div>
    <template :value="id" v-for="(subTag, id) in tagData" :key="subTag">
      <div class="flex flex-wrap float-left">
        <button
          type="button"
          class="
            border border-gray
            rounded-md
            px-3
            py-1
            text-sm
            mr-2
            mb-2
            truncate
          "
          @click="onChipClicked"
        >
          {{ subTag }}
        </button>
      </div>
    </template>
  </li> -->
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
body,
html {
  margin: 0;
  padding: 0;
}

body {
  display: flex;
  align-items: left;
  justify-content: center;
}

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
