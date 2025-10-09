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

  // Download packing list as PDF (simple approach)
  downloadBtn.addEventListener('click', () => {
    alert('PDF download feature coming soon!');
  });
});
