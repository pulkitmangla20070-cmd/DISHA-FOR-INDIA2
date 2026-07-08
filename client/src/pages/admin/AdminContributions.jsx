import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, FileText, CheckCircle, Clock } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import StatusBadge from '../../components/volunteer/StatusBadge';
import Pagination from '../../components/volunteer/Pagination';
import SkeletonLoader from '../../components/volunteer/SkeletonLoader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import toast from 'react-hot-toast';

const AdminContributions = () => {
  const { contributions, updateContribution, deleteContribution } = useAdminData();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    setStats({
      total: contributions.length,
      pending: contributions.filter(c => c.status === 'pending').length,
      approved: contributions.filter(c => c.status === 'approved').length,
      totalApprovedHours: contributions.filter(c => c.status === 'approved').reduce((acc, c) => acc + (c.hours || 0), 0)
    });
    setLoading(false);
  }, [contributions]);

  const handleStatusUpdate = (id, newStatus) => {
    updateContribution(id, { status: newStatus });
    toast.success(`Contribution ${newStatus}`);
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      deleteContribution(deleteTargetId);
      toast.success('Contribution deleted');
    }
    setShowConfirm(false);
    setDeleteTargetId(null);
  };

  const filteredContributions = contributions.filter(c => 
    c.volunteerName?.toLowerCase().includes(search.toLowerCase()) || 
    c.type?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Shield size={20} className="text-primary" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Contributions Review</h1>
          <p style={{ color: 'var(--color-body)', marginTop: '0.5rem' }}>Review volunteer submissions and logged hours for approval.</p>
        </div>
      </div>

      {loading ? <SkeletonLoader type="dashboard" /> : (
        <>
          {stats && (
            <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', borderRadius: '50%' }}><Clock size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.pending}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Pending Review</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: '50%' }}><CheckCircle size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.approved}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Approved</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#0ea5e9', borderRadius: '50%' }}><FileText size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.total}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Total Submissions</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '50%' }}><Clock size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.totalApprovedHours}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Total Approved Hours</div></div>
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Submissions</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
                  <input type="text" placeholder="Search submissions..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-control" style={{ paddingLeft: '2.25rem', width: '250px' }} />
                </div>
                <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Volunteer</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Type</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Description</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Hours</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Date</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContributions.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-body)' }}>No contributions found.</td></tr>
                  ) : (
                    filteredContributions.map((cont) => {
                      return (
                        <tr key={cont.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-heading)' }}>
                            {cont.volunteerName}
                          </td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{cont.type}</td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-body)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {cont.description}
                          </td>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>{cont.hours}</td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--color-body)' }}>
                            {new Date(cont.date).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <StatusBadge status={cont.status} />
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                               <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
                                onClick={() => handleStatusUpdate(cont.id, 'approved')}
                                disabled={cont.status === 'approved'}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                                onClick={() => handleStatusUpdate(cont.id, 'rejected')}
                                disabled={cont.status === 'rejected'}
                              >
                                Reject
                              </button>
                              <button 
                                className="btn btn-danger" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                onClick={() => { setDeleteTargetId(cont.id); setShowConfirm(true); }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '1rem 1.5rem' }}>
              <Pagination currentPage={1} totalPages={1} totalItems={filteredContributions.length} onPageChange={() => {}} />
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this contribution record? This action cannot be undone."
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminContributions;
