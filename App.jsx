import { useMemo, useState } from "react";

const categories = ["Food", "Rent", "Transport", "Shopping", "Bills", "Other"];

export default function App() {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [transactions, setTransactions] = useState([]);

  const totals = useMemo(() => {
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  function addTransaction(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;

    setTransactions(prev => [
      ...prev,
      {
        id: Date.now(),
        type,
        amount: value,
        category,
        note: note.trim() || "No note"
      }
    ]);

    setAmount("");
    setNote("");
  }

  const money = value => `US$${value.toFixed(2)}`;

  return (
    <main className="page">
      <section className="container">
        <header>
          <h1>Expense tracker</h1>
          <p>Log transactions and see where your money goes.</p>
        </header>

        <section className="summary">
          <div className="card">
            <span>Income</span>
            <strong className="income">{money(totals.income)}</strong>
          </div>
          <div className="card">
            <span>Expenses</span>
            <strong className="expense">{money(totals.expenses)}</strong>
          </div>
          <div className="card">
            <span>Balance</span>
            <strong className="balance">{money(totals.balance)}</strong>
          </div>
        </section>

        <form className="form-card" onSubmit={addTransaction}>
          <div className="tabs">
            <button
              type="button"
              className={type === "expense" ? "active expense-tab" : ""}
              onClick={() => setType("expense")}
            >
              Expense
            </button>
            <button
              type="button"
              className={type === "income" ? "active income-tab" : ""}
              onClick={() => setType("income")}
            >
              Income
            </button>
          </div>

          <div className="grid">
            <label>
              Amount
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </label>

            <label>
              Category
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(item => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>

          <label>
            Note (optional)
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Groceries, rent, etc."
            />
          </label>

          <button className="submit" type="submit">Add transaction</button>
        </form>

        <section className="empty-card">
          {transactions.length === 0 ? (
            <p>No expenses to chart yet.</p>
          ) : (
            <div className="chart">
              <div className="bar income-bar" style={{height: `${Math.max(10, Math.min(100, totals.income / Math.max(totals.income, totals.expenses, 1) * 100))}%`}} />
              <div className="bar expense-bar" style={{height: `${Math.max(10, Math.min(100, totals.expenses / Math.max(totals.income, totals.expenses, 1) * 100))}%`}} />
            </div>
          )}
        </section>

        <section className="transactions">
          {transactions.length === 0 ? (
            <p>No transactions yet. Add your first one above.</p>
          ) : (
            transactions.slice().reverse().map(t => (
              <div className="transaction" key={t.id}>
                <div>
                  <b>{t.category}</b>
                  <small>{t.note}</small>
                </div>
                <strong className={t.type}>{t.type === "income" ? "+" : "-"}{money(t.amount)}</strong>
              </div>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
