import { STATUSES } from '../config/constants';

// One proportional bar = the whole pipeline. Click a stage to filter the table.
export default function PipelineBar({ stats, active, onSelect }) {
  const empty = stats.total === 0;
  return (
    <div className="pipeline">
      <div className={`pipe-track ${active ? 'has-active' : ''}`} role="group" aria-label="Pipeline stages">
        {empty && <div className="pipe-empty">Add a lead to see your pipeline take shape</div>}
        {!empty && STATUSES.filter((s) => stats[s] > 0).map((s, i) => (
          <button key={s} type="button" className={`pipe-seg seg-${s.toLowerCase()} ${active === s ? 'is-active' : ''}`}
            style={{ flexGrow: stats[s], animationDelay: `${i * 90}ms` }}
            onClick={() => onSelect(active === s ? '' : s)} aria-pressed={active === s}
            aria-label={`${s}: ${stats[s]} leads`} title={`${s} · ${stats[s]}`} />
        ))}
      </div>

      <ul className="pipe-legend">
        <li>
          <button type="button" className={!active ? 'is-active' : ''} onClick={() => onSelect('')}>
            All leads <b>{stats.total}</b>
          </button>
        </li>
        {STATUSES.map((s) => (
          <li key={s}>
            <button type="button" className={active === s ? 'is-active' : ''} onClick={() => onSelect(active === s ? '' : s)}>
              <i className={`dot dot-${s.toLowerCase()}`} />{s} <b>{stats[s]}</b>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
