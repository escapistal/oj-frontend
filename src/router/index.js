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
    // name: 'ContestDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/ContestDetail.vue'),
    props: true,
    children:[
      {
        path:'',
        name:'ContestOverview',
        component: () => import(/* webpackChunkName: "about" */ '../views/ContestOverview.vue'),
      },
      {
        path:'clarification',
        name:'ContestClarification',
        component: () => import(/* webpackChunkName: "about" */ '../views/ContestClarification.vue')
      },
      {
        path:'problemset',
        name:'ContestProblemSet',
        component: () => import(/* webpackChunkName: "about" */ '../views/ContestProblemSet.vue')
      },
      {
        path:'status',
        name:'ContestStatus',
        component: () => import(/* webpackChunkName: "about" */ '../views/ContestStatus.vue'),
        props:true
      },
      {
        path:'rank',
        name:'ContestRank',
        component: () => import(/* webpackChunkName: "about" */ '../views/ContestRank.vue')
      },
      {
        path:'problem/:pid',
        name:'ContestProblem',
        component: () => import(/* webpackChunkName: "about" */ '../views/ContestProblem.vue'),
        props:true
      },
      {
        path:'clarification/:clarid',
        name:'ContestClarificationDetail',
        component: () => import(/* webpackChunkName: "about" */ '../views/ContestClarificationDetail.vue'),
      },
      {
        path:'submission/:sid',
        name:'ContestStatusDetail',
        component: () => import(/* webpackChunkName: "about" */ '../views/ContestStatusDetail.vue'),
      }
    ]
  },
  {
    path: '/status',
    name: 'Status',
    component: () => import(/* webpackChunkName: "about" */ '../views/Status.vue')
  },
  {
    path:'/submission/:sid',
    name:'StatusDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/StatusDetail.vue'),
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
    path: '/admin',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "about" */ '../views/Admin.vue'),
    children:[
      {
        path: '',
        name: 'AdminMain',
        component: () => import(/* webpackChunkName: "about" */ '../views/AdminMainPage.vue')
      },
      {
        path: 'announcement',
        name: 'AdminAnnouncement',
        component: () => import(/* webpackChunkName: "about" */ '../views/AdminAnnouncement.vue')
      },
      {
        path: 'user',
        name: 'AdminUser',
        component: () => import(/* webpackChunkName: "about" */ '../views/AdminUser.vue')
      },
      {
        path: 'problem',
        name: 'AdminProblem',
        component: () => import(/* webpackChunkName: "about" */ '../views/AdminProblem.vue')
      },
      {
        path: 'contest',
        name: 'AdminContest',
        component: () => import(/* webpackChunkName: "about" */ '../views/AdminContest.vue')
      },
      {
        path: 'systemconfig',
        name: 'AdminSystemConfig',
        component: () => import(/* webpackChunkName: "about" */ '../views/AdminSystemConfig.vue')
      },
    ]
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
