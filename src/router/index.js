//import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Logout from '@/views/Logout.vue'
import Members from '@/views/Members.vue'
import SingleMember from '@/views/SingleMember.vue'
import Profile from '@/views/Profile.vue'
import Events from '@/views/Events.vue'
import SingleEvent from '@/views/SingleEvent.vue'
import NewEvent from '@/views/NewEvent'
import NewMember from '@/views/NewMember'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/members',
    name: 'Members',
    component: Members
  },
  {
    path: '/members/:id',
    name: 'SingleMember',
    component: SingleMember
  },
  {
    path: '/members/new',
    name: 'NewMember',
    component: NewMember
  },
  {
    path: '/events',
    name: 'Events',
    component: Events
  },
  {
    path: '/events/:id',
    name: 'SingleEvent',
    component: SingleEvent
  },
  {
    path: '/events/new',
    name: 'NewEvent',
    component: NewEvent
  },
]

const router = createRouter({
  //history: createWebHashHistory(),
  history: createWebHistory(),
  routes
})

export default router
