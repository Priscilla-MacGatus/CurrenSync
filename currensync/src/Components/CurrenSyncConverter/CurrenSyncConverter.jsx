import { useState, useEffect } from "react";
import axios from "axios";
import "./CurrenSyncConverter.css";

const CurrenSyncConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [convertedResult, setConvertedResult] = useState(null);
  const [error, setError] = useState("");

  const YOUR_API_KEY = "4b472342dd6d876eadec8adc";

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/${YOUR_API_KEY}/latest/USD`
        );
        const currencyCodes = Object.keys(response.data.conversion_rates);
        setCurrencies(currencyCodes);
      } catch (err) {
        setError("Failed to load currencies");
      }
    };

    fetchCurrencies();
  }, []);

  //
  const handleSubmit = async (e) => {
    e.preventDefault();

    setConvertedResult(null);
    setError("");

    if (!fromCurrency || !toCurrency || !amount) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${YOUR_API_KEY}/latest/${fromCurrency}`
      );
      const conversionRate = response.data.conversion_rates[toCurrency];
      const result = amount * conversionRate;
      setConvertedResult({ amount: result, currency: toCurrency });
    } catch (err) {
      setError("Failed to fetch conversion data");
    }
  };

  return (
    <div className="converter-container">
      <h1>CurrenSync Converter</h1>
      <form onSubmit={handleSubmit}>
        <label>
          From Currency:
          <select
            value={fromCurrency}
            onChange={(e) => {
              setFromCurrency(e.target.value);
              setConvertedResult(null);
            }}
          >
            <option value="">Select Currency</option>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label>
          To Currency:
          <select
            value={toCurrency}
            onChange={(e) => {
              setToCurrency(e.target.value);
              setConvertedResult(null);
            }}
          >
            <option value="">Select Currency</option>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setConvertedResult(null); //
            }}
          />
        </label>
        <button type="submit">Convert</button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {convertedResult && (
        <div className="convertedAmount">
          Converted Amount: <span>{convertedResult.amount}</span>
          <span>{convertedResult.currency}</span>
        </div>
      )}
    </div>
  );
};

export default CurrenSyncConverter;
