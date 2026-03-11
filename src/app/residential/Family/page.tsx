"use client";
import DashboardLayout from '../../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../../components/tables/DataTable';
import { familyDetails, vehicles, workers, visitors } from './familyData';

const familyColumns: Column<any>[] = [
  { key: 'name', header: 'Name' },
  { key: 'relation', header: 'Relation' },
  { key: 'phone', header: 'Phone' },
  { key: 'dob', header: 'DOB' },
  { key: 'cnic', header: 'CNIC / NICOP No.' },
  { key: 'residentCard', header: 'Resident Card No.' },
  { key: 'issueDate', header: 'Issue Date' },
  { key: 'expiryDate', header: 'Expiry Date' },
  { key: 'cardStatus', header: 'Card Status', render: (value) => <StatusBadge status={value} /> },
];

const vehicleColumns: Column<any>[] = [
  { key: 'licensePlate', header: 'License Plate' },
  { key: 'vehicleETagId', header: 'Vehicle E-Tag ID' },
  { key: 'eTagType', header: 'E-Tag Type' },
  { key: 'issueDate', header: 'Issue Date' },
  { key: 'expiryDate', header: 'Expiry Date' },
  { key: 'tagStatus', header: 'Tag Status', render: (value) => <StatusBadge status={value} /> },
  { key: 'ownership', header: 'Ownership' },
  { key: 'make', header: 'Make' },
  { key: 'model', header: 'Model' },
  { key: 'year', header: 'Year' },
  { key: 'color', header: 'Color' },
  { key: 'status', header: 'Status', render: (value) => <StatusBadge status={value} /> },
];

const workerColumns: Column<any>[] = [
  { key: 'name', header: 'Name' },
  { key: 'jobType', header: 'Job Type' },
  { key: 'phone', header: 'Phone' },
  { key: 'dob', header: 'DOB' },
  { key: 'cnic', header: 'CNIC/NICOP No.' },
  { key: 'policeVerification', header: 'Police Verification' },
  { key: 'workerCardDelivery', header: 'Worker Card Delivery' },
  { key: 'address', header: 'Address' },
  { key: 'workerStatus', header: 'Worker Status', render: (value) => <StatusBadge status={value} /> },
  { key: 'workerCard', header: 'Worker Card' },
];

const visitorColumns: Column<any>[] = [
  { key: 'name', header: 'Name' },
  { key: 'vehicleInfo', header: 'Vehicle Info' },
  { key: 'visitDetail', header: 'Visit Detail' },
  { key: 'validity', header: 'Validity' },
  { key: 'cnic', header: 'CNIC/NICOP No.' },
  { key: 'qrReference', header: 'QR Reference' },
  { key: 'hostDetails', header: 'Host Details', render: () => <img src="/icons/host.svg" alt="Host" width={24} height={24} /> },
  { key: 'status', header: 'Status', render: (value) => <StatusBadge status={value} /> },
];

export default function FamilyDetailsPage() {
  const getFamilyRowStatus = (row: any) => row.cardStatus;
  const getVehicleRowStatus = (row: any) => row.status;
  const getWorkerRowStatus = (row: any) => row.workerStatus;
  const getVisitorRowStatus = (row: any) => row.status;
  const seeMoreStyle = {
    color: '#1DBF73',
    fontWeight: 500,
    fontSize: 13,
    float: 'right' as const,
    marginTop: 2,
    textDecoration: 'none',
    cursor: 'pointer',
  };
  return (
    <DashboardLayout pageTitle="Family Details">
      <div style={{ background: '#F9FAFB', borderRadius: 12, padding: 24, margin: 16 }}>
        {}
         <span>Family Details</span>
         <a style={seeMoreStyle}>See More</a>
        <div style={{ border: '1.5px solid #B6D0F6', borderRadius: 8, marginBottom: 32, background: '#fff', boxShadow: '0 2px 8px #e3eafc40' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: 16, padding: '16px 24px', borderBottom: '1px solid #E3EAFD', background: '#F9FAFB', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
          </div>
          <DataTable columns={familyColumns} data={familyDetails} showAddButton={false} getRowStatus={getFamilyRowStatus} />
        </div>
        {}
        <div style={{ border: '1.5px solid #B6D0F6', borderRadius: 8, marginBottom: 32, background: '#fff', boxShadow: '0 2px 8px #e3eafc40' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: 16, padding: '16px 24px', borderBottom: '1px solid #E3EAFD', background: '#F9FAFB', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
            <span>Vehicles</span>
            <a style={seeMoreStyle}>See More</a>
          </div>
          <DataTable columns={vehicleColumns} data={vehicles} showAddButton={false} getRowStatus={getVehicleRowStatus} />
        </div>
        {}
        <div style={{ border: '1.5px solid #B6D0F6', borderRadius: 8, marginBottom: 32, background: '#fff', boxShadow: '0 2px 8px #e3eafc40' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: 16, padding: '16px 24px', borderBottom: '1px solid #E3EAFD', background: '#F9FAFB', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
            <span>Workers</span>
            <a style={seeMoreStyle}>See More</a>
          </div>
          <DataTable columns={workerColumns} data={workers} showAddButton={false} getRowStatus={getWorkerRowStatus} />
        </div>
        {}
        <div style={{ border: '1.5px solid #B6D0F6', borderRadius: 8, marginBottom: 0, background: '#fff', boxShadow: '0 2px 8px #e3eafc40' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: 16, padding: '16px 24px', borderBottom: '1px solid #E3EAFD', background: '#F9FAFB', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
            <span>Visitor</span>
            <a style={seeMoreStyle}>See More</a>
          </div>
          <DataTable columns={visitorColumns} data={visitors} showAddButton={false} getRowStatus={getVisitorRowStatus} />
        </div>
      </div>
    </DashboardLayout>
  );
}