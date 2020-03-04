import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/problem',
    name: 'Problem',
    component: () => import(/* webpackChunkName: "about" */ '../views/Problem.vue'),
  },
  {
    path: '/problem/:id',
    name: 'ProblemDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/ProblemDetail.vue'),
    props: true
  },
  {
    path: '/contest',
    name: 'Contest',
    component: () => import(/* webpackChunkName: "about" */ '../views/Contest.vue'),
  },
  {
    path: '/contest/:id',
    name: 'ContestDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/ContestDetail.vue'),
    props: true
  },
  {
    path: '/status',
    name: 'Status',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Status.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[

    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
