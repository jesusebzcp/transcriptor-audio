import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

export function Dashboard() {
  return (
    <>
      <Header>
        <div className='me-auto' />
      </Header>
      <Main>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Transcriptions</CardTitle>
              <CardDescription>
                Upload audio or video, run faster-whisper, save the result.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to='/transcriptions'>Open transcriptions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
