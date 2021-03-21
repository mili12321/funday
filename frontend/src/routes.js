import { Home } from './pages/Home.jsx'
import { About } from './pages/About.jsx'
import { Workspace } from './pages/Workspace.jsx'
import { UserDetails } from './pages/UserDetails.jsx'

export const routes=[
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/boards',
    component: Workspace,
  },
  {
    path: '/boards/:id',
    component: Workspace,
  },
  {
    path: '/users/:id',
    component: UserDetails,
  }
]
