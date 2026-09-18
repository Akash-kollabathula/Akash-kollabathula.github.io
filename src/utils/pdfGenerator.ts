import { jsPDF } from 'jspdf';
import { portfolioData } from '../data/portfolioData';

/**
 * Generates a clean, professional, high-density ATS-compatible SDET resume PDF.
 * Downloads directly as Akash_Kollabathula_SDET_Resume.pdf
 */
export function downloadResumePDF(onProgress?: (percent: number) => void): Promise<string> {
  return new Promise((resolve) => {
    onProgress?.(10);
    
    setTimeout(() => {
      onProgress?.(30);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 36;
      const contentWidth = pageWidth - margin * 2;
      let y = 40;

      onProgress?.(50);

      // --- HEADER ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(portfolioData.name.toUpperCase(), margin, y);
      y += 18;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(3, 105, 161); // sky-700
      doc.text(portfolioData.role, margin, y);
      y += 14;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105); // slate-600
      const contactLine = `Email: ${portfolioData.contacts.email}  |  Phone: ${portfolioData.contacts.phone}  |  LinkedIn: linkedin.com/in/akash-kollabathula  |  GitHub: github.com/akash-kollabathula`;
      doc.text(contactLine, margin, y);
      y += 10;

      // Divider
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.setLineWidth(1);
      doc.line(margin, y, margin + contentWidth, y);
      y += 14;

      // Helper for Section Headers
      const renderSectionHeader = (title: string) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42);
        doc.text(title.toUpperCase(), margin, y);
        y += 4;
        doc.setDrawColor(14, 165, 233); // sky-500
        doc.setLineWidth(1);
        doc.line(margin, y, margin + contentWidth, y);
        y += 11;
      };

      // --- PROFESSIONAL SUMMARY ---
      renderSectionHeader('Professional Summary');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const summaryLines = doc.splitTextToSize(portfolioData.summary, contentWidth);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 11 + 6;

      onProgress?.(65);

      // --- TECHNICAL SKILLS ---
      renderSectionHeader('Technical Skills');
      doc.setFontSize(8.5);
      portfolioData.skillsCategories.forEach((cat) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        const prefix = `• ${cat.title}: `;
        doc.text(prefix, margin + 4, y);
        const prefixWidth = doc.getTextWidth(prefix);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const skillText = cat.skills.join(', ');
        const skillLines = doc.splitTextToSize(skillText, contentWidth - prefixWidth - 6);
        
        if (skillLines.length > 0) {
          doc.text(skillLines[0], margin + 4 + prefixWidth, y);
          for (let i = 1; i < skillLines.length; i++) {
            y += 10;
            doc.text(skillLines[i], margin + 4 + prefixWidth, y);
          }
        }
        y += 11;
      });
      y += 4;

      onProgress?.(80);

      // --- PROFESSIONAL EXPERIENCE ---
      renderSectionHeader('Professional Experience');
      portfolioData.experience.forEach((exp) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(exp.role, margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(3, 105, 161);
        const compText = ` — ${exp.company}`;
        const roleWidth = doc.getTextWidth(exp.role);
        doc.text(compText, margin + roleWidth, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        const periodWidth = doc.getTextWidth(exp.period);
        doc.text(exp.period, margin + contentWidth - periodWidth, y);
        y += 11;

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`Core Technologies: ${exp.stack.join(', ')}`, margin + 4, y);
        y += 11;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.2);
        doc.setTextColor(51, 65, 85);
        exp.responsibilities.forEach((resp) => {
          const bulletLines = doc.splitTextToSize(`• ${resp}`, contentWidth - 10);
          doc.text(bulletLines, margin + 4, y);
          y += bulletLines.length * 10 + 2;
        });
        y += 4;
      });

      onProgress?.(90);

      // --- KEY PROJECTS ---
      renderSectionHeader('Featured Automation Projects');
      portfolioData.projects.forEach((proj) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(proj.title, margin, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        const stackText = `[ ${proj.techStack.join(' | ')} ]`;
        const stackWidth = doc.getTextWidth(stackText);
        doc.text(stackText, margin + contentWidth - stackWidth, y);
        y += 10;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.2);
        doc.setTextColor(51, 65, 85);
        const descLines = doc.splitTextToSize(proj.description, contentWidth - 8);
        doc.text(descLines, margin + 4, y);
        y += descLines.length * 9.5 + 2;

        proj.highlights.slice(0, 3).forEach((h) => {
          const hLines = doc.splitTextToSize(`• ${h}`, contentWidth - 12);
          doc.text(hLines, margin + 8, y);
          y += hLines.length * 9.5 + 1.5;
        });
        y += 4;
      });

      // --- EDUCATION ---
      renderSectionHeader('Education');
      portfolioData.education.forEach((edu) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(edu.degree, margin, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const fieldText = ` in ${edu.field}`;
        const degWidth = doc.getTextWidth(edu.degree);
        doc.text(fieldText, margin + degWidth, y);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(3, 105, 161);
        const cgpaText = `CGPA: ${edu.cgpa}`;
        const cgpaWidth = doc.getTextWidth(cgpaText);
        doc.text(cgpaText, margin + contentWidth - cgpaWidth, y);
        y += 11;
      });

      const fileName = 'Akash_Kollabathula_SDET_Resume.pdf';
      doc.save(fileName);
      onProgress?.(100);
      resolve(fileName);
    }, 250);
  });
}
