import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';
export default function CpAgentPage() {
  const router = useRouter();
  
  return (
    <DashboardLayout pageTitle="CP Agent">
      <div>
        {}
      </div>
    </DashboardLayout>
  );
}