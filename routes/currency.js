const express = require("express");
const router = express.Router();

// Currency converter main page
router.get("/", (req, res) => {
    const currencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
        { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
        { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
        { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
        { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
        { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
        { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
        { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
        { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
        { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
        { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
        { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
        { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱' },
        { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' }
    ];

    res.render("currency/index", {
        title: "Currency Converter",
        currencies: currencies
    });
});

// API endpoint for currency conversion
router.get("/api/convert", async (req, res) => {
    try {
        const { from, to, amount } = req.query;

        if (!from || !to || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: from, to, amount'
            });
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount < 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount. Must be a positive number.'
            });
        }

        // Use the existing trip planner service for exchange rates
        const tripPlannerService = require("../services/tripPlannerService");
        const rates = await tripPlannerService.getExchangeRates(from);

        if (!rates || !rates[to]) {
            return res.status(400).json({
                success: false,
                error: `Exchange rate not available for ${from} to ${to}`
            });
        }

        const rate = rates[to];
        const convertedAmount = numAmount * rate;

        res.json({
            success: true,
            conversion: {
                from: from,
                to: to,
                amount: numAmount,
                rate: rate,
                result: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Currency conversion error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to convert currency'
        });
    }
});

// API endpoint for exchange rates
router.get("/api/rates/:base", async (req, res) => {
    try {
        const { base } = req.params;

        const tripPlannerService = require("../services/tripPlannerService");
        const rates = await tripPlannerService.getExchangeRates(base);

        if (!rates) {
            return res.status(400).json({
                success: false,
                error: `Exchange rates not available for ${base}`
            });
        }

        res.json({
            success: true,
            base: base,
            rates: rates,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Exchange rates error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch exchange rates'
        });
    }
});

module.exports = router;
