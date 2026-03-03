import DashboardLayout from '../../components/layout/DashboardLayout';
import NotificationList from './components/NotificationList';

export default function NotificationPage() {
  return (
    <DashboardLayout pageTitle="Notifications">
      <NotificationList />
    </DashboardLayout>
  );
}