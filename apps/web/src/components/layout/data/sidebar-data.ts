import { AudioLines, LayoutDashboard, Users } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Coding Power',
    email: 'coding-power@local',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Coding Power',
      logo: AudioLines,
      plan: 'Audio · Whisper',
    },
  ],
  navGroups: [
    {
      title: '01 · Consola',
      items: [
        {
          title: 'Panel',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Transcripciones',
          url: '/transcriptions',
          icon: AudioLines,
        },
        {
          title: 'Usuarios',
          url: '/users',
          icon: Users,
        },
      ],
    },
  ],
}
