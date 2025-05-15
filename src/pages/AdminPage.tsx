
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '@/components/admin/AdminDashboard';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);
  
  if (!isAdmin) {
    return null;
  }

  return <AdminDashboard />;
};

export default AdminPage;
