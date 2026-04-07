"use client";
import DashboardLayout from '../../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../../components/tables/DataTable';
import { familyDetails, vehicles, workers, visitors } from './familyData';
import styles from './Family.module.css';

const familyColumns: Column<any>[] = [
  { key: 'sno', header: 'S.No' },
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
  { key: 'sno', header: 'S.No' },
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
  { key: 'sno', header: 'S.No' },
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
  { key: 'sno', header: 'S.No' },
  { key: 'name', header: 'Name' },
  { key: 'vehicleInfo', header: 'Vehicle Info' },
  { key: 'visitDetail', header: 'Visit Detail' },
  { key: 'validity', header: 'Validity' },
  { key: 'cnic', header: 'CNIC/NICOP No.' },
  { key: 'hostDetails', header: 'Host Details', render: () => <img src="/icons/Host.svg" alt="Host" width={24} height={24} /> },
  { key: 'status', header: 'Status', render: (value) => <StatusBadge status={value} /> },
];

export default function FamilyDetailsPage() {
  const getFamilyRowStatus = (row: any) => row.cardStatus;
  const getVehicleRowStatus = (row: any) => row.status;
  const getWorkerRowStatus = (row: any) => row.workerStatus;
  const getVisitorRowStatus = (row: any) => row.status;

  // Add S.No to each dataset
  const familyDetailsWithSno = familyDetails.map((row, idx) => ({ ...row, sno: idx + 1 }));
  const vehiclesWithSno = vehicles.map((row, idx) => ({ ...row, sno: idx + 1 }));
  const workersWithSno = workers.map((row, idx) => ({ ...row, sno: idx + 1 }));
  const visitorsWithSno = visitors.map((row, idx) => ({ ...row, sno: idx + 1 }));

  return (
    <DashboardLayout pageTitle="Family Details">
      <div className={styles.container}>
        {}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Family Details</span>
            <a className={styles.seeMore}>See More</a>
          </div>
          <DataTable columns={familyColumns} data={familyDetailsWithSno} showAddButton={false} getRowStatus={getFamilyRowStatus} />
        </div>
        {}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <span>Vehicles</span>
            <a className={styles.seeMore}>See More</a>
          </div>
          <DataTable columns={vehicleColumns} data={vehiclesWithSno} showAddButton={false} getRowStatus={getVehicleRowStatus} />
        </div>
        {}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <span>Workers</span>
            <a className={styles.seeMore}>See More</a>
          </div>
          <DataTable columns={workerColumns} data={workersWithSno} showAddButton={false} getRowStatus={getWorkerRowStatus} />
        </div>
        {}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <span>Visitor</span>
            <a className={styles.seeMore}>See More</a>
          </div>
          <DataTable columns={visitorColumns} data={visitorsWithSno} showAddButton={false} getRowStatus={getVisitorRowStatus} />
        </div>
      </div>
    </DashboardLayout>
  );
}
