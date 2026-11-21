
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);

  // Save transactions in LocalStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Calculate totals
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = income - expenses;

  // Add or update transaction
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description.trim() || !amount || Number(amount) <= 0) {
      alert("Please enter valid transaction details.");
      return;
    }

    const transactionData = {
      id: editingId || Date.now(),
      description: description.trim(),
      amount: Number(amount),
      type,
      category,
      date: editingId
        ? transactions.find((item) => item.id === editingId).date
        : new Date().toISOString(),
    };

    if (editingId) {
      setTransactions((prev) =>
        prev.map((item) =>
          item.id === editingId ? transactionData : item
        )
      );
      setEditingId(null);
    } else {
      setTransactions((prev) => [transactionData, ...prev]);
    }

    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("Food");
  };

  // Edit transaction
  const handleEdit = (item) => {
    setDescription(item.description);
    setAmount(String(item.amount));
    setType(item.type);
    setCategory(item.category);
    setEditingId(item.id);
  };

  // Delete transaction
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions((prev) => prev.filter((item) => item.id !== id));

      if (editingId === id) {
        resetForm();
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setEditingId(null);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="app">
        <header className="header">
         <h1>Expense Tracker</h1>
</header>
      <main className="container">

        {/* Summary Cards */}
        <section className="summary-grid">

          <div className="summary-card balance-card">
            <div className="card-top">
              <span>Total Balance</span>
              <span className="card-icon">₹</span>
            </div>
            <h2>₹{balance.toLocaleString("en-IN")}</h2>
            <p>Your available balance</p>
          </div>

          <div className="summary-card income-card">
            <div className="card-top">
              <span>Total Income</span>
              <span className="card-icon">↗</span>
            </div>
            <h2>₹{income.toLocaleString("en-IN")}</h2>
            <p>Money received</p>
          </div>

          <div className="summary-card expense-card">
            <div className="card-top">
              <span>Total Expenses</span>
              <span className="card-icon">↘</span>
            </div>
            <h2>₹{expenses.toLocaleString("en-IN")}</h2>
            <p>Money spent</p>
          </div>

        </section>

        {/* Main Content */}
        <section className="content-grid">

          {/* Add Transaction Form */}
          <div className="panel form-panel">
            <h2>{editingId ? "Edit Transaction" : "Add Transaction"}</h2>
            <p className="panel-subtitle">
              {editingId
                ? "Update your transaction details"
                : "Enter your income or expense details"}
            </p>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Example: Grocery shopping"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Transaction Type</label>
                <div className="type-buttons">
                  <button
                    type="button"
                    className={type === "income" ? "type-btn active-income" : "type-btn"}
                    onClick={() => setType("income")}
                  >
                    + Income
                  </button>

                  <button
                    type="button"
                    className={type === "expense" ? "type-btn active-expense" : "type-btn"}
                    onClick={() => setType("expense")}
                  >
                    - Expense
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Food</option>
                  <option>Shopping</option>
                  <option>Travel</option>
                  <option>Education</option>
                  <option>Entertainment</option>
                  <option>Salary</option>
                  <option>Freelance</option>
                  <option>Bills</option>
                  <option>Health</option>
                  <option>Other</option>
                </select>
              </div>

              <button type="submit" className="submit-btn">
                {editingId ? "Update Transaction" : "Add Transaction"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel Editing
                </button>
              )}

            </form>
          </div>

          {/* Transaction History */}
          <div className="panel history-panel">
            <div className="history-header">
              <div>
                <h2>Recent Transactions</h2>
                <p className="panel-subtitle">
                  Your transaction history
                </p>
              </div>

              <select
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
            </div>

            <div className="transaction-list">

              {filteredTransactions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">₹</div>
                  <h3>No transactions found</h3>
                  <p>Add your first income or expense to get started.</p>
                </div>
              ) : (
                filteredTransactions.map((item) => (
                  <div className="transaction-item" key={item.id}>

                    <div className="transaction-info">
                      <div className={`transaction-icon ${item.type}`}>
                        {item.type === "income" ? "↗" : "↘"}
                      </div>

                      <div className="transaction-details">
                        <h3>{item.description}</h3>
                        <p>
                          {item.category} • {formatDate(item.date)}
                        </p>
                      </div>
                    </div>

                    <div className="transaction-actions">
                      <span className={`transaction-amount ${item.type}`}>
                        {item.type === "income" ? "+" : "-"}₹
                        {item.amount.toLocaleString("en-IN")}
                      </span>

                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(item)}
                        title="Edit"
                      >
                        ✎
                      </button>

                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>

                  </div>
                ))
              )}

            </div>
          </div>

        </section>

        <footer>
          <p>Personal Expense Tracker © 2026 | Manage Your Money Smartly</p>
        </footer>

      </main>
    </div>
  );
}

export default App;
