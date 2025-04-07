<template>
  <div
    v-if="isMenuVisible"
    class="absolute right-6 top-8 bg-white z-10 shadow-lg p-3 rounded-md"
  >
    <ul class="space-y-2">
      <li v-for="(menuItem, index) in menuItems" :key="index">
        <button
          type="button"
          :class="[
            'flex items-center space-x-2 transition-all',
            menuItem.condition
              ? 'hover:text-darkgray'
              : 'text-darkgray cursor-not-allowed',
            menuItem.extraCss && menuItem.extraCss,
          ]"
          @click="menuItem.condition && menuItem.action(item)"
          :disabled="!menuItem.condition"
        >
          <Icon :type="menuItem.icon" />
          <span>{{ menuItem.label }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import Icon from "@/components/Icon.vue";
import Util from "@/lib/Util";

export default {
  name: "CommentActionsMenu",
  components: {
    Icon,
  },
  props: {
    item: Object,
    isMenuVisible: Boolean,
    user: Object,
  },
  setup(props, context) {
    const showEditButton = (dateString, user) => {
      if (isAdmin({ user: user })) return true;
      return showRescheduleButton(dateString);
    };

    const showRescheduleButton = (dateString) => {
      const currentDate = new Date();
      const inputDate = new Date(dateString);
      const timeDifference = currentDate - inputDate;
      const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000;
      return timeDifference < oneMonthInMillis;
    };

    const isAdmin = ({ user }) =>
      Util.hasUserRole({ user, searchRole: "administrator" });

    const openCommentModal = (itemId, modalType) => {
      context.emit("openCommentModal", itemId, modalType);
    };

    const deleteComment = (item) => {
      context.emit("deleteComment", item);
    };

    const menuItems = [
      {
        label: "Edit",
        icon: "Edit",
        condition: showEditButton(props.item.date, props.user),
        action: (item) => openCommentModal(item.id, "edit"),
      },
      {
        label: "Re-schedule",
        icon: "Clock",
        condition: showRescheduleButton(props.item.date),
        action: (item) => openCommentModal(item.id, "reschedule"),
      },
      {
        label: "Delete",
        icon: "Delete",
        condition: true,
        action: deleteComment,
        extraCss: "text-red hover:text-lightred",
      },
    ];

    return {
      menuItems,
      showEditButton,
      showRescheduleButton,
      openCommentModal,
      deleteComment,
    };
  },
};
</script>
