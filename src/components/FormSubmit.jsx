import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Loader from './Loader';
import './style/style.css';
import { toast } from 'react-toastify';
import Button from './Button';

const FormSubmit = ({ inputQuery }) => {
  const [expenses, setExpenses] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const [editExpense, setEditExpense] = useState({ amount: '', paymentStatus: 'payable' });
  const [wannaEdit, setWannaEdit] = useState(false);
  const [totalPayable, setTotalPayable] = useState(0);
  const [totalReceivable, setTotalReceivable] = useState(0);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', paymentStatus: 'payable' });
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const fetchExpenses = async () => {
    setFetchLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        'https://expense-manager-5.onrender.com/api/v1/manager/get-expenses',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTotalPayable(data.totalPayable);
      setTotalReceivable(data.totalReceivable);
      setExpenses(data.data);
    } catch {
      setError('Failed to load expenses');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (!inputQuery) {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(
        expenses.filter(exp =>
          exp.name.toLowerCase().includes(inputQuery.toLowerCase())
        )
      );
    }
  }, [inputQuery, expenses]);

  const groupedByDate = useMemo(() => {
    return filteredExpenses.reduce((acc, exp) => {
      const date = new Date(exp.createdAt).toISOString().slice(0, 10);
      if (!acc[date]) acc[date] = [];
      acc[date].push(exp);
      return acc;
    }, {});
  }, [filteredExpenses]);

  const handleEditClick = expense => {
    setEditExpense({ ...expense });
    setWannaEdit(true);
  };

  const updateExpenseHandler = async () => {
    if (!editExpense.amount.trim()) {
      toast.error('All fields are required!', {
        style: { backgroundColor: 'black', width: '320px', color: 'white' }
      });
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `https://expense-manager-5.onrender.com/api/v1/manager/update-expense/${editExpense._id}`,
        { amount: editExpense.amount, paymentStatus: editExpense.paymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses(prev =>
        prev.map(exp => (exp._id === data.data._id ? data.data : exp))
      );
      await fetchExpenses();
      setEditExpense({ amount: '', paymentStatus: 'payable' });
      setWannaEdit(false);
    } catch {
      setError('Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async () => {
    if (!newExpense.name.trim() || !newExpense.amount.trim()) {
      toast.error('All fields are required!', {
        style: { backgroundColor: 'black', width: '320px', color: 'white' }
      });
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://expense-manager-5.onrender.com/api/v1/manager/add-expense',
        newExpense,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchExpenses();
      setShowPopup(false);
      setNewExpense({ name: '', amount: '', paymentStatus: 'payable' });
    } catch {
      setError('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async id => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://expense-manager-5.onrender.com/api/v1/manager/delete-expense/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchExpenses();
    } catch {
      setError('Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {fetchLoading ? (
        <Loader />
      ) : (
        <>
          <div className="total">
            <div className="total-item">
              <span className="total-label">Total Payable:</span>
              <span className="total-amount payable">₹{totalPayable}</span>
            </div>
            <div className="total-item">
              <span className="total-label">Total Receivable:</span>
              <span className="total-amount receivable">₹{totalReceivable}</span>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          {Object.keys(groupedByDate)
            .sort((a, b) => b.localeCompare(a))
            .map(date => (
              <div key={date} className="date-group">
                <h3 className="date-header">
                  {new Date(date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h3>
                <ul className="expenses-list">
                  {groupedByDate[date].map(expense => (
                    <li key={expense._id} className="expense-item">
                      <div className="expense-details">
                        <span className="expense-name">{expense.name}</span>
                        <span className="expense-amount">₹{expense.amount}</span>
                      </div>
                      <span className={`expense-status ${expense.paymentStatus}`}>
                        {expense.paymentStatus === 'payable' ? 'Payable' : 'Receivable'}
                      </span>
                      <div className="expense-actions">
                        <button
                          onClick={() => handleEditClick(expense)}
                          disabled={loading}
                          className="edit-btn"
                          style={{ backgroundColor: '#121212', border: 'none' }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteExpense(expense._id)}
                          disabled={loading}
                          className="delete-btn"
                        >
                          {loading ? 'Deleting...' : '✖'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          <button className="floating-add-btn" onClick={() => setShowPopup(true)}>
            +
          </button>

          {wannaEdit && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Update Expense</h2>
                <input
                  type="number"
                  placeholder="Enter Amount (₹)"
                  value={editExpense.amount}
                  onChange={e => setEditExpense({ ...editExpense, amount: e.target.value })}
                  className="input-field"
                />
                <select
                  value={editExpense.paymentStatus}
                  onChange={e =>
                    setEditExpense({ ...editExpense, paymentStatus: e.target.value })
                  }
                  className="input-field another"
                >
                  <option value="payable">Payable</option>
                  <option value="receivable">Receivable</option>
                </select>
                <div className="modal-buttons">
                  <button onClick={updateExpenseHandler} className="add-btn">
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                  <button onClick={() => setWannaEdit(false)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showPopup && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Add Expense</h2>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={newExpense.name}
                  onChange={e => setNewExpense({ ...newExpense, name: e.target.value })}
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder="Enter Amount (₹)"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="input-field"
                />
                <select
                  value={newExpense.paymentStatus}
                  onChange={e =>
                    setNewExpense({ ...newExpense, paymentStatus: e.target.value })
                  }
                  className="input-field another"
                >
                  <option value="payable">Payable</option>
                  <option value="receivable">Receivable</option>
                </select>
                <div className="modal-buttons">
                  <button onClick={addExpense} className="add-btn">
                    {loading ? 'Adding...' : 'Add'}
                  </button>
                  <button onClick={() => setShowPopup(false)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FormSubmit;
