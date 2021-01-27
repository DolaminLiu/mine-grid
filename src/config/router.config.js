import { UserLayout } from '@/layouts'

const constantRouterMap = [
  {
    path: '/',
    redirect: '/grid'
  },
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: '/user/login',
        name: 'UserLogin',
        component: () => import('@/views/user/Login')
      }
    ]
  },
  {
    path: '/drag',
    name: 'drag',
    component: () => import('@/views/drag')
  },
  {
    path: '/grid',
    name: 'grid',
    component: () => import('@/views/griditem')
  }
]

export {
  constantRouterMap
}
