document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a JPG image to convert.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function() {
        const imageData = reader.result;

        const pdfDoc = await PDFLib.PDFDocument.create();
        const page = pdfDoc.addPage();
        
        const jpgImage = await pdfDoc.embedJpg(imageData);
        const { width, height } = jpgImage.scale(1);
        
        page.setSize(width, height);
        page.drawImage(jpgImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });

        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

        // Automatically download the PDF
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = 'converted.pdf';
        downloadLink.click();

        // Open the PDF in a new tab for preview
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    reader.readAsDataURL(file);
});
