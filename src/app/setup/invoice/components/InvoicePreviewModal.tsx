'use client';

import jsPDF from 'jspdf';
import styles from './InvoicePreviewModal.module.css';
import { formatDateDisplay } from '@/lib/dateUtils';

interface InvoicePreviewData {
  id: string;
  invoiceNumber: string;
  date: string | null;
  userId: string;
  username: string | null;
  amount: number;
  taxAmount: number;
  bankCharges: number;
  totalAmount: number;
  serviceType: string | null;
}

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoicePreviewData | null;
}

const currency = (value: number) => `${Number(value || 0).toFixed(0)}`;

const TERMS: Array<{ heading: string; text: string }> = [
  {
    heading: 'Invoice Issuance:',
    text: 'Generated electronically through the official mobile application and are deemed valid without physical signature or stamp.',
  },
  {
    heading: 'Payment Processing:',
    text: 'All transactions are processed through designated banking channels and payment gateway service providers. The system shall not be held responsible for delays, failures, or errors arising from banking networks or third-party payment processors.',
  },
  {
    heading: 'Transaction Charges:',
    text: 'Any applicable transaction fees, service charges, or taxes imposed by banks or payment gateway providers shall be borne by the payer (resident), unless otherwise stated.',
  },
  {
    heading: 'Payment Confirmation:',
    text: 'Payment shall be considered successful only upon receipt of confirmation from the banking/payment gateway system. A digital receipt will be generated and made available within the application.',
  },
  {
    heading: 'Due Date & Late Payment:',
    text: 'Payments must be made on or before the due date specified in the invoice. Late payments may be subject to penalties, surcharges, or service restrictions as per policy.',
  },
  {
    heading: 'Disputes & Adjustments:',
    text: 'Any discrepancy in the invoice must be reported within a specified period (e.g., 7 days) from the date of issuance. After this period, the invoice shall be deemed accepted.',
  },
  {
    heading: 'Refund Policy:',
    text: 'Refunds, if applicable, shall be processed strictly in accordance with the policies of the respective bank or payment gateway. Processing time may vary depending on the financial institution.',
  },
  {
    heading: 'Failed Transactions:',
    text: 'In case of failed or incomplete transactions where the amount is deducted, residents are advised to contact their respective bank. The system shall assist where possible but does not guarantee resolution timelines.',
  },
  {
    heading: 'System Availability:',
    text: 'While efforts are made to ensure uninterrupted service, the application and payment system may be temporarily unavailable due to maintenance or technical issues.',
  },
  {
    heading: 'Data & Security:',
    text: 'All payment transactions are secured through encrypted channels. The system does not store sensitive banking information such as card details.',
  },
  {
    heading: 'Amendments:',
    text: 'These terms and conditions may be updated or revised at any time without prior notice. Continued use of the system constitutes acceptance of the updated terms.',
  },
  {
    heading: 'Governing Rules:',
    text: 'All transactions and disputes shall be subject to the applicable laws, rules, and regulations of the governing authority.',
  },
];

export default function InvoicePreviewModal({ isOpen, onClose, invoice }: InvoicePreviewModalProps) {
  if (!isOpen || !invoice) return null;

  const issueDate = invoice.date ? formatDateDisplay(invoice.date) : '-';
  const dueDate = invoice.date ? formatDateDisplay(new Date(new Date(invoice.date).getTime() + 8 * 24 * 60 * 60 * 1000).toISOString()) : '-';
  const timeText = '02:15 PM';
  const contact = '03312752177';
  const addressLine1 = '2-B East Street Ph-1';
  const addressLine2 = 'DHA Karachi-75500';
  const subtotal = (invoice.amount || 0) * 3;
  const totalPay = invoice.totalAmount || subtotal + (invoice.taxAmount || 0) + (invoice.bankCharges || 0);

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const left = 45;
    const right = 550;
    let y = 45;

    doc.setFontSize(30);
    doc.setTextColor(40, 167, 69);
    doc.text('INVOICE', right, y, { align: 'right' });

    y += 30;
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text(`Invoice No: ${invoice.invoiceNumber || '-'}`, left, y);
    doc.text(`User ID: ${invoice.userId || '-'}`, right, y, { align: 'right' });

    y += 18;
    doc.text(`Date & Time: ${issueDate} | ${timeText}`, left, y);
    doc.text(`Name: ${invoice.username || '-'}`, right, y, { align: 'right' });

    y += 24;
    doc.text(`Due Date: ${dueDate}`, left, y);
    doc.text(`Contact: ${contact}`, right, y, { align: 'right' });

    y += 18;
    doc.text(`Address: ${addressLine1}`, right, y, { align: 'right' });
    y += 14;
    doc.text(addressLine2, right, y, { align: 'right' });

    y += 18;
    doc.setFont(undefined, 'bold');
    doc.text('Description', left, y);
    doc.setFont(undefined, 'normal');

    y += 14;
    doc.setLineWidth(0.8);
    doc.setDrawColor(229, 231, 235);
    doc.line(left, y, right, y);

    y += 22;
    doc.setFont(undefined, 'bold');
    doc.text('Sr No.', left, y);
    doc.text('Invoice ID', left + 90, y);
    doc.text('Service Type', left + 220, y);
    doc.text('Amount', right, y, { align: 'right' });
    doc.setFont(undefined, 'normal');

    y += 14;
    doc.line(left, y, right, y);
    y += 18;

    const rowService = invoice.serviceType || 'RFID (Card Printing)';
    [1, 2, 3].forEach((index) => {
      doc.text(String(index).padStart(2, '0'), left, y);
      doc.text(invoice.invoiceNumber || '-', left + 90, y);
      doc.text(rowService, left + 220, y);
      doc.text(currency(invoice.amount), right, y, { align: 'right' });
      y += 20;
    });

    y += 6;
    doc.line(left, y, right, y);
    y += 20;

    [
      ['Total Amount', currency(subtotal)],
      ['Tax Amount', currency(invoice.taxAmount)],
      ['Bank Charges', currency(invoice.bankCharges)],
      ['Total Pay', currency(totalPay)],
    ].forEach(([label, value]) => {
      doc.text(label, right - 160, y);
      doc.text(value, right, y, { align: 'right' });
      y += 18;
    });

    y += 10;
    doc.text('Terms:', left, y);
    y += 14;
    doc.setFontSize(9);
    TERMS.forEach((term, index) => {
      const wrapped = doc.splitTextToSize(`${index + 1}. ${term.heading} ${term.text}`, right - left - 8);
      doc.text(wrapped, left, y);
      y += wrapped.length * 11 + 2;
    });

    doc.save(`${invoice.invoiceNumber || 'invoice'}.pdf`);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Invoice PDF</h2>
          <div className={styles.actions}>
            <button type="button" className={styles.downloadButton} onClick={downloadPdf}>
              Download PDF
            </button>
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
              x
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.invoiceSheet}>
            <div className={styles.topRow}>
              <div className={styles.logoBlock}>
                <img src="/icons/Stats/L.png" alt="DHA Logo" className={styles.logoImage} />
              </div>
              <div className={styles.metaLeft}>
                <p className={styles.metaText}><strong>Invoice No:</strong> {invoice.invoiceNumber || '-'}</p>
                <p className={styles.metaText}><strong>Date & Time:</strong> {issueDate} | {timeText}</p>
                <p className={styles.metaText}><strong>Due Date:</strong> {dueDate}</p>
              </div>
              <div className={styles.metaRight}>
                <h3 className={styles.invoiceHeading}>INVOICE</h3>
                <p className={styles.metaText}><strong>User ID:</strong> {invoice.userId || '-'}</p>
                <p className={styles.metaText}><strong>Name:</strong> {invoice.username || '-'}</p>
                <p className={styles.metaText}><strong>Contact:</strong> {contact}</p>
                <p className={styles.metaText}><strong>Address:</strong> {addressLine1}</p>
                <p className={styles.metaText}>{addressLine2}</p>
              </div>
            </div>

            <p className={styles.descriptionHeading}>Description</p>
            <div className={styles.lineDivider} />
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Invoice ID</th>
                  <th>Service Type</th>
                  <th className={styles.amountCell}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((index) => (
                  <tr key={index}>
                    <td>{String(index).padStart(2, '0')}</td>
                    <td>{invoice.invoiceNumber || '-'}</td>
                    <td>{invoice.serviceType || 'RFID (Card Printing)'}</td>
                    <td className={styles.amountCell}>{currency(invoice.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.totalsRow}>
              <table className={styles.totalsTable}>
                <tbody>
                  <tr>
                    <td className={styles.totalsLabel}>Total Amount</td>
                    <td className={styles.totalsValue}>{currency(invoice.amount * 3)}</td>
                  </tr>
                  <tr>
                    <td className={styles.totalsLabel}>Tax Amount</td>
                    <td className={styles.totalsValue}>{currency(invoice.taxAmount)}</td>
                  </tr>
                  <tr>
                    <td className={styles.totalsLabel}>Bank Charges</td>
                    <td className={styles.totalsValue}>{currency(invoice.bankCharges)}</td>
                  </tr>
                  <tr>
                    <td className={styles.totalsLabel}>Total Pay</td>
                    <td className={styles.totalsValue}>{currency(totalPay)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className={styles.termsTitle}>Terms:</h4>
            <ol className={styles.termsList}>
              {TERMS.map((term, index) => (
                <li key={term.heading + index}>
                  <strong>{term.heading}</strong> {term.text}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
