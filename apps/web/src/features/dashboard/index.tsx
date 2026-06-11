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
          <h1 className='text-2xl font-bold tracking-tight'>Panel</h1>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Transcripciones</CardTitle>
              <CardDescription>
                Sube audio o video, ejecuta faster-whisper y guarda el resultado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to='/transcriptions'>Abrir transcripciones</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
