import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  vatNumber?: string;
}

interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  amount: number;
  tva: number;
  description: string;
  paymentMethod: string;
  client: CompanyInfo;
}

const SELLER_INFO = {
  name: 'B-SINA',
  address: '20 BD du 26ème R.I',
  zipCode: '54000',
  city: 'NANCY',
  country: 'France',
  siret: '912 819 422 00011',
  vatNumber: 'FR62912819422'
};

export async function generateInvoicePDF(data: InvoiceData): Promise<Blob> {
  const doc = new jsPDF();

  // Helper function to add multiline text
  const addMultiLineText = (text: string, x: number, y: number, maxWidth: number) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length;
  };

  // Set font
  doc.setFont('helvetica');

  // Header
  doc.setFontSize(20);
  doc.text('FACTURE', doc.internal.pageSize.width / 2, 20, { align: 'center' });

  // Invoice details
  doc.setFontSize(10);
  doc.text(`Facture N° : ${data.invoiceNumber}`, 150, 35);
  doc.text(`Date : ${format(data.date, 'dd/MM/yyyy', { locale: fr })}`, 150, 42);

  // Seller info
  doc.setFontSize(12);
  doc.text('Émetteur :', 15, 35);
  doc.setFontSize(10);
  let y = 42;
  doc.text(SELLER_INFO.name, 15, y);
  doc.text(SELLER_INFO.address, 15, y + 7);
  doc.text(`${SELLER_INFO.zipCode} ${SELLER_INFO.city}`, 15, y + 14);
  doc.text(SELLER_INFO.country, 15, y + 21);
  doc.text(`SIRET : ${SELLER_INFO.siret}`, 15, y + 28);
  doc.text(`N° TVA : ${SELLER_INFO.vatNumber}`, 15, y + 35);

  // Client info
  doc.setFontSize(12);
  doc.text('Client :', 15, 100);
  doc.setFontSize(10);
  y = 107;
  doc.text(data.client.name, 15, y);
  doc.text(data.client.address, 15, y + 7);
  doc.text(`${data.client.zipCode} ${data.client.city}`, 15, y + 14);
  doc.text(data.client.country, 15, y + 21);
  if (data.client.vatNumber) {
    doc.text(`N° TVA : ${data.client.vatNumber}`, 15, y + 28);
  }

  // Table
  (doc as any).autoTable({
    startY: 150,
    head: [['Description', 'Montant HT', 'TVA (20%)', 'Total TTC']],
    body: [
      [
        data.description,
        `${data.amount.toFixed(2)} €`,
        `${data.tva.toFixed(2)} €`,
        `${(data.amount + data.tva).toFixed(2)} €`
      ]
    ],
    theme: 'striped',
    headStyles: {
      fillColor: [102, 51, 153],
      textColor: 255,
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 10
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 35, halign: 'right' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' }
    }
  });

  // Totals
  y = (doc as any).lastAutoTable.finalY + 20;
  doc.text(`Montant HT : ${data.amount.toFixed(2)} €`, 150, y, { align: 'right' });
  doc.text(`TVA (20%) : ${data.tva.toFixed(2)} €`, 150, y + 7, { align: 'right' });
  doc.setFontSize(12);
  doc.text(`Total TTC : ${(data.amount + data.tva).toFixed(2)} €`, 150, y + 17, { align: 'right' });

  // Payment method
  doc.setFontSize(10);
  doc.text(`Mode de paiement : ${data.paymentMethod}`, 15, y + 30);

  // Footer
  const bottomY = doc.internal.pageSize.height - 20;
  doc.setFontSize(8);
  doc.text('B-SINA - SIRET : 912 819 422 00011', doc.internal.pageSize.width / 2, bottomY - 14, { align: 'center' });
  doc.text('20 BD du 26ème R.I, 54000 NANCY', doc.internal.pageSize.width / 2, bottomY - 7, { align: 'center' });
  doc.text('TVA Intracommunautaire : FR62912819422', doc.internal.pageSize.width / 2, bottomY, { align: 'center' });

  return doc.output('blob');
}