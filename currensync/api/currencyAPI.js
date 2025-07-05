import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  const { fromCurrency, toCurrency, amount } = req.query;

  if (!fromCurrency || !toCurrency || !amount) {
    return res
      .status(400)
      .json({ error: "Missing parameters: fromCurrency, toCurrency, amount" });
  }

  if (isNaN(amount) || amount <= 0) {
    return res
      .status(400)
      .json({ error: "Amount must be a valid positive number" });
  }

  const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
  const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

  try {
   
    const response = await fetch(`${BASE_URL}/${fromCurrency}`);

    
    if (!response.ok) {
      const errorData = await response.json();
      return res
        .status(500)
        .json({ error: errorData.error || "Error fetching exchange rates" });
    }

    const data = await response.json();

    const conversionRate = data.conversion_rates[toCurrency];
    if (!conversionRate) {
      return res
        .status(400)
        .json({ error: `Conversion rate for ${toCurrency} not available` });
    }

    const convertedAmount = (conversionRate * amount).toFixed(2);
    res.status(200).json({ convertedAmount });
  } catch (error) {
    console.error("Error during conversion:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
