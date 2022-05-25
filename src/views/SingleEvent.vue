<template>
  <div class="single-event">
    <div
      class="bg-white pb-6 justify-center items-center overflow-hidden mx-auto"
    >
      <div class="relative h-40 bg-purple"></div>

      <CircularProgressBar
        :contentProgress="postData.attendants_percentage"
        :size="120"
        class="
          bg-white
          relative
          shadow
          h-28
          w-28
          mx-auto
          -my-12
          border-white
          rounded-full
          overflow-hidden
          border-8
        "
      ></CircularProgressBar>

      <div class="mt-16 px-2">
        <h1 class="text-xl text-center font-semibold" v-if="postData.title">
          {{ postData.title.rendered }}
        </h1>
        <div class="text-center mt-3">
          <EventTags :event="postData" />
        </div>
      </div>

      <div class="w-10/12 md:w-7/12 lg:6/12 relative py-20 mx-auto">
        <h1 class="text-xl font-semibold ml-2 truncate dark:text-white">
          Members ({{ totalItems }})
        </h1>
        <div class="flow-root">
          <ul role="list" class="grid grid-cols-1 lg:grid-cols-2">
            <li class="py-1 sm:py-2" v-for="user in items" :key="user.id">
              <div
                class="
                  border border-lightgray
                  m-2
                  p-3
                  items-center
                  grid grid-cols-4
                  justify-between
                "
              >
                <div class="col-span-3 my-2 items-center flex flex-row">
                  <div
                    class="
                      bg-lightgray
                      w-16
                      h-16
                      rounded-full
                      overflow-hidden
                      inline-block
                    "
                  >
                    <img
                      class="w-full h-full object-cover rounded-full"
                      :src="user.featured_image"
                      :alt="user.title.rendered"
                    />
                  </div>

                  <div class="ml-4">
                    <h1 class="text-xl font-semibold truncate dark:text-white">
                      {{ user.title.rendered }}
                    </h1>
                    <UserTags :user="user" class="mt-1" />
                  </div>
                </div>
                <div class="ml-2">
                  <Switch
                    v-model:checked="user.attended"
                    @click="onAttendanceChange(user)"
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userMixin from "@/mixins/UserMixin.js";
import defaultMixin from "@/mixins/DefaultMixin.js";
import paginationMixin from "@/mixins/PaginationMixin.js";
import apiMixin from "@/mixins/APIMixin.js";

import EventTags from "@/components/EventTags.vue";
import UserTags from "@/components/UserTags.vue";
import Switch from "@/components/switch.vue";
import CircularProgressBar from "@/components/CircularProgressBar.vue";

export default {
  name: "SingleEvent",
  components: {
    EventTags,
    UserTags,
    Switch,
    CircularProgressBar,
  },
  mixins: [defaultMixin, paginationMixin, apiMixin, userMixin],
  data() {
    return {
      isAttended: 0,
      postData: {},
    };
  },
  watch: {
    // search() {
    //   var component = this;
    //   component.debounceEvent(function () {
    //     component.refreshItems();
    //     //console.log( component.search );
    //   });
    // },
  },
  methods: {
    /* INHERITED FROM PAGINATION MIXIN */

    getAPI() {
      const post_id = this.$route.params.id;
      if (this.$route.params.post) {
        this.postData = JSON.parse(this.$route.params.post);
        const date = this.addDays(this.postData.date, 1);
        return this.requestUsers(this.page, this.search, {
          event_id: post_id,
          before: date,
        });
      } else {
        return this.getPost().then(() => {
          const date = this.addDays(this.postData.date, 1);
          return this.requestUsers(this.page, this.search, {
            event_id: post_id,
            before: date,
          });
        });
      }
    },

    addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },

    /*
     * FUNCTION THAT IS FIRED FIRST AS SOON AS ALL THE DEFAULT INITILIZATION IS OVER
     * TRIGGERED FROM THE DEFAULT MIXIN
     */
    getPost() {
      var component = this;

      // SET PROCESSING
      component.$store.commit("setProcessing", true);

      return component.requestEvent(this.$route.params.id).then(
        (response) => {
          component.postData = response.data;
          // this.showData = true;

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
