import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Logout from "@/views/Logout.vue";
import Members from "@/views/Members.vue";
import SingleMember from "@/views/SingleMember.vue";
import Profile from "@/views/Profile.vue";
import Events from "@/views/Events.vue";
import SingleEvent from "@/views/SingleEvent.vue";
import NewEvent from "@/views/NewEvent.vue";
import NewMember from "@/views/NewMember.vue";
import SpecialEvents from "@/views/SpecialEvents.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/test",
    name: "TestDemo",
    component: () => import("@/views/Test.vue"),
  },
  {
    path: "/stats",
    name: "Analytics",
    component: () => import("@/views/Analytics.vue"),
  },
  {
    path: "/team",
    name: "Team",
    component: () => import("@/views/Team.vue"),
  },
  {
    path: "/team/new",
    name: "NewTeamMember",
    component: () => import("@/views/NewTeamMember.vue"),
  },
  {
    path: "/team/:id",
    name: "SingleTeamMember",
    component: () => import("@/views/SingleTeamMember.vue"),
  },
  {
    path: "/team/edit",
    name: "EditTeamMember",
    component: () => import("@/views/NewTeamMember.vue"),
  },
  {
    path: "/comments",
    name: "Comments",
    component: () => import("@/views/Comments.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/members",
    name: "Members",
    component: Members,
  },
  {
    path: "/members/:id",
    name: "SingleMember",
    component: SingleMember,
  },
  {
    path: "/members/new",
    name: "NewMember",
    component: NewMember,
  },
  {
    path: "/events",
    name: "Events",
    component: Events,
  },
  {
    path: "/events/:id",
    name: "SingleEvent",
    component: SingleEvent,
  },
  {
    path: "/events/new",
    name: "NewEvent",
    component: NewEvent,
  },
  {
    path: "/special-events",
    name: "SpecialEvents",
    component: SpecialEvents,
  },
  {
    path: "/categories/:type",
    name: "Categories",
    component: () => import("@/views/Categories.vue"),
  },
  {
    path: "/categories/:type/new",
    name: "NewCategory",
    component: () => import("@/views/NewCategory.vue"),
  },
  {
    path: "/categories/comment-types",
    name: "CommentsCategory",
    component: () => import("@/views/CommentsCategory.vue"),
  },
  {
    path: "/categories/comment-types/new",
    name: "NewCommentsCategory",
    component: () => import("@/views/NewCommentsCategory.vue"),
  },
];

const router = createRouter({
  //history: createWebHashHistory(),
  history: createWebHistory(),
  routes,
});

export default router;
