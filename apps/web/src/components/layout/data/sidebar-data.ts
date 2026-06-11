import {
  LayoutDashboard,
  HelpCircle,
  AudioLines,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Transcriptor',
    email: 'transcriptor@local',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Transcriptor',
      logo: Command,
      plan: 'Audio · Whisper',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioLines,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Transcriptions',
          url: '/transcriptions',
          icon: AudioLines,
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
