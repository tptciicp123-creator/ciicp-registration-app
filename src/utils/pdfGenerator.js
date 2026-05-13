import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { TPT_BRAND } from './branding';

export const generateReceipt = (student, installment) => {
  const doc = jsPDF();
  const blue = [0, 84, 166]; // #0054A6
  const yellow = [255, 210, 0]; // #FFD200

  // 1. Header with Logo
  doc.setFillColor(...blue);
  doc.rect(0, 0, 210, 45, 'F');
  
  // Add Logo
  doc.addImage(TPT_BRAND.logo, 'JPEG', 15, 8, 28, 28);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('THIAGARAJAR POLYTECHNIC COLLEGE', 50, 22);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Continuing Education Centre (CIICP)', 50, 32);

  // 2. Receipt Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', 105, 65, { align: 'center' });
  
  // Decorative line
  doc.setDrawColor(...yellow);
  doc.setLineWidth(1);
  doc.line(80, 68, 130, 68);

  // 3. Receipt Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Receipt No: TPT/CEC/${Date.now().toString().slice(-6)}`, 20, 85);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 85);

  // 4. Student Table
  doc.autoTable({
    startY: 95,
    head: [['Student Information', 'Details']],
    body: [
      ['Full Name', (student.fullName || student.name).toUpperCase()],
      ['Application No', student.appNo],
      ['Program Enrolled', student.courseName || 'Selected Course'],
      ['Email ID', student.email],
    ],
    headStyles: { fillColor: blue, textColor: 255, fontStyle: 'bold' },
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 5 }
  });

  // 5. Payment Table
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [['Description', 'Installment', 'Amount Paid']],
    body: [
      [`Course Fee Payment for ${student.courseName}`, `Installment ${installment.id}`, `INR ${installment.amount.toLocaleString()}`]
    ],
    headStyles: { fillColor: blue, textColor: 255 },
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 6 }
  });

  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`Total Paid: INR ${installment.amount.toLocaleString()}`, 190, finalY, { align: 'right' });

  // 6. Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Thiagarajar Polytechnic College, Junction Main Road, Salem - 636 005.', 105, 280, { align: 'center' });
  doc.text('This is an official computer-generated receipt. No signature required.', 105, 285, { align: 'center' });

  doc.save(`TPT_Receipt_${student.appNo}_Inst_${installment.id}.pdf`);
};

export const generateIDCard = (student) => {
  const doc = jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 54]
  });

  const blue = [0, 84, 166];
  const yellow = [255, 210, 0];

  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 85.6, 54, 'F');

  // Header
  doc.setFillColor(...blue);
  doc.rect(0, 0, 85.6, 16, 'F');
  
  // College Logo
  doc.addImage(TPT_BRAND.logo, 'JPEG', 4, 3, 10, 10);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('THIAGARAJAR POLYTECHNIC COLLEGE', 45, 7, { align: 'center' });
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.text('CONTINUING EDUCATION CENTRE (CIICP)', 45, 10, { align: 'center' });

  // Yellow Accent Bar
  doc.setFillColor(...yellow);
  doc.rect(0, 16, 85.6, 1, 'F');

  // Photo
  if (student.photoUrl && student.photoUrl.startsWith('data:image')) {
    try {
      doc.addImage(student.photoUrl, 'JPEG', 6, 21, 18, 22);
    } catch (e) {
      console.error(e);
      doc.setDrawColor(200, 200, 200);
      doc.rect(6, 21, 18, 22);
    }
  } else {
    doc.setFillColor(240, 240, 240);
    doc.rect(6, 21, 18, 22, 'F');
  }

  // Student Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text((student.fullName || student.name).toUpperCase(), 28, 25);
  
  doc.setFontSize(6);
  doc.setTextColor(...blue);
  doc.text(student.courseName || 'STUDENT', 28, 29);

  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`App No: ${student.appNo}`, 28, 36);
  doc.text(`ID No: ${student.uniqueId || student.appNo}`, 28, 40);
  doc.text(`Valid till: June 2026`, 28, 44);

  // QR Code
  const verificationUrl = `http://localhost:5173/verify/${student.uniqueId || student.appNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verificationUrl)}`;
  doc.addImage(qrCodeUrl, 'PNG', 65, 21, 15, 15);
  
  doc.setFontSize(4);
  doc.text('VERIFY ID', 72.5, 38, { align: 'center' });

  // Footer bar
  doc.setFillColor(...blue);
  doc.rect(0, 51, 85.6, 3, 'F');

  doc.save(`TPT_ID_Card_${student.appNo}.pdf`);
};
