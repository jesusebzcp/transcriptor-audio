import { BrandMark } from './components/brand-mark'
import { AudioWaveform } from './components/audio-waveform'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='grid h-svh w-full grid-cols-1 overflow-hidden bg-background text-foreground lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1.15fr)]'>
      <aside className='relative hidden overflow-hidden bg-ink text-cream lg:flex'>
        <div
          aria-hidden='true'
          className='drift-slow absolute inset-0 opacity-[0.35]'
          style={{
            backgroundImage:
              'radial-gradient(60% 50% at 30% 20%, color-mix(in oklch, var(--signal) 18%, transparent), transparent 70%), radial-gradient(50% 60% at 80% 90%, oklch(0.32 0.05 260), transparent 65%)',
          }}
        />
        <div
          aria-hidden='true'
          className='absolute inset-0 opacity-[0.18]'
          style={{
            backgroundImage:
              'linear-gradient(color-mix(in oklch, var(--cream) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--cream) 8%, transparent) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage:
              'radial-gradient(80% 70% at 50% 50%, black 35%, transparent 80%)',
          }}
        />
        <div
          aria-hidden='true'
          className='scan-line pointer-events-none absolute inset-x-0 top-0 h-24'
          style={{
            background:
              'linear-gradient(180deg, transparent, color-mix(in oklch, var(--signal) 28%, transparent), transparent)',
          }}
        />

        <div className='relative z-10 flex h-full w-full flex-col justify-between p-10'>
          <header className='flex items-center justify-between text-cream'>
            <BrandMark className='[&_span]:text-cream [&_span_span]:text-cream/60 [&_svg]:text-cream' />
            <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-cream/55'>
              v1.0 · build 0x4a
            </span>
          </header>

          <div className='flex flex-1 flex-col justify-center gap-10 py-12'>
            <div className='rise-in space-y-5' style={{ animationDelay: '80ms' }}>
              <span className='inline-flex items-center gap-2 rounded-full border border-cream/12 bg-cream/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-cream/70'>
                <span className='signal-dot inline-block size-1.5 rounded-full bg-signal' />
                senal · en linea
              </span>
              <h1
                className='max-w-md text-balance text-[2.75rem] leading-[1.05] tracking-[-0.02em] text-cream'
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Transcribe audio con la{' '}
                <em className='not-italic text-signal'>precision</em> de un
                motor bien ajustado.
              </h1>
              <p className='max-w-md text-sm leading-relaxed text-cream/65'>
                Inicia sesion para enviar notas de voz, reuniones y entrevistas
                por Whisper, y obtener transcripciones limpias en segundos.
              </p>
            </div>

            <div
              className='rise-in relative h-32 overflow-hidden rounded-xl border border-cream/8 bg-cream/[0.03] p-5'
              style={{ animationDelay: '180ms' }}
            >
              <div className='absolute inset-x-5 top-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-cream/45'>
                <span>en vivo · 48kHz</span>
                <span className='flex items-center gap-1.5 text-signal/80'>
                  <span className='signal-dot inline-block size-1.5 rounded-full bg-signal' />
                  capturando
                </span>
              </div>
              <div className='absolute inset-x-5 bottom-5 top-10'>
                <AudioWaveform />
              </div>
            </div>

            <dl
              className='rise-in grid grid-cols-3 gap-6 border-t border-cream/10 pt-6 font-mono text-[11px] text-cream/70'
              style={{ animationDelay: '260ms' }}
            >
              <div className='space-y-1'>
                <dt className='text-cream/40'>modelos</dt>
                <dd className='text-base text-cream' style={{ fontFamily: 'var(--font-serif)' }}>
                  5
                </dd>
              </div>
              <div className='space-y-1'>
                <dt className='text-cream/40'>idiomas</dt>
                <dd className='text-base text-cream' style={{ fontFamily: 'var(--font-serif)' }}>
                  99+
                </dd>
              </div>
              <div className='space-y-1'>
                <dt className='text-cream/40'>latencia</dt>
                <dd className='text-base text-cream' style={{ fontFamily: 'var(--font-serif)' }}>
                  ~1.4×
                </dd>
              </div>
            </dl>
          </div>

          <footer className='flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40'>
            <span>cifrado extremo a extremo</span>
            <span>cdmx · 2026</span>
          </footer>
        </div>
      </aside>

      <main className='relative flex items-center justify-center overflow-y-auto px-6 py-10 sm:px-10'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 opacity-60 lg:hidden'
          style={{
            backgroundImage:
              'radial-gradient(50% 40% at 50% 0%, color-mix(in oklch, var(--signal) 10%, transparent), transparent 70%)',
          }}
        />
        <div className='relative w-full max-w-md'>{children}</div>
      </main>
    </div>
  )
}
