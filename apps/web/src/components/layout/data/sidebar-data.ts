import { LayoutDashboard, AudioLines, Command } from 'lucide-react'
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
      logo: Command,
      plan: 'Audio · Whisper',
    },
  ],
  navGroups: [
    {
      title: 'Principal',
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
      ],
    },
  ],
}
