import React, { useEffect, useState } from 'react';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch wallet balance and transactions from backend
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5003/api/wallet', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch wallet data');
        }
        const data = await response.json();
        setBalance(data.balance);
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWallet();
  }, []);

  const handleAddMoney = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/wallet/transaction', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ type: 'credit', amount: Number(amount), description: 'Added money' }),
      });
      if (!response.ok) {
        throw new Error('Failed to add money');
      }
      const data = await response.json();
      setBalance(data.balance);
      setTransactions(data.transactions || []);
      setAmount('');
    } catch (error) {
      console.error(error);
      alert('Error adding money');
    }
  };

  const handleSubtractMoney = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/wallet/transaction', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ type: 'debit', amount: Number(amount), description: 'Subtracted money' }),
      });
      if (!response.ok) {
        throw new Error('Failed to subtract money');
      }
      const data = await response.json();
      setBalance(data.balance);
      setTransactions(data.transactions || []);
      setAmount('');
    } catch (error) {
      console.error(error);
      alert('Error subtracting money');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>
      <div className="mb-4">
        <p className="text-xl">Current Balance: <strong>${balance.toFixed(2)}</strong></p>
      </div>
      <div className="mb-6 flex space-x-4">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-48"
        />
        <button
          onClick={handleAddMoney}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Money
        </button>
        <button
          onClick={handleSubtractMoney}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Subtract Money
        </button>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Date</th>
              <th className="border border-gray-300 p-2 text-left">Type</th>
              <th className="border border-gray-300 p-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td className="border border-gray-300 p-2">{new Date(tx.date).toLocaleString()}</td>
                <td className="border border-gray-300 p-2">{tx.type}</td>
          <td className={`border border-gray-300 p-2 ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
            ${tx.amount.toFixed(2)}
          </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Wallet;
