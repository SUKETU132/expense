import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Loader from './Loader';
import { toast } from 'react-toastify';
import './style/style.css';

const ExpenseItem = React.memo(({ expense, onEdit, onDelete, loading }) => (
  <li className="expense-item">
    <div className="expense-details">
      <span className="expense-name">{expense.name}</span>
      <span className="expense-amount">₹{expense.amount}</span>
    </div>
    <span className={`expense-status ${expense.paymentStatus}`}>
      {expense.paymentStatus === 'payable' ? 'Payable' : 'Receivable'}
    </span>
    <div className="expense-actions">
      <button onClick={onEdit} disabled={loading} className="edit-btn">✏️</button>
      <button onClick={onDelete} disabled={loading} className="delete-btn">✖</button>
    </div>
  </li>
));

ExpenseItem.propTypes = {
  expense: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const ExpenseDateGroup = React.memo(({ date, expenses, onEdit, onDelete, loading }) => (
  <div className="date-group">
    <h3 className="date-header">
      {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
    </h3>
    <ul className="expenses-list">
      {expenses.map(e => (
        <ExpenseItem
          key={e._id}
          expense={e}
          onEdit={() => onEdit(e)}
          onDelete={() => onDelete(e._id)}
          loading={loading}
        />
      ))}
    </ul>
  </div>
));

ExpenseDateGroup.propTypes = {
  date: PropTypes.string.isRequired,
  expenses: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const ExpenseModal = ({ isOpen, mode, expense, onClose, onSave, loading }) => {
  const [form, setForm] = useState({ name: '', amount: '', paymentStatus: 'payable' });

  useEffect(() => {
    if (mode === 'edit' && expense) {
      setForm({ name: expense.name, amount: expense.amount, paymentStatus: expense.paymentStatus });
    } else {
      setForm({ name: '', amount: '', paymentStatus: 'payable' });
    }
  }, [mode, expense]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.name || !form.amount) {
      toast.error('All fields are required!', { style: { backgroundColor: 'black', width: '320px', color: 'white' } });
      return;
    }
    onSave(mode === 'edit' ? { _id: expense._id, ...form } : form);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{mode === 'add' ? 'Add Expense' : 'Update Expense'}</h2>
        {mode === 'add' && (
          <input
            type="text"
            placeholder="Enter Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="input-field"
          />
        )}
        <input
          type="number"
          placeholder="Enter Amount (₹)"
          value={form.amount}
          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
          className="input-field"
        />
        <select
          value={form.paymentStatus}
          onChange={e => setForm(f => ({ ...f, paymentStatus: e.target.value }))}
          className="input-field"
        >
          <option value="payable">Payable</option>
          <option value="receivable">Receivable</option>
        </select>
        <div className="modal-buttons">
          <button onClick={handleSubmit} disabled={loading} className="add-btn">
            {loading ? 'Saving...' : mode === 'add' ? 'Add' : 'Update'}
          </button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

ExpenseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['add', 'edit']).isRequired,
  expense: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const FormSubmit = ({ inputQuery }) => {
  const [expenses, setExpenses] = useState([]);
  const [totalPayable, setTotalPayable] = useState(0);
  const [totalReceivable, setTotalReceivable] = useState(0);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(inputQuery);
  const [modalConfig, setModalConfig] = useState({ open: false, mode: 'add', expense: null });

  const fetchExpenses = useCallback(async () => {
    setLoadingFetch(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        'https://expense-manager-5.onrender.com/api/v1/manager/get-expenses',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses(data.data);
      setTotalPayable(data.totalPayable);
      setTotalReceivable(data.totalReceivable);
    } catch {
      setError('Failed to load expenses');
    } finally {
      setLoadingFetch(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const actionWrapper = async fn => {
    setLoadingAction(true);
    setError('');
    try {
      await fn();
      await fetchExpenses();
    } catch {
      setError('Action failed');
    } finally {
      setLoadingAction(false);
    }
  };

  const addExpense = expense =>
    actionWrapper(async () => {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://expense-manager-5.onrender.com/api/v1/manager/add-expense',
        expense,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Expense added');
    });

  const updateExpense = ({ _id, ...payload }) =>
    actionWrapper(async () => {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://expense-manager-5.onrender.com/api/v1/manager/update-expense/${_id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info('Expense updated');
    });

  const deleteExpense = id =>
    actionWrapper(async () => {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://expense-manager-5.onrender.com/api/v1/manager/delete-expense/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.warn('Expense deleted');
    });

  useEffect(() => {
    if (!inputQuery) {
      setSearch(inputQuery);
    }
  }, [inputQuery]);

  const filtered = useMemo(() => {
    return search
      ? expenses.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
      : expenses;
  }, [search, expenses]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, e) => {
      const d = new Date(e.createdAt).toISOString().slice(0, 10);
      (acc[d] ||= []).push(e);
      return acc;
    }, {});
  }, [filtered]);

  return (
    <div>
      {loadingFetch ? (
        <Loader />
      ) : (
        <>
          <div className="total">
            <div className="total-item">
              <span>Total Payable:</span>
              <span className="payable">₹{totalPayable}</span>
            </div>
            <div className="total-item">
              <span>Total Receivable:</span>
              <span className="receivable">₹{totalReceivable}</span>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search expenses…"
            className="search-input"
          />

          {Object.keys(grouped)
            .sort((a, b) => b.localeCompare(a))
            .map(date => (
              <ExpenseDateGroup
                key={date}
                date={date}
                expenses={grouped[date]}
                onEdit={e => setModalConfig({ open: true, mode: 'edit', expense: e })}
                onDelete={deleteExpense}
                loading={loadingAction}
              />
            ))}

          <button
            className="floating-add-btn"
            onClick={() => setModalConfig({ open: true, mode: 'add', expense: null })}
            disabled={loadingAction}
          >
            ＋
          </button>

          <ExpenseModal
            isOpen={modalConfig.open}
            mode={modalConfig.mode}
            expense={modalConfig.expense}
            onClose={() => setModalConfig(c => ({ ...c, open: false }))}
            onSave={modalConfig.mode === 'add' ? addExpense : updateExpense}
            loading={loadingAction}
          />
        </>
      )}
    </div>
  );
};

FormSubmit.propTypes = {
  inputQuery: PropTypes.string.isRequired,
};

export default FormSubmit;
