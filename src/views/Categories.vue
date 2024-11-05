<template>

  <PhoneUI
    :title="getCategoryName()"
    :configUI="{
      hide_footer: true,
      maintitle_classes: 'hidden',
      stickytitle_classes: 'opacity-100',
    }"
  >

    <template v-slot:headericon>
      <router-link :to="{ name: 'Profile' }">
        <Icon type='Back' class='inline mt-1' />
      </router-link>
    </template>

    <template v-slot:headerright>

      <router-link :to="{ name: 'NewCategory', params: { type: getType() } }">
        <Icon type='Plus' class='inline text-white' />
      </router-link>

    </template>

    <template v-slot:phonebody>

      <OrbitPosts :params="params" :key='params.unique_id'>

        <template v-slot:loadingAnimation>
          <ListWithImageAnimation :total='10' />
        </template>

        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>

        <template v-slot:whenempty>
          <div class='text-xs text-red border border-red p-2 mt-4'>No members found for this query</div>
        </template>

      </OrbitPosts>





    </template>

    <!--template v-slot:mainttitle_footer>
      <SearchField @searching='onSearch' />
    </template-->

  </PhoneUI>

</template>

<script>
import PhoneUI from '@/components/PhoneUI.vue'
import Icon from '@/components/Icon.vue'
import SearchField from '@/components/SearchField.vue'
import MembersDropdown from '@/components/MembersDropdown.vue'

import BackButton from "@/templates/PhoneUI/BackButton.vue";

import ListWithImageAnimation from '@/templates/Animation/ListWithImage.vue'
import PaginationLoaderAnimation from '@/templates/Animation/PaginationLoader.vue'

import CategoryHelper from '@/lib/CategoryHelper';

import { ref } from 'vue';

export default {
  components: {
    PhoneUI,
    Icon,
    SearchField,
    MembersDropdown,
    ListWithImageAnimation,
    PaginationLoaderAnimation,
    BackButton
  },

  setup(){

    const { categories, getWPType, getType } = CategoryHelper();

    const getCategoryName = () => categories.value[ getType() ].label;

    const params = ref( {
      unique_id   : 1,
      per_page    : 10,
      post_type   : getWPType( getType() ),
      style       : 'ListWithTermName',
      //orderby     : 'title',
      //order       : 'asc',
      pagination  : 1,
      search      : ''
    } );

    return {
      params,
      getCategoryName,
      getType
    }

  },
};
</script>
