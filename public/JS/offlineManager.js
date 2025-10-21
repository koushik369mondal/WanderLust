
class OfflineManager {
    constructor() {
        this.dbName = 'WanderLustOffline';
        this.dbVersion = 1;
        this.storeName = 'offlineTrips';
        this.initDB();
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
                    store.createIndex('downloadedAt', 'downloadedAt', { unique: false });
                }
            };
        });
    }

    async generateTripPDF(tripData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Set up colors and fonts
        const primaryColor = [97, 188, 211]; // Blue
        const secondaryColor = [78, 219, 205]; // Teal
        const textColor = [51, 51, 51]; // Dark gray

        // Header
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('WanderLust', 20, 25);

        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text('Trip Plan', 20, 35);

        // Trip Title
        doc.setTextColor(...textColor);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(`${tripData.destination} Trip`, 20, 60);

        // Trip Details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        let yPos = 80;

        const details = [
            ['Departure City', tripData.departureCity || 'N/A'],
            ['Destination', tripData.destination],
            ['Travelers', tripData.travelers],
            ['Start Date', new Date(tripData.startDate).toLocaleDateString()],
            ['End Date', new Date(tripData.endDate).toLocaleDateString()],
            ['Duration', `${tripData.duration} days`],
            ['Budget Type', tripData.budgetType.charAt(0).toUpperCase() + tripData.budgetType.slice(1)],
            ['Currency', tripData.currency || 'INR']
        ];

        details.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${label}:`, 20, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(value.toString(), 80, yPos);
            yPos += 8;
        });

        yPos += 10;

        // Cost Breakdown
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(...secondaryColor);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Cost Breakdown', 25, yPos);
        yPos += 15;

        doc.setTextColor(...textColor);
        doc.setFontSize(11);

        const costs = tripData.costs;
        const costItems = [
            ['Flights', costs.flights],
            ['Hotels', costs.hotels],
            ['Food', costs.food],
            ['Activities', costs.activities],
            ['Transport', costs.transport]
        ];

        costItems.forEach(([item, amount]) => {
            doc.setFont('helvetica', 'normal');
            doc.text(item, 30, yPos);
            doc.text(`$${amount.toLocaleString()}`, 150, yPos);
            yPos += 8;
        });

        // Total Cost
        yPos += 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Total Cost:', 30, yPos);
        doc.text(`$${tripData.total.toLocaleString()}`, 150, yPos);
        yPos += 8;
        doc.text(`Per Person: $${Math.round(tripData.total / tripData.travelers).toLocaleString()}`, 30, yPos);

        yPos += 20;

        // Recommendations
        if (tripData.recommendations && tripData.recommendations.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setFillColor(...primaryColor);
            doc.rect(20, yPos - 5, 170, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.text('Recommendations', 25, yPos);
            yPos += 15;

            doc.setTextColor(...textColor);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');

            tripData.recommendations.forEach(rec => {
                doc.text(`• ${rec}`, 25, yPos);
                yPos += 8;
            });
        }

        yPos += 10;

        // Saving Tips
        if (tripData.savingTips && tripData.savingTips.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setFillColor(...secondaryColor);
            doc.rect(20, yPos - 5, 170, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.text('Saving Tips', 25, yPos);
            yPos += 15;

            doc.setTextColor(...textColor);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');

            tripData.savingTips.forEach(tip => {
                doc.text(`• ${tip}`, 25, yPos);
                yPos += 8;
            });
        }

        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Generated by WanderLust Trip Planner', 20, pageHeight - 10);
        doc.text(`Created: ${new Date().toLocaleDateString()}`, 150, pageHeight - 10);

        return doc.output('datauristring').split(',')[1]; // Return base64 string
    }

    async saveTripForOffline(tripData) {
        try {
            // Generate PDF
            const pdfData = await this.generateTripPDF(tripData);

            // Store in localStorage with metadata
            const tripInfo = {
                id: tripData._id,
                destination: tripData.destination,
                duration: tripData.duration,
                total: tripData.total,
                downloadedAt: new Date().toISOString(),
                pdfData: pdfData
            };

            // Get existing trips
            const existingTrips = JSON.parse(localStorage.getItem('offlineTrips') || '[]');

            // Remove if already exists
            const filteredTrips = existingTrips.filter(trip => trip.id !== tripData._id);

            // Add new trip
            filteredTrips.push(tripInfo);

            // Save back to localStorage
            localStorage.setItem('offlineTrips', JSON.stringify(filteredTrips));

            console.log('Trip PDF saved for offline:', tripInfo);
            return tripInfo;
        } catch (error) {
            console.error('Error saving trip for offline:', error);
            throw error;
        }
    }

    async getStoredPdfs() {
        try {
            const trips = JSON.parse(localStorage.getItem('offlineTrips') || '[]');
            return trips.map(trip => ({
                id: trip.id,
                destination: trip.destination,
                duration: trip.duration,
                total: trip.total,
                downloadedAt: trip.downloadedAt
            }));
        } catch (error) {
            console.error('Error getting stored PDFs:', error);
            return [];
        }
    }

    async getTripPdf(tripId) {
        try {
            const trips = JSON.parse(localStorage.getItem('offlineTrips') || '[]');
            const trip = trips.find(t => t.id === tripId);
            return trip ? trip.pdfData : null;
        } catch (error) {
            console.error('Error getting trip PDF:', error);
            return null;
        }
    }

    async removeOfflineTrip(tripId) {
        try {
            const trips = JSON.parse(localStorage.getItem('offlineTrips') || '[]');
            const filteredTrips = trips.filter(trip => trip.id !== tripId);
            localStorage.setItem('offlineTrips', JSON.stringify(filteredTrips));
            console.log('Trip removed from offline storage:', tripId);
        } catch (error) {
            console.error('Error removing offline trip:', error);
            throw error;
        }
    }

    async isTripDownloaded(tripId) {
        try {
            const trips = JSON.parse(localStorage.getItem('offlineTrips') || '[]');
            return trips.some(trip => trip.id === tripId);
        } catch (error) {
            return false;
        }
    }

    async clearAllOfflineTrips() {
        try {
            localStorage.removeItem('offlineTrips');
            console.log('All offline trips cleared');
        } catch (error) {
            console.error('Error clearing offline trips:', error);
            throw error;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.OfflineManager = new OfflineManager();
});
