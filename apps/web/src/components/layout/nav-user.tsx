import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth-store'
import { getDisplayNameInitials } from '@/lib/utils'

type NavUserProps = {
  user: {
    name: string
    email: string
  }
}

export function NavUser({ user }: NavUserProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  function handleSignOut() {
    auth.reset()
    navigate({ to: '/sign-in', replace: true })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='border border-border/60 bg-card/40 data-[state=open]:border-signal/50 data-[state=open]:bg-card/70'
            >
              <Avatar className='h-8 w-8 rounded-md border border-signal/30 bg-signal/10'>
                <AvatarFallback className='rounded-md bg-signal/15 font-mono text-[10px] tracking-wider text-signal'>
                  {getDisplayNameInitials(user.email)}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-start leading-tight'>
                <span className='truncate font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/90'>
                  {user.email}
                </span>
                <span className='truncate font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground'>
                  sesion activa
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='min-w-56 rounded-lg border-border/60'
            side='right'
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-start text-sm'>
                <Avatar className='h-8 w-8 rounded-md border border-signal/30 bg-signal/10'>
                  <AvatarFallback className='rounded-md bg-signal/15 font-mono text-[10px] tracking-wider text-signal'>
                    {getDisplayNameInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-start leading-tight'>
                  <span className='truncate font-mono text-[11px] uppercase tracking-[0.18em]'>
                    {user.email}
                  </span>
                  <span className='truncate text-[10px] uppercase tracking-[0.2em] text-muted-foreground'>
                    sesion activa
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant='destructive'
              onClick={handleSignOut}
              className='font-mono text-[11px] uppercase tracking-[0.2em]'
            >
              <LogOut />
              Cerrar sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
