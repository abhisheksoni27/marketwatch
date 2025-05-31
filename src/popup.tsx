import React, { useState, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const chrome: any;

const style = `
:root {
    --primary: #6366f1;
    --primary-light: #a5b4fc;
    --success: #10b981;
    --success-light: #d1fae5;
    --danger: #ef4444;
    --danger-light: #fee2e2;
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-card: #334155;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --border: #475569;
    --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    --shadow-card: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
body, #root {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: unset;
    min-width: 700px;
    max-width: 900px;
    width: 900px;
    height: auto;
    padding: 1rem 2.5rem;
    background-image: 
        radial-gradient(at 40% 20%, hsla(228,100%,74%,0.1) 0px, transparent 50%),
        radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%),
        radial-gradient(at 0% 50%, hsla(355,100%,93%,0.1) 0px, transparent 50%);
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: hidden;
}
.container {
    max-width: 860px;
    margin: 0 auto;
}
.portfolio-card {
    background: var(--bg-secondary);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 1.2rem 2rem;
    box-shadow: var(--shadow);
    position: relative;
    overflow: hidden;
}
.portfolio-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient);
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.2rem;
}
.header h1 {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.025em;
}
.status-indicator {
    width: 7px;
    height: 7px;
    background: var(--success);
    border-radius: 50%;
    box-shadow: 0 0 0 2px var(--success-light);
    animation: pulse 2s infinite;
}
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
.pnl-section {
    background: linear-gradient(135deg, var(--bg-card) 0%, rgba(99, 102, 241, 0.1) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.1rem;
    margin-bottom: 1.2rem;
    position: relative;
    overflow: hidden;
}
.pnl-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(99, 102, 241, 0.05) 100%);
    pointer-events: none;
}
.pnl-label {
    font-size: 0.7rem;
    color: var(--text-secondary);
    font-weight: 500;
    margin-bottom: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.pnl-value {
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    display: flex;
    align-items: center;
    gap: 0.4rem;
}
.pnl-value.positive {
    color: var(--success);
}
.pnl-value.negative {
    color: var(--danger);
}
.pnl-arrow {
    font-size: 1rem;
    transform: translateY(-2px);
}
.section {
    margin-bottom: 1.2rem;
}
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.7rem;
}
.section-title {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.025em;
}
.section-count {
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: 0.6rem;
    font-weight: 500;
    padding: 0.18rem 0.4rem;
    border-radius: 8px;
    border: 1px solid var(--border);
}
.positions-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.position-item {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.7rem;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}
.position-item:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-card);
    border-color: var(--primary);
}
.position-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.3rem;
}
.position-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.7rem;
    letter-spacing: -0.025em;
    padding-right: 0.3rem;
}
.position-pnl {
    font-weight: 600;
    font-size: 0.7rem;
    padding: 0.18rem 0.4rem;
    border-radius: 6px;
    font-variant-numeric: tabular-nums;
}
.position-pnl.positive {
    color: var(--success);
    background: var(--success-light);
}
.position-pnl.negative {
    color: var(--danger);
    background: var(--danger-light);
}

.empty-state {
    text-align: center;
    padding: 1.2rem 0.7rem;
    color: var(--text-muted);
    font-size: 0.7rem;
}
.empty-icon {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
    opacity: 0.5;
}
.actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}
.btn {
    flex: 1;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 0.6rem 0.9rem;
    font-size: 0.7rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    font-family: inherit;
}
.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}
.btn:hover::before {
    left: 100%;
}
.btn:hover {
    background: #5855eb;
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
}
.btn:active {
    transform: translateY(0);
}
.btn.secondary {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);
}
.btn.secondary:hover {
    background: var(--bg-card);
    color: var(--text-primary);
    border-color: var(--primary);
    box-shadow: none;
}
.divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 1rem 0;
}
@media (max-width: 1200px) {
    body, #root {
        min-width: 600px;
        max-width: 700px;
        width: 700px;
    }
    .container {
        max-width: 680px;
    }
}
@media (max-width: 800px) {
    body, #root {
        min-width: 400px;
        max-width: 500px;
        width: 500px;
    }
    .container {
        max-width: 480px;
    }
}
@media (max-width: 480px) {
    body, #root {
        min-width: 320px;
        max-width: 340px;
        width: 340px;
        padding: 0.5rem;
    }
    .portfolio-card {
        padding: 0.7rem;
    }
    .pnl-value {
        font-size: 1.1rem;
    }
}
`;

// Placeholder data structure
const sampleData = {
  netPnL: 1600.5,
  openPositions: [
    {
      name: 'NIFTY 29 MAY 25000 CE',
      pnl: 1550.5,
      details: 'Call Option • Expires 29 May',
    },
    {
      name: 'RELIANCE',
      pnl: 350.0,
      details: 'Equity • Long Position',
    },
  ],
  closedPositions: [
    {
      name: 'INDIGO JUN FUT',
      pnl: -800.0,
      details: 'Future • Closed Today',
    },
    {
      name: 'TCS',
      pnl: 500.0,
      details: 'Equity • Sold Yesterday',
    },
  ],
};

function formatPnL(pnl: number) {
  const sign = pnl > 0 ? '+' : '';
  return `${sign}₹${pnl.toFixed(2)}`;
}

const Popup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(sampleData);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = () => {
    setLoading(true);
    setError(null);
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: 'GET_POSITIONS' }, (resp: any) => {
        if (resp && resp.success) {
          setData({
            netPnL: parseFloat((resp.netPnl || '0').replace(/[^\d.-]/g, '')),
            openPositions: (resp.openPositions || []).map((pos: any) => ({
              name: pos.tradingSymbol,
              pnl: (Number(pos.realizedProfit) || 0) + (Number(pos.unrealizedProfit) || 0),
              details: pos.netQty !== 0
                ? (pos.tradingSymbol.includes('CE') || pos.tradingSymbol.includes('PE')
                    ? `Option • Expires ${pos.tradingSymbol.split(' ')[1]}`
                    : 'Equity • Long Position')
                : (pos.tradingSymbol.includes('FUT')
                    ? 'Future • Closed'
                    : 'Equity • Sold'),
            })),
            closedPositions: (resp.closedPositions || []).map((pos: any) => ({
              name: pos.tradingSymbol,
              pnl: Number(pos.realizedProfit) || 0,
              details: pos.tradingSymbol.includes('FUT')
                ? 'Future • Closed'
                : 'Equity • Sold',
            })),
          });
        } else if (resp && resp.error) {
          setError(resp.error);
        } else {
          setError('Unknown error');
        }
        setLoading(false);
      });
    } else {
      // Fallback: use sampleData
      setData(sampleData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
    // eslint-disable-next-line
  }, []);

  const handleReload = () => {
    fetchPositions();
  };

  const handleSettings = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('options.html');
    }
  };

  const netPositive = data.netPnL >= 0;

  return (
    <div className="container">
      <style>{style}</style>
      <div className="portfolio-card">
        <div className="header">
          <h1>Portfolio</h1>
          <div className="status-indicator"></div>
        </div>
        <div className="pnl-section">
          <div className="pnl-label">Net P&amp;L</div>
          <div className={`pnl-value ${netPositive ? 'positive' : 'negative'}`} id="net-pnl">
            <span className="pnl-arrow">{netPositive ? '↗' : '↘'}</span>
            {formatPnL(data.netPnL)}
          </div>
        </div>
        {error && <div className="empty-state" style={{color: 'var(--danger)'}}>{error}</div>}
        <div className="section">
          <div className="section-header">
            <div className="section-title">Open Positions</div>
            <div className="section-count" id="open-count">{data.openPositions.length}</div>
          </div>
          <ul className="positions-list" id="open-positions">
            {data.openPositions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                No open positions
              </div>
            ) : (
              data.openPositions.map((pos, i) => (
                <li className="position-item" key={i}>
                  <div className="position-header">
                    <div className="position-name">{pos.name}</div>
                    <div className={`position-pnl ${pos.pnl >= 0 ? 'positive' : 'negative'}`}>{formatPnL(pos.pnl)}</div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="divider"></div>
        <div className="section">
          <div className="section-header">
            <div className="section-title">Closed Positions</div>
            <div className="section-count" id="closed-count">{data.closedPositions.length}</div>
          </div>
          <ul className="positions-list" id="closed-positions">
            {data.closedPositions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                No closed positions
              </div>
            ) : (
              data.closedPositions.map((pos, i) => (
                <li className="position-item" key={i}>
                  <div className="position-header">
                    <div className="position-name">{pos.name}</div>
                    <div className={`position-pnl ${pos.pnl >= 0 ? 'positive' : 'negative'}`}>{formatPnL(pos.pnl)}</div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="actions">
          <button className="btn" id="reload-btn" onClick={handleReload} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn secondary" id="settings-btn" onClick={handleSettings}>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
