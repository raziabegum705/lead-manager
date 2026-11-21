import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';
import { STATUSES } from '../config/constants';
import { errorMessage } from '../utils/validate';
import Navbar from '../components/Navbar';
import DashboardCharts from '../components/DashboardCharts';
import { useAuth } from '../context/AuthContext';
import { avatarStyle } from '../utils/avatar';
import StatusBadge from '../components/StatusBadge';
import LeadModal from '../components/LeadModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { SearchIcon, PlusIcon, EditIcon, TrashIcon, SortIcon } from '../components/Icons';

const LIMIT = 10;
const COLUMNS = [
  { key: 'name', label: 'Lead', sortable: true },
  { key: 'company', label: 'Company', sortable: true },
  { key: 'source', label: 'Source' },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Added', sortable: true },
];

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function LeadsPage() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const [filters, setFilters] = useState({ search: '', status: '', sort: 'createdAt', order: 'desc', page: 1 });
  const [searchInput, setSearchInput] = useState('');
  const [data, setData] = useState({ leads: [], total: 0, pages: 1 });
  const [stats, setStats] = useState({ total: 0, New: 0, Contacted: 0, Qualified: 0, Lost: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ open: false, lead: null });
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const reqId = useRef(0);

  // Debounce the search box so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => (f.search === searchInput.trim() ? f : { ...f, search: searchInput.trim(), page: 1 }));
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchLeads = useCallback(async () => {
    const id = ++reqId.current; // ignore out-of-order responses
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/leads', { params: { ...filters, limit: LIMIT } });
      if (id === reqId.current) setData(data);
    } catch (err) {
      if (id === reqId.current) setError(errorMessage(err));
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/leads/stats');
      setStats(data);
    } catch { /* stat cards are non-critical */ }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const refresh = () => { fetchLeads(); fetchStats(); };
  const update = (patch) => setFilters((f) => ({ ...f, ...patch, page: patch.page ?? 1 }));

  const toggleSort = (key) =>
    update({ sort: key, order: filters.sort === key && filters.order === 'asc' ? 'desc' : 'asc' });

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/leads/${toDelete._id}`);
      toast.success('Lead deleted');
      setToDelete(null);
      if (data.leads.length === 1 && filters.page > 1) update({ page: filters.page - 1 });
      else refresh();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = filters.search || filters.status;
  const clearFilters = () => { setSearchInput(''); update({ search: '', status: '' }); };
  const from = data.total === 0 ? 0 : (filters.page - 1) * LIMIT + 1;
  const to = Math.min(filters.page * LIMIT, data.total);

  return (
    <>
      <Navbar />
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-top">
            <div>
              <h1>{greeting}, {user.name.split(' ')[0]}</h1>
              <p>{stats.total === 0 ? 'Your pipeline is empty. Add your first lead to get going.' : `${stats.total} ${stats.total === 1 ? 'lead' : 'leads'} in your pipeline, ${stats.Qualified} qualified.`}</p>
            </div>
            <button className="btn btn-light" onClick={() => setModal({ open: true, lead: null })}><PlusIcon /> Add lead</button>
          </div>
        </div>
      </div>

      <div className="page">
        <DashboardCharts stats={stats} active={filters.status} onSelect={(s) => update({ status: s })} />

        <section className="card">
          <div className="toolbar">
            <div className="search">
              <SearchIcon />
              <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by name, email or company" aria-label="Search leads" />
            </div>
            <select value={filters.status} onChange={(e) => update({ status: e.target.value })} aria-label="Filter by status">
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {error ? (
            <div className="empty">
              <h3>Couldn’t load your leads</h3>
              <p className="muted">{error}</p>
              <button className="btn btn-secondary" onClick={fetchLeads}>Try again</button>
            </div>
          ) : (
            <div className="table-wrap">
              <table className={loading ? 'is-loading' : ''}>
                <thead>
                  <tr>
                    {COLUMNS.map((c) => (
                      <th key={c.key} aria-sort={filters.sort === c.key ? (filters.order === 'asc' ? 'ascending' : 'descending') : 'none'}>
                        {c.sortable ? (
                          <button className="th-btn" onClick={() => toggleSort(c.key)}>
                            {c.label} <SortIcon dir={filters.sort === c.key ? filters.order : null} />
                          </button>
                        ) : c.label}
                      </th>
                    ))}
                    <th className="col-actions"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {data.leads.map((l) => (
                    <tr key={l._id}>
                      <td>
                        <div className="lead-cell">
                          <div className="avatar avatar-sm" style={avatarStyle(l.name)}>{l.name.charAt(0).toUpperCase()}</div>
                          <div><strong>{l.name}</strong><span>{l.email}</span></div>
                        </div>
                      </td>
                      <td>{l.company}<span className="sub">{l.phone}</span></td>
                      <td>{l.source}</td>
                      <td><StatusBadge status={l.status} /></td>
                      <td className="nowrap">{fmtDate(l.createdAt)}</td>
                      <td className="col-actions">
                        <button className="icon-btn" aria-label={`Edit ${l.name}`} onClick={() => setModal({ open: true, lead: l })}><EditIcon /></button>
                        <button className="icon-btn icon-danger" aria-label={`Delete ${l.name}`} onClick={() => setToDelete(l)}><TrashIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {loading && data.leads.length === 0 && <div className="empty"><span className="spinner" /></div>}

              {!loading && data.leads.length === 0 && (
                <div className="empty">
                  {hasFilters ? (
                    <>
                      <h3>No leads match your filters</h3>
                      <p className="muted">Try a different search term or status.</p>
                      <button className="btn btn-secondary" onClick={clearFilters}>Clear filters</button>
                    </>
                  ) : (
                    <>
                      <h3>No leads yet</h3>
                      <p className="muted">Add your first lead to start building your pipeline.</p>
                      <button className="btn btn-primary" onClick={() => setModal({ open: true, lead: null })}><PlusIcon /> Add lead</button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {!error && data.total > 0 && (
            <div className="pager">
              <span className="muted">Showing {from}–{to} of {data.total}</span>
              <div>
                <button className="btn btn-secondary btn-sm" disabled={filters.page <= 1} onClick={() => update({ page: filters.page - 1 })}>Previous</button>
                <span className="page-num">Page {filters.page} of {data.pages}</span>
                <button className="btn btn-secondary btn-sm" disabled={filters.page >= data.pages} onClick={() => update({ page: filters.page + 1 })}>Next</button>
              </div>
            </div>
          )}
        </section>
      </div>

      {modal.open && (
        <LeadModal lead={modal.lead} onClose={() => setModal({ open: false, lead: null })}
          onSaved={() => { setModal({ open: false, lead: null }); refresh(); }} />
      )}
      {toDelete && (
        <ConfirmDialog title="Delete this lead?" confirmLabel="Delete lead" busy={deleting}
          message={`${toDelete.name} from ${toDelete.company} will be permanently removed. This can’t be undone.`}
          onConfirm={confirmDelete} onCancel={() => !deleting && setToDelete(null)} />
      )}
    </>
  );
}
