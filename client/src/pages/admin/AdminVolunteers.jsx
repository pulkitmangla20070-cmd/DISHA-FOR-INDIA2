import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Shield, UserCheck, UserPlus, Clock } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import StatusBadge from '../../components/volunteer/StatusBadge';
import Pagination from '../../components/volunteer/Pagination';
import SkeletonLoader from '../../components/volunteer/SkeletonLoader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import toast from 'react-hot-toast';

const AdminVolunteers = () => {
  const { volunteers, deleteVolunteer } = useAdminData();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    setStats({
      total: volunteers.length,
      active: volunteers.filter(v => v.status === 'Active').length,
      pending: volunteers.filter(v => v.status === 'Pending').length,
      totalHours: volunteers.reduce((acc, v) => acc + (v.hours || 0), 0)
    });
    setLoading(false);
  }, [volunteers]);

  const handleDelete = () => {
    if (deleteTargetId) {
      deleteVolunteer(deleteTargetId);
      toast.success('Volunteer deleted successfully');
    }
    setShowConfirm(false);
    setDeleteTargetId(null);
  };

  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Shield size={20} className="text-primary" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Volunteer Directory</h1>
          <p style={{ color: 'var(--color-body)', marginTop: '0.5rem' }}>Manage and oversee registered platform volunteers.</p>
        </div>
      </div>

      {loading ? <SkeletonLoader type="dashboard" /> : (
        <>
          {stats && (
            <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', borderRadius: '50%' }}><Users size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.total}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Total Volunteers</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: '50%' }}><UserCheck size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.active}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Active Directory</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', borderRadius: '50%' }}><UserPlus size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.pending}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Pending Approval</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '50%' }}><Clock size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.totalHours}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Cumulative Hours</div></div>
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Volunteers List</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
                  <input type="text" placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-control" style={{ paddingLeft: '2.25rem', width: '250px' }} />
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
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Location</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Join Date</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Hours</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVolunteers.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-body)' }}>No volunteers found.</td></tr>
                  ) : (
                    filteredVolunteers.map((vol) => {
                      const initials = (vol.name || '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                      
                      return (
                        <tr key={vol.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                                {initials}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--color-heading)' }}>{vol.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-body)' }}>{vol.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{vol.location}</td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--color-body)' }}>
                            {new Date(vol.joinDate).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>{vol.hours}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <StatusBadge status={vol.status} />
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-danger" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                onClick={() => { setDeleteTargetId(vol.id); setShowConfirm(true); }}
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
              <Pagination currentPage={1} totalPages={1} totalItems={filteredVolunteers.length} onPageChange={() => {}} />
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Delete"
        message="Are you sure you want to permanently delete this volunteer? This action cannot be undone."
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminVolunteers;
