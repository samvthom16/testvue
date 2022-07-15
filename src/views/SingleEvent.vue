<template>

  <PhoneUI :configUI='configUI' :title='getHeaderTitle()'>
    <template v-slot:headericon>
      <router-link :to="{ name: 'Events' }">
        <Icon type='Back' />
      </router-link>
    </template>
    <template v-slot:phonebody>
      <div class="bg-white pb-6 justify-center items-center mx-auto relative borde -my-12 pt-20 rounded-sm">
        <div class='absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-full'>
          <CircularProgressBar
            :contentProgress="post.attendants_percentage"
            :size="120"
            class="
              shadow
              h-28
              w-28
              mx-auto
              border-white
              rounded-full
              overflow-hidden
              border-8"
          ></CircularProgressBar>
        </div>

        <div class="mt-8 px-2">
          <h1 class="text-2xl text-center font-semibold" v-if="post.title">
            {{ post.title.rendered }}
          </h1>
          <div class="text-center mt-3">
            <EventTags :event="post" />
          </div>
        </div>
      </div>


        <div class="w-full md:w-7/12 lg:6/12 relative py-20 mx-auto">

          <input
            class="mt-2 p-2 bg-lightergray w-full rounded-sm outline-none focus:none align-middle border-black border-2"
            type="text"
            placeholder="Search"
            v-model="search"
          />
          <div class="flow-root mt-4">
            <ul role="list" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <li class="py-1 p-4 sm:py-2 border border-gray rounded-sm" v-for="user in items" :key="user.id">
                <div class="items-center justify-between">
                  <div class="col-span-3 my-2 items-center flex flex-row">
                    <div class="flex-shrink-1">
                      <div
                        class="
                          bg-lightgray
                          w-16
                          h-16
                          rounded-full
                          overflow-hidden
                          inline-block
                          border border-gray
                        "
                      >
                        <img
                          class="w-full h-full object-cover rounded-full"
                          :src="user.featured_image"
                          :alt="user.title.rendered"
                        />
                      </div>
                    </div>


                    <div class="ml-4 flex-1">
                      <h1 class="text-xl font-semibold truncate dark:text-white">
                        {{ user.title.rendered }}
                      </h1>
                      <UserTags :user="user" class="my-2" />
                      <Switch
                        v-model:checked="user.attended"
                        @click="onAttendanceChange(user)"
                      />
                    </div>
                  </div>

                </div>
              </li>
            </ul>
          </div>
        </div>



    </template>
  </PhoneUI>




</template>

<script>
import PhoneUI from '@/components/PhoneUI'
import Icon from '@/components/Icon'

import userMixin from "@/mixins/UserMixin.js";
import defaultMixin from "@/mixins/DefaultMixin.js";
import paginationMixin from "@/mixins/PaginationMixin.js";
import apiMixin from "@/mixins/APIMixin.js";

import EventTags from "@/components/EventTags.vue";
import UserTags from "@/components/UserTags.vue";
import Switch from "@/components/switch.vue";
// import ProgressBarItem from "@/components/ProgressBarItem.vue";
import CircularProgressBar from "@/components/CircularProgressBar.vue";

export default {
  name: "SingleEvent",
  components: {
    PhoneUI,
    Icon,
    EventTags,
    UserTags,
    Switch,
    // ProgressBarItem,
    CircularProgressBar,
  },
  mixins: [defaultMixin, paginationMixin, apiMixin, userMixin],
  data() {
    return {
      id      : 0,
      post    : {},
      search  : '',
      configUI: {
        maintitle_classes : "py-16",
        hide_maintitle    : true,
      }
    };
  },
  watch: {
    search() {
      var component = this;
      component.debounceEvent(function () {
        component.refreshItems();
        //console.log( component.search );
      });
    },
  },
  mounted() {
    var post_id = this.$route.params.id;

    if (post_id) {
      this.id = parseInt(post_id);
    }
    // CHECK IF POST INFORMATION HAS BEEN PASSED IN THE ROUTE
    if (this.$route.params.post != undefined) {
      this.post = JSON.parse(this.$route.params.post);
    } else {
      this.getPost();
    }
  },
  methods: {

    getHeaderTitle(){
      var component = this;
      if( component.post && component.post.title && component.post.title.rendered ) {
        return component.post.title.rendered;
      }
      return 'Event';
    },

    /* INHERITED FROM PAGINATION MIXIN */

    getAPI() {
      var post_id = this.$route.params.id;

      return this.requestUsers(this.page, this.search, {
        event_id: post_id,
      });
    },

    /*
     * FUNCTION THAT IS FIRED FIRST AS SOON AS ALL THE DEFAULT INITILIZATION IS OVER
     * TRIGGERED FROM THE DEFAULT MIXIN
     */
    getPost() {
      var component = this;

      // SET PROCESSING
      component.$store.commit("setProcessing", true);

      component.requestEvent(component.id).then(
        (response) => {
          component.post = response.data;
          // RESET PROCESSING
          component.$store.commit("setProcessing", false);
        },
        (error) => {
          component.$store.commit("notifyError", error);
        }
      );
    },

    getPageTitle() {
      var title = "InPursuit - Single Event";
      return title;
    },

    // UPDATE IN ATTENDANCE DATABASE
    onAttendanceChange(user) {
      var post_id = this.$route.params.id;

      var isAttended;

      if (!user.attended) {
        isAttended = 1;
      } else {
        isAttended = 0;
      }

      this.updateAttendance(user.id, post_id, isAttended).then(
        () => {
          setTimeout(() => this.getPost(), 500);
        },
        (error) => {
          console.log("" + error);
        }
      );
    },
  },
};
</script>
