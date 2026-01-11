/**
 * File Downloader
 * Purpose: Handle file downloads
 */

/**
 * Download blob as file
 * @param {Blob} blob - File blob
 * @param {string} filename - Desired filename
 */
export function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Download CV as PDF
 * @param {Blob} pdfBlob - PDF blob
 * @param {string} filename - Base filename (without extension)
 */
export function downloadPDF(pdfBlob, filename = 'resume') {
    downloadFile(pdfBlob, `${filename}.pdf`);
}

/**
 * Download CV as DOCX
 * @param {Blob} docxBlob - DOCX blob
 * @param {string} filename - Base filename (without extension)
 */
export function downloadDOCX(docxBlob, filename = 'resume') {
    downloadFile(docxBlob, `${filename}.docx`);
}
