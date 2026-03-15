import { Copy, TrendingUp } from 'lucide-react'
import { AFFILIATE } from '@/data/mockData'

export default function BecomeAffiliate() {
  return (
    <div
      className="card animate-fade-up"
      style={{
        animationDelay: '0.1s',
        background: 'linear-gradient(135deg, #080c10 0%, rgba(0,229,209,0.04) 100%)',
        borderColor: 'rgba(0,229,209,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow orb */}
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        right: '-30px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,209,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Affiliate Program</span>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.65rem',
            color: 'var(--color-text-muted)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            Earn commissions by<br />referring traders.
          </p>
        </div>
        <div style={{
          width: '32px', height: '32px',
          borderRadius: '6px',
          backgroundColor: 'var(--color-accent-bg-strong)',
          border: '1px solid rgba(0,229,209,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <TrendingUp size={15} style={{ color: 'var(--color-accent)' }} />
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px',
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: '5px',
        border: '1px solid var(--color-border-subtle)',
      }}>
        {[
          { label: 'Closes', value: String(AFFILIATE.closes), positive: false },
          { label: 'Leads', value: String(AFFILIATE.leads), positive: false },
          { label: 'Earned', value: `$${AFFILIATE.earnings.toLocaleString()}`, positive: true },
        ].map(({ label, value, positive }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.58rem',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '3px',
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '-0.02em',
              color: positive ? 'var(--color-positive)' : 'var(--color-text-primary)',
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <button
        className="button-accent"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
      >
        <Copy size={12} />
        COPY REFERRAL LINK
      </button>
    </div>
  )
}
