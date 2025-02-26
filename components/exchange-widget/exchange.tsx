'use client';

import { useState, useEffect } from 'react';
import classes from './exchange.module.css';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [date, setDate] = useState('');

  useEffect(() => {
    fetchExchangeRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCurrency, toCurrency]);

  const fetchExchangeRate = async () => {
    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_API_KEY}/latest/${fromCurrency}`,
      );
      const data = await res.json();
      if (data.conversion_rates) {
        setExchangeRate(data.conversion_rates[toCurrency]);
        setDate(
          new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
        );
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Currency Converter</h2>
      <div className={classes.inputContainer}>
        <label className={classes.label}>Amount:</label>
        <input
          type='number'
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className={classes.input}
        />
      </div>
      <div className={classes.inputContainer}>
        <label className={classes.label}>From</label>
        <select
          value={fromCurrency}
          onChange={e => setFromCurrency(e.target.value)}
          className={classes.input}
        >
          <option value='USD'>US Dollar</option>
          <option value='EUR'>Euro</option>
          <option value='GBP'>British Pound</option>
          <option value='JPY'>Japanese Yen</option>
        </select>
      </div>
      <div className={classes.inputContainer}>
        <label className={classes.label}>To</label>
        <select
          value={toCurrency}
          onChange={e => setToCurrency(e.target.value)}
          className={classes.input}
        >
          <option value='USD'>US Dollar</option>
          <option value='EUR'>Euro</option>
          <option value='GBP'>British Pound</option>
          <option value='JPY'>Japanese Yen</option>
        </select>
      </div>
      <div className={classes.result}>
        {exchangeRate ? (amount * exchangeRate).toFixed(2) : '...'}
      </div>
      <p className={classes.date}>Rates {date}</p>
    </div>
  );
}
