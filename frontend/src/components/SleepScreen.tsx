import { useEffect, useState } from 'react'

export function SleepScreen({ hint }: { hint: string }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <main className="sleep-screen">
      <svg className="sleep-screen__contours" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-90 620C170 480 290 750 520 570S850 260 1080 420s310 220 620-30" />
        <path d="M-100 690C160 550 320 820 555 625S865 335 1100 485s330 210 620-35" />
        <path d="M-120 760C160 620 350 880 590 680S900 405 1140 545s340 200 620-25" />
        <path d="M40 100C250 260 320-10 560 170s360 240 570 40 330-30 530 90" />
      </svg>
      <header className="sleep-screen__header">
        <div className="sleep-screen__mark">BaGdar</div>
        <span>43°39′29″ N&nbsp;&nbsp; 51°08′07″ E</span>
      </header>
      <div className="sleep-screen__clock">
        <small>Ақтау · Каспий жағалауы</small>
        <time className="sleep-screen__time">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
        <time className="sleep-screen__date">{now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</time>
      </div>
      <div className="sleep-screen__hint"><span className="sleep-screen__pulse" />{hint}</div>
    </main>
  )
}
