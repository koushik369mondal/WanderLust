document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('save-list-btn');
  const printBtn = document.getElementById('print-list-btn');
  const downloadBtn = document.getElementById('download-pdf-btn');
  const saveForm = document.getElementById('save-trip-form');
  const packingListDataInput = document.getElementById('packing-list-data');

  // Collect packing list items and their checked state
  function collectPackingListData() {
    const items = [];
    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
      items.push({
        item: checkbox.dataset.item,
        category: checkbox.dataset.category,
        packed: checkbox.checked
      });
    });
    return items;
  }

  // Save packing list to user's trips
  saveBtn.addEventListener('click', async () => {
    const packingListItems = collectPackingListData();
    if (packingListItems.length === 0) {
      alert('No items to save.');
      return;
    }

    // Prepare packing list JSON string
    const packingListJson = JSON.stringify({
      categories: packingListItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push({ item: item.item, packed: item.packed });
        return acc;
      }, {})
    });

    packingListDataInput.value = packingListJson;

    // Submit form via fetch
    try {
      const response = await fetch(saveForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(new FormData(saveForm))
      });

      const result = await response.json();
      if (result.success) {
        alert('Packing list saved successfully to your trips!');
      } else {
        alert('Failed to save packing list: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error saving packing list: ' + error.message);
    }
  });

  // Print packing list
  printBtn.addEventListener('click', () => {
    window.print();
  });

  // Download packing list as PDF
  downloadBtn.addEventListener('click', async () => {
    try {
      // Check if there are any items to download
      const packingListData = collectPackingListData();
      if (packingListData.length === 0) {
        alert('❌ No packing list items found. Please generate a packing list first.');
        return;
      }
      
      // Show loading state
      downloadBtn.innerHTML = '⏳ Generating PDF...';
      downloadBtn.disabled = true;
      downloadBtn.classList.remove('success');
      
      // Try primary PDF generation
      try {
        await generatePackingListPDF();
        
        // Show success state
        downloadBtn.innerHTML = '✅ Downloaded!';
        downloadBtn.classList.add('success');
        
        console.log('✅ Primary PDF generation successful');
        
      } catch (primaryError) {
        console.warn('Primary PDF generation failed, trying fallback:', primaryError.message);
        
        // Try fallback PDF generation
        await generateFallbackPDF();
        
        // Show success state for fallback
        downloadBtn.innerHTML = '✅ Downloaded!';
        downloadBtn.classList.add('success');
        
        console.log('✅ Fallback PDF generation successful');
      }
      
      // Reset after delay
      setTimeout(() => {
        downloadBtn.innerHTML = '📄 Download PDF';
        downloadBtn.disabled = false;
        downloadBtn.classList.remove('success');
      }, 2000);
      
    } catch (error) {
      console.error('All PDF generation methods failed:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Error generating PDF. Please try again.';
      if (error.message.includes('jsPDF') || error.message.includes('library')) {
        errorMessage = 'PDF library not loaded. Please refresh the page and try again.';
      } else if (error.message.includes('memory') || error.message.includes('size')) {
        errorMessage = 'Packing list too large. Try removing some items and try again.';
      } else if (error.message.includes('No items')) {
        errorMessage = 'No packing list items found. Please generate a packing list first.';
      }
      
      alert('❌ ' + errorMessage);
      
      // Reset button
      downloadBtn.innerHTML = '📄 Download PDF';
      downloadBtn.disabled = false;
      downloadBtn.classList.remove('success');
    }
  });

  // Generate PDF function
  async function generatePackingListPDF() {
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
      throw new Error('jsPDF library not loaded. Please refresh the page and try again.');
    }
    
    // Dynamically access jsPDF
    const { jsPDF } = window.jspdf;
    
    if (!jsPDF) {
      throw new Error('jsPDF library not properly initialized.');
    }

    // Collect current packing list data
    const packingListData = collectPackingListData();
    
    // Validate data
    if (!packingListData || packingListData.length === 0) {
      throw new Error('No packing list items found to generate PDF.');
    }
    
    // Get trip information from the page
    const tripDetails = getTripDetailsFromPage();
    
    // Create new PDF document
    const doc = new jsPDF();
    
    try {
      // Set document properties
      doc.setProperties({
        title: `${tripDetails.destination} - Packing List`,
        subject: 'Travel Packing List',
        author: 'WanderLust',
        creator: 'WanderLust Travel Platform',
        keywords: 'travel, packing, list, wanderlust'
      });
      
      // Generate PDF content
      await generatePDFContent(doc, tripDetails, packingListData);
      
      // Generate filename with safe characters
      const safeDestination = tripDetails.destination
        .replace(/[^a-z0-9\s]/gi, '')
        .replace(/\s+/g, '_')
        .substring(0, 30);
      
      const fileName = `${safeDestination}_PackingList_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Save the PDF
      doc.save(fileName);
      
      // Log success for debugging
      console.log('✅ PDF generated successfully:', fileName);
      
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      throw new Error('Failed to create PDF content. Please try again.');
    }
  }

  // Get trip details from the page
  function getTripDetailsFromPage() {
    const headerElement = document.querySelector('.packing-list-header h1');
    const tripDetailElements = document.querySelectorAll('.trip-detail');
    
    const details = {
      title: headerElement ? headerElement.textContent : 'Packing List',
      destination: 'Unknown Destination',
      duration: 'Unknown Duration',
      travelType: 'Unknown Type',
      activities: []
    };
    
    // Extract trip details from page elements
    tripDetailElements.forEach(element => {
      const text = element.textContent.trim();
      if (text.startsWith('📍')) {
        details.destination = text.replace('📍', '').trim();
      } else if (text.startsWith('📅')) {
        details.duration = text.replace('📅', '').trim();
      } else if (text.startsWith('👥')) {
        details.travelType = text.replace('👥', '').trim();
      } else if (text.startsWith('🎯')) {
        details.activities = text.replace('🎯', '').trim().split(', ');
      }
    });
    
    return details;
  }

  // Generate PDF content
  async function generatePDFContent(doc, tripDetails, packingListData) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Header with WanderLust branding
    doc.setFontSize(20);
    doc.setTextColor(0, 150, 136); // Teal color
    doc.text('WanderLust', margin, yPosition);
    
    // Add travel icon (using text)
    doc.setFontSize(16);
    doc.text('✈️', pageWidth - 30, yPosition);
    
    yPosition += 15;
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Travel Packing List', margin, yPosition);
    yPosition += 20;
    
    // Trip Information Box
    doc.setDrawColor(0, 150, 136);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 35);
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    
    // Trip details
    doc.text(`📍 Destination: ${tripDetails.destination}`, margin + 5, yPosition + 5);
    doc.text(`📅 Duration: ${tripDetails.duration}`, margin + 5, yPosition + 15);
    doc.text(`👥 Travel Type: ${tripDetails.travelType}`, margin + 5, yPosition + 25);
    
    if (tripDetails.activities && tripDetails.activities.length > 0) {
      const activitiesText = `🎯 Activities: ${tripDetails.activities.join(', ')}`;
      const splitActivities = doc.splitTextToSize(activitiesText, pageWidth - 2 * margin - 10);
      doc.text(splitActivities, margin + 5, yPosition + 35);
      yPosition += 10 * splitActivities.length;
    }
    
    yPosition += 45;
    
    // Generated date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;
    
    // Packing categories
    const categories = [
      { key: 'clothing', icon: '👕', title: 'Clothing' },
      { key: 'toiletries', icon: '🧴', title: 'Toiletries' },
      { key: 'gadgets', icon: '🔋', title: 'Gadgets' },
      { key: 'activityGear', icon: '🏕️', title: 'Activity Gear' },
      { key: 'healthEssentials', icon: '🩹', title: 'Health & Essentials' }
    ];
    
    for (const category of categories) {
      const categoryItems = packingListData.filter(item => item.category === category.key);
      
      if (categoryItems.length > 0) {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Category header
        doc.setFontSize(14);
        doc.setTextColor(0, 150, 136);
        doc.text(`${category.icon} ${category.title}`, margin, yPosition);
        yPosition += 10;
        
        // Category items
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        
        categoryItems.forEach(item => {
          if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = margin;
          }
          
          // Checkbox
          const checkboxSize = 3;
          doc.rect(margin + 5, yPosition - checkboxSize, checkboxSize, checkboxSize);
          
          // If item is packed, fill the checkbox
          if (item.packed) {
            doc.setFillColor(0, 150, 136);
            doc.rect(margin + 5, yPosition - checkboxSize, checkboxSize, checkboxSize, 'F');
            
            // Add checkmark
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.text('✓', margin + 5.5, yPosition - 0.5);
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(11);
          }
          
          // Item text
          const itemText = item.packed ? item.item : item.item;
          doc.text(itemText, margin + 12, yPosition);
          yPosition += 8;
        });
        
        yPosition += 10; // Space between categories
      }
    }
    
    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by WanderLust - Happy Travels! 🌍', margin, footerY);
    doc.text(`Page 1 of ${doc.internal.getNumberOfPages()}`, pageWidth - 40, footerY);
    
    // Add page numbers to additional pages if any
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Generated by WanderLust - Happy Travels! 🌍', margin, footerY);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, footerY);
    }
  }

  // Fallback PDF generation using simple text formatting
  async function generateFallbackPDF() {
    console.log('🔄 Attempting fallback PDF generation...');
    
    // Check for basic jsPDF availability
    if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
      throw new Error('PDF library not available for fallback method.');
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const packingListData = collectPackingListData();
    const tripDetails = getTripDetailsFromPage();

    if (!packingListData || packingListData.length === 0) {
      throw new Error('No items available for PDF generation.');
    }

    try {
      // Simple header
      doc.setFontSize(16);
      doc.text('WanderLust - Packing List', 20, 20);
      
      // Trip destination
      doc.setFontSize(12);
      doc.text(`Destination: ${tripDetails.destination || 'Travel'}`, 20, 35);
      
      let yPos = 50;
      
      // Simple item list
      doc.setFontSize(10);
      doc.text('Packing Items:', 20, yPos);
      yPos += 10;
      
      packingListData.forEach((item, index) => {
        if (yPos > 280) { // Simple page break
          doc.addPage();
          yPos = 20;
        }
        
        const status = item.checked ? '[✓]' : '[ ]';
        const text = `${status} ${item.name} (${item.category})`;
        doc.text(text, 25, yPos);
        yPos += 8;
      });
      
      // Simple footer
      doc.setFontSize(8);
      doc.text('Generated by WanderLust', 20, 285);
      
      // Save with safe filename
      const safeDestination = (tripDetails.destination || 'Travel')
        .replace(/[^a-z0-9]/gi, '_')
        .substring(0, 20);
      
      doc.save(`${safeDestination}_PackingList_Simple.pdf`);
      console.log('✅ Fallback PDF generated successfully');
      
    } catch (error) {
      console.error('Fallback PDF generation failed:', error);
      throw new Error('Simple PDF generation also failed. Please try refreshing the page.');
    }
  }
});
