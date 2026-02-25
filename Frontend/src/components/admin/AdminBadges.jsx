// Shared small display components used across admin tabs

export const RoleBadge = ({ role }) => {
  const map = {
    admin: 'bg-red-100 text-red-700 border-red-200',
    manager: 'bg-blue-100 text-blue-700 border-blue-200',
    employee: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[role] || 'bg-sec-card-bg text-text-sec'}`}>
      {role}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-sec-card-bg text-text-sec'}`}>
      {status}
    </span>
  );
};
