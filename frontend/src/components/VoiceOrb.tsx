interface Props {
  db: number
  state: 'idle' | 'listening' | 'processing' | 'error'
  label: string
}

export function VoiceOrb({ db, state, label }: Props) {
  const strength = Math.min(1, Math.max(0, (db + 60) / 40))
  return (
    <div className={`voice-orb voice-orb--${state}`} aria-live="polite">
      <div className="voice-orb__core">
        <span className="voice-orb__glyph" aria-hidden="true">●</span>
      </div>
      <div className="voice-orb__signal" aria-hidden="true">
        {[0.45, 0.7, 1, 0.62].map((factor, index) => (
          <i key={index} style={{ height: `${5 + strength * factor * 22}px` }} />
        ))}
      </div>
      <span className="voice-orb__label">{label}</span>
    </div>
  )
}
