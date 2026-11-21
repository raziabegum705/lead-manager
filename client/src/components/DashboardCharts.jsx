import { STATUSES } from '../config/constants';

const COLORS = { New: '#4c8dff', Contacted: '#ffb020', Qualified: '#14b88a', Lost: '#8195ab' };
const R = 62;
const C = 2 * Math.PI * R;

const onKey = (fn) => (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } };

function Donut({ stats, active, onSelect }) {
  const total = stats.total;
  let acc = 0;
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 160 160" className="donut" role="img" aria-label="Leads by status">
        <circle cx="80" cy="80" r={R} className="donut-track" />
        {STATUSES.map((s) => {
          const len = total ? (stats[s] / total) * C : 0;
          const seg = len > 0 && (
            <circle key={s} cx="80" cy="80" r={R} className={`donut-seg ${active && active !== s ? 'dim' : ''}`}
              stroke={COLORS[s]} strokeDasharray={`${Math.max(len - 3, 0.01)} ${C}`} strokeDashoffset={-acc}
              transform="rotate(-90 80 80)" role="button" tabIndex={0} aria-label={`${s}: ${stats[s]} leads`}
              onClick={() => onSelect(active === s ? '' : s)} onKeyDown={onKey(() => onSelect(active === s ? '' : s))} />
          );
          acc += len;
          return seg;
        })}
        <text x="80" y="78" textAnchor="middle" className="donut-num">{active ? stats[active] : total}</text>
        <text x="80" y="98" textAnchor="middle" className="donut-cap">{active || 'total leads'}</text>
      </svg>

      <ul className="donut-legend">
        {STATUSES.map((s) => (
          <li key={s}>
            <button type="button" className={active === s ? 'is-active' : ''} onClick={() => onSelect(active === s ? '' : s)}>
              <i style={{ background: COLORS[s] }} />
              <span>{s}</span>
              <b>{stats[s]}</b>
              <em>{pct(stats[s])}%</em>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Bars({ stats, active, onSelect }) {
  const max = Math.max(...STATUSES.map((s) => stats[s]), 0);
  const step = max <= 4 ? 1 : Math.ceil(max / 4);
  const top = step * 4;
  const W = 420, H = 210, L = 30, B = 34, T = 14;
  const plotH = H - B - T;
  const slot = (W - L) / STATUSES.length;
  const bw = Math.min(54, slot * 0.58);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="bars" role="img" aria-label="Number of leads per status">
      {[0, 1, 2, 3, 4].map((i) => {
        const y = T + plotH - (i * step / top) * plotH;
        return (
          <g key={i}>
            <line x1={L} x2={W} y1={y} y2={y} className="grid" />
            <text x={L - 8} y={y + 4} textAnchor="end" className="axis">{i * step}</text>
          </g>
        );
      })}
      {STATUSES.map((s, i) => {
        const h = (stats[s] / top) * plotH;
        const x = L + i * slot + (slot - bw) / 2;
        const y = T + plotH - h;
        const pick = () => onSelect(active === s ? '' : s);
        return (
          <g key={s} className={`bar ${active && active !== s ? 'dim' : ''}`} role="button" tabIndex={0}
            aria-label={`${s}: ${stats[s]} leads`} onClick={pick} onKeyDown={onKey(pick)}>
            <rect x={L + i * slot} y={T} width={slot} height={plotH} className="bar-hit" />
            {h > 0 && <rect x={x} y={y} width={bw} height={h} rx="8" fill={COLORS[s]} className="bar-fill" style={{ animationDelay: `${i * 80}ms` }} />}
            <text x={x + bw / 2} y={(h > 0 ? y : T + plotH) - 7} textAnchor="middle" className="bar-val">{stats[s]}</text>
            <text x={x + bw / 2} y={H - 11} textAnchor="middle" className={`axis ${active === s ? 'axis-active' : ''}`}>{s}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function DashboardCharts({ stats, active, onSelect }) {
  return (
    <div className="charts">
      <section className="card chart-card">
        <header><h3>Pipeline mix</h3><p className="muted">Share of leads in each stage</p></header>
        <Donut stats={stats} active={active} onSelect={onSelect} />
      </section>
      <section className="card chart-card">
        <header><h3>Leads per status</h3><p className="muted">Click a bar to filter the table</p></header>
        <Bars stats={stats} active={active} onSelect={onSelect} />
      </section>
    </div>
  );
}
