import DashboardLayout from '../../components/layout/DashboardLayout';
import ProfileForm from './components/ProfileForm';

export default function ProfilePage() {
  return (
    <DashboardLayout pageTitle="Profile">
      <ProfileForm />
    </DashboardLayout>
  );
}