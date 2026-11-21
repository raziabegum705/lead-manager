import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { validateAuth, errorMessage } from '../utils/validate';
import { LogoMark, EyeIcon, EyeOffIcon } from '../components/Icons';

// Sample data for the decorative preview on the left
const PREVIEW = [
  { name: 'New', v: 8, color: '#4c8dff' },
  { name: 'Contacted', v: 5, color: '#ffb020' },
  { name: 'Qualified', v: 6, color: '#14b88a' },
  { name: 'Lost', v: 3, color: '#8195ab' },
];

const R = 62;
const C = 2 * Math.PI * R;
const SUM = PREVIEW.reduce((a, p) => a + p.v, 0);

function PreviewCharts() {
  let acc = 0;
  return (
    <div className="demo-charts" aria-hidden="true">
      <svg viewBox="0 0 160 160" className="donut">
        <circle cx="80" cy="80" r={R} className="donut-track" style={{ stroke: 'rgba(255,255,255,.08)' }} />
        {PREVIEW.map((p) => {
          const len = (p.v / SUM) * C;
          const el = (
            <circle key={p.color} cx="80" cy="80" r={R} className="donut-seg" stroke={p.color}
              strokeDasharray={`${len - 3} ${C}`} strokeDashoffset={-acc} transform="rotate(-90 80 80)" />
          );
          acc += len;
          return el;
        })}
        <text x="80" y="90" textAnchor="middle" className="donut-num" style={{ fill: '#fff' }}>{SUM}</text>
      </svg>
      <svg viewBox="0 0 250 130" className="bars">
  {[0, 4, 8].map((t) => {
    const y = 100 - (t / 8) * 80;
    return (
      <g key={t}>
        <line x1="28" x2="250" y1={y} y2={y} stroke="rgba(255,255,255,.12)" strokeDasharray={t === 0 ? '0' : '3 4'} />
        <text x="20" y={y + 3.5} textAnchor="end" fontSize="9" fill="rgba(255,255,255,.5)">{t}</text>
      </g>
    );
  })}
  {PREVIEW.map((p, i) => {
    const slot = 55, bw = 30, r = 6;
    const x = 28 + i * slot + (slot - bw) / 2;
    const h = (p.v / 8) * 80;
    const y = 100 - h;
    return (
      <g key={p.name}>
        <path
          d={`M${x} 100V${y + r}Q${x} ${y} ${x + r} ${y}H${x + bw - r}Q${x + bw} ${y} ${x + bw} ${y + r}V100Z`}
          fill={p.color} className="bar-fill" style={{ animationDelay: `${i * 80}ms` }} />
        <text x={x + bw / 2} y={y - 5} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{p.v}</text>
        <text x={x + bw / 2} y={115} textAnchor="middle" fontSize="9.5" fill="rgba(255,255,255,.6)">{p.name}</text>
      </g>
    );
  })}
</svg>
    </div>
  );
}

export default function LoginPage() {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const switchMode = () => { setIsSignup((v) => !v); setErrors({}); };

  const submit = async (e) => {
    e.preventDefault();
    const found = validateAuth(form, isSignup);
    if (Object.keys(found).length) return setErrors(found);
    setBusy(true);
    try {
      await (isSignup ? signup(form) : login(form));
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      toast.error(errorMessage(err));
      setBusy(false);
    }
  };

  const field = (id, label, props) => (
    <div className={`field ${errors[id] ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} value={form[id]} onChange={set(id)} {...props} />
      {errors[id] && <small>{errors[id]}</small>}
    </div>
  );

  return (
    <div className="auth">
      <aside className="auth-side">
        <div className="brand"><LogoMark /><span>LeadFlow</span></div>
        <div>
          <h1>Every lead,<br />exactly where it stands.</h1>
          <p>Capture leads, move them through your pipeline and see the whole picture at a glance.</p>
        </div>
        <div className="demo" aria-hidden="true">
          <PreviewCharts />
          <div className="demo-row"><b>Asha Rao</b><span>Acme Inc.</span><em className="badge badge-qualified"><i />Qualified</em></div>
          <div className="demo-row"><b>Kiran Patel</b><span>Northwind</span><em className="badge badge-contacted"><i />Contacted</em></div>
          <div className="demo-row"><b>Meera Shah</b><span>Globex</span><em className="badge badge-new"><i />New</em></div>
        </div>
      </aside>

      <main className="auth-main">
        <form className="auth-card" noValidate onSubmit={submit}>
          <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
          <p className="muted">{isSignup ? 'Start tracking your leads in minutes.' : 'Log in to manage your leads.'}</p>

          {isSignup && field('name', 'Full name', { placeholder: 'Your name', autoFocus: true })}
          {field('email', 'Email', { type: 'email', placeholder: 'you@company.com', autoFocus: !isSignup })}

          <div className={`field ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">Password</label>
            <div className="pw">
              <input id="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="At least 6 characters" />
              <button type="button" className="icon-btn pw-toggle" onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <small>{errors.password}</small>}
          </div>

          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
          </button>

          <p className="auth-switch">
            {isSignup ? 'Already have an account?' : 'New to LeadFlow?'}{' '}
            <button type="button" className="link" onClick={switchMode}>{isSignup ? 'Log in' : 'Create an account'}</button>
          </p>
        </form>
      </main>
    </div>
  );
}
