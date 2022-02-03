//import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Members from '../views/Members.vue'
import SingleMember from '../views/SingleMember.vue'

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
    path: '/members',
    name: 'Members',
    component: Members
  },

  {
		path			: '/members/:id',
    name			: 'SingleMember',
		component	: SingleMember
	},

]

const router = createRouter({
  //history: createWebHashHistory(),
  history: createWebHistory(),
  routes
})

export default router
