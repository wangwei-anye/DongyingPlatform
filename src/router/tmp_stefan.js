import StefanIndex from '@/views/module/Stefan_Index'
import StefanComponent from '@/views/module/Stefan_Component'

const StefanRouter = [
  {
    path: '/stefan',
    name: 'StefanIndex',
    component: StefanIndex
  },
  {
    path: '/stefan/component',
    name: 'StefanComponent',
    component: StefanComponent
  }
]

export default StefanRouter