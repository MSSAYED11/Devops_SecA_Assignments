import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = '/api';

const getFoodEmoji = (category, name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('coffee') || n.includes('latte') || n.includes('tea')) return '☕';
  if (n.includes('wine') || n.includes('cocktail')) return '🍷';
  if (n.includes('burger')) return '🍔';
  if (n.includes('pizza')) return '🍕';
  if (n.includes('cake') || n.includes('dessert') || n.includes('tiramisu')) return '🍰';
  if (n.includes('salad')) return '🥗';
  if (n.includes('pasta')) return '🍝';
  if (n.includes('steak') || n.includes('meat') || n.includes('bass') || n.includes('salmon') || n.includes('curry')) return '🥩';
  if (category === 'Appetizer') return '🥟';
  if (category === 'Main Course') return '🍛';
  if (category === 'Dessert') return '🍮';
  if (category === 'Beverage') return '🍹';
  if (category === 'Side') return '🍟';
  return '🍽️';
};

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    total_menu_items: 0,
    total_tables: 0,
    active_reservations: 0,
    active_orders: 0,
    total_revenue: 0.0,
  });

  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorBanner, setErrorBanner] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Modals
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showResModal, setShowResModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Filters
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Load all data
  const fetchData = async () => {
    try {
      setErrorBanner('');
      const [sRes, mRes, tRes, rRes, oRes] = await Promise.all([
        fetch(`${API}/stats`),
        fetch(`${API}/menu-items`),
        fetch(`${API}/tables`),
        fetch(`${API}/reservations`),
        fetch(`${API}/orders`),
      ]);

      if (!sRes.ok || !mRes.ok || !tRes.ok || !rRes.ok || !oRes.ok) {
        throw new Error('Could not connect to restaurant backend service');
      }

      setStats(await sRes.json());
      setMenuItems(await mRes.json());
      setTables(await tRes.json());
      setReservations(await rRes.json());
      setOrders(await oRes.json());
    } catch (err) {
      setErrorBanner(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setErrorBanner(msg);
      setTimeout(() => setErrorBanner(''), 7000);
    } else {
      setSuccessBanner(msg);
      setTimeout(() => setSuccessBanner(''), 4000);
    }
  };

  // --- Handlers: Menu Items ---
  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name'),
      category: fd.get('category'),
      price: parseFloat(fd.get('price')),
      description: fd.get('description'),
      is_available: fd.get('is_available') === 'on',
    };

    try {
      const res = await fetch(`${API}/menu-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to create menu item');
      }
      setShowMenuModal(false);
      showNotification('Menu item created successfully!');
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleToggleMenuAvailability = async (item) => {
    try {
      await fetch(`${API}/menu-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !item.is_available }),
      });
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await fetch(`${API}/menu-items/${id}`, { method: 'DELETE' });
      showNotification('Menu item removed');
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // --- Handlers: Dining Tables ---
  const handleCreateTable = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      table_number: parseInt(fd.get('table_number'), 10),
      capacity: parseInt(fd.get('capacity'), 10),
      location: fd.get('location'),
      is_active: true,
    };

    try {
      const res = await fetch(`${API}/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to create table');
      }
      setShowTableModal(false);
      showNotification('Dining table added!');
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleDeleteTable = async (id) => {
    if (!confirm('Remove this dining table?')) return;
    try {
      const res = await fetch(`${API}/tables/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Could not delete table');
      }
      showNotification('Table removed');
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // --- Handlers: Reservations ---
  const handleCreateReservation = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      customer_name: fd.get('customer_name'),
      customer_phone: fd.get('customer_phone'),
      table_id: parseInt(fd.get('table_id'), 10),
      party_size: parseInt(fd.get('party_size'), 10),
      reservation_time: new Date(fd.get('reservation_time')).toISOString(),
    };

    try {
      const res = await fetch(`${API}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Reservation rejected by host rules');
      }
      setShowResModal(false);
      showNotification('Reservation confirmed!');
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleUpdateReservationStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/reservations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to update reservation');
      }
      showNotification(`Reservation marked as ${status}`);
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleDeleteReservation = async (id) => {
    if (!confirm('Cancel and delete this reservation?')) return;
    try {
      await fetch(`${API}/reservations/${id}`, { method: 'DELETE' });
      showNotification('Reservation cancelled');
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // --- Handlers: Kitchen & Orders ---
  const handleAdvanceOrderStatus = async (order, nextStatus) => {
    try {
      const res = await fetch(`${API}/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: nextStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Invalid status transition');
      }
      showNotification(`Order #${order.id} is now ${nextStatus}!`);
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm('Delete this order record?')) return;
    try {
      await fetch(`${API}/orders/${id}`, { method: 'DELETE' });
      showNotification('Order removed');
      fetchData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  return (
    <div className="restaurant-app">
      {/* Sidebar Navigation */}
      <aside className="app-sidebar">
        <div className="brand-section">
          <img src="/assets/Logo.png" alt="Savoria Logo" className="brand-logo-img" />
          <div>
            <div className="brand-title">Savoria</div>
            <div className="brand-sub">RESTAURANT OS</div>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span> Overview
          </button>
          <button
            className={`nav-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <span className="nav-icon">📜</span> Menu Catalog
          </button>
          <button
            className={`nav-btn ${activeTab === 'tables' ? 'active' : ''}`}
            onClick={() => setActiveTab('tables')}
          >
            <span className="nav-icon">🪑</span> Dining Tables
          </button>
          <button
            className={`nav-btn ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            <span className="nav-icon">📅</span> Reservations
          </button>
          <button
            className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="nav-icon">🛎️</span> Kitchen & Orders
          </button>
        </nav>

        <div className="sidebar-status-box">
          <div className="sidebar-status-header">
            <span className="status-dot"></span>
            <strong>Production Ready</strong>
          </div>
          <span>FastAPI + PostgreSQL + React + Kubernetes</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-content">
        {/* Top Header Bar */}
        <header className="top-bar">
          <div className="page-headline">
            <h1>
              {activeTab === 'overview' && 'Executive Dashboard'}
              {activeTab === 'menu' && 'Menu Management'}
              {activeTab === 'tables' && 'Floor & Dining Tables'}
              {activeTab === 'reservations' && 'Table Reservations'}
              {activeTab === 'orders' && 'Live Kitchen POS & Orders'}
            </h1>
            <p>Savoria Gourmet Dining Management System</p>
          </div>

          <div className="action-bar">
            {activeTab === 'menu' && (
              <button className="btn-primary" onClick={() => setShowMenuModal(true)}>
                ＋ Add Menu Item
              </button>
            )}
            {activeTab === 'tables' && (
              <button className="btn-primary" onClick={() => setShowTableModal(true)}>
                ＋ Add Table
              </button>
            )}
            {activeTab === 'reservations' && (
              <button className="btn-primary" onClick={() => setShowResModal(true)}>
                ＋ New Reservation
              </button>
            )}
            {activeTab === 'orders' && (
              <button className="btn-primary" onClick={() => setShowOrderModal(true)}>
                ＋ Place New Order
              </button>
            )}
            <button className="btn-secondary" onClick={fetchData} title="Refresh data">
              ↻ Refresh
            </button>
          </div>
        </header>

        <div className="view-container">
          {errorBanner && (
            <div className="feedback-alert error">
              <span>⚠️ {errorBanner}</span>
              <button className="btn-danger" onClick={() => setErrorBanner('')}>✕</button>
            </div>
          )}

          {successBanner && (
            <div className="feedback-alert success">
              <span>✓ {successBanner}</span>
            </div>
          )}

          {/* PAGE 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Hero Banner */}
              <div className="hero-banner overview-hero">
                <div className="hero-banner-content">
                  <div className="hero-eyebrow">WELCOME BACK</div>
                  <h2 className="hero-title">Here's what's happening today</h2>
                  <p className="hero-subtitle">
                    Manage your menu, tables, reservations and kitchen &mdash; all in one place.
                  </p>
                </div>
              </div>

              {/* KPI Metric Cards */}
              <div className="stats-cards-grid">
                <div className="stat-metric-card card-accent-gold">
                  <div className="stat-header">
                    <span className="stat-label">Total Revenue</span>
                    <span className="stat-icon">💰</span>
                  </div>
                  <div className="stat-value">${stats.total_revenue.toFixed(2)}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>

                <div className="stat-metric-card card-accent-orange">
                  <div className="stat-header">
                    <span className="stat-label">Active Orders</span>
                    <span className="stat-icon">🛎️</span>
                  </div>
                  <div className="stat-value">{stats.active_orders}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>

                <div className="stat-metric-card card-accent-blue">
                  <div className="stat-header">
                    <span className="stat-label">Active Bookings</span>
                    <span className="stat-icon">📅</span>
                  </div>
                  <div className="stat-value">{stats.active_reservations}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>

                <div className="stat-metric-card card-accent-rose">
                  <div className="stat-header">
                    <span className="stat-label">Dining Tables</span>
                    <span className="stat-icon">🪑</span>
                  </div>
                  <div className="stat-value">{stats.total_tables}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>

                <div className="stat-metric-card card-accent-amber">
                  <div className="stat-header">
                    <span className="stat-label">Menu Items</span>
                    <span className="stat-icon">📜</span>
                  </div>
                  <div className="stat-value">{stats.total_menu_items}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
              </div>

              {/* Bottom 2-column split */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                <div className="data-table-wrapper" style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px', color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
                    Recent Active Orders
                  </h3>
                  {orders.slice(0, 5).map((o) => (
                    <div
                      key={o.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderBottom: '1px solid var(--border-light)',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong>Order #{o.id}</strong> &mdash; Table {o.table ? o.table.table_number : 'Takeout'}
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {o.items.length} items &bull; ${o.total_amount.toFixed(2)}
                        </div>
                      </div>
                      <span className={`status-badge ${o.order_status.toLowerCase()}`}>
                        {o.order_status}
                      </span>
                    </div>
                  ))}
                  {orders.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No recent orders</p>}
                </div>

                <div className="data-table-wrapper" style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px', color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
                    Upcoming Reservations
                  </h3>
                  {reservations.slice(0, 5).map((r) => (
                    <div
                      key={r.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderBottom: '1px solid var(--border-light)',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong>{r.customer_name}</strong> ({r.party_size} guests)
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Table {r.table ? r.table.table_number : r.table_id} &bull;{' '}
                          {new Date(r.reservation_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <span className={`status-badge ${r.status.toLowerCase()}`}>{r.status}</span>
                    </div>
                  ))}
                  {reservations.length === 0 && (
                    <p style={{ color: 'var(--text-muted)' }}>No upcoming reservations</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* PAGE 2: MENU CATALOG */}
          {activeTab === 'menu' && (
            <>
              {/* Hero Banner */}
              <div className="hero-banner menu-hero">
                <div className="hero-banner-content">
                  <div className="hero-eyebrow">MENU MANAGEMENT</div>
                  <h2 className="hero-title">Build Your Perfect Menu</h2>
                  <p className="hero-subtitle">
                    Add, update and manage your menu items with ease.
                  </p>
                </div>
              </div>

              {/* 5-column KPI Row */}
              <div className="stats-cards-grid">
                <div className="stat-metric-card card-accent-gold">
                  <div className="stat-header">
                    <span className="stat-label">Total Revenue</span>
                    <span className="stat-icon">💰</span>
                  </div>
                  <div className="stat-value">${stats.total_revenue.toFixed(2)}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-orange">
                  <div className="stat-header">
                    <span className="stat-label">Active Orders</span>
                    <span className="stat-icon">🛎️</span>
                  </div>
                  <div className="stat-value">{stats.active_orders}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-blue">
                  <div className="stat-header">
                    <span className="stat-label">Active Bookings</span>
                    <span className="stat-icon">📅</span>
                  </div>
                  <div className="stat-value">{stats.active_reservations}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-rose">
                  <div className="stat-header">
                    <span className="stat-label">Dining Tables</span>
                    <span className="stat-icon">🪑</span>
                  </div>
                  <div className="stat-value">{stats.total_tables}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-amber">
                  <div className="stat-header">
                    <span className="stat-label">Menu Items</span>
                    <span className="stat-icon">📜</span>
                  </div>
                  <div className="stat-value">{stats.total_menu_items}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="filter-toolbar">
                {['ALL', 'Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Side'].map((cat) => (
                  <button
                    key={cat}
                    className={`filter-btn ${menuCategoryFilter === cat ? 'active' : ''}`}
                    onClick={() => setMenuCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Horizontal Menu Item Cards */}
              <div className="menu-catalog-grid">
                {menuItems
                  .filter((item) => menuCategoryFilter === 'ALL' || item.category === menuCategoryFilter)
                  .map((item) => (
                    <div className="menu-card-horizontal" key={item.id}>
                      <div className="menu-card-thumb">
                        {getFoodEmoji(item.category, item.name)}
                      </div>
                      <div className="menu-card-body">
                        <div>
                          <span className="category-tag">{item.category}</span>
                          <div className="menu-item-name">{item.name}</div>
                          <div className="menu-item-desc">
                            {item.description || 'Delicious freshly prepared culinary item crafted with fine ingredients.'}
                          </div>
                        </div>
                        <div className="menu-card-footer">
                          <span className="menu-price">${item.price.toFixed(2)}</span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn-secondary"
                              style={{ fontSize: '11px', padding: '4px 8px' }}
                              onClick={() => handleToggleMenuAvailability(item)}
                            >
                              {item.is_available ? 'Available' : 'Sold Out'}
                            </button>
                            <button
                              className="btn-danger"
                              onClick={() => handleDeleteMenuItem(item.id)}
                              title="Delete Item"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {menuItems.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📜</div>
                  <h3>No menu items found</h3>
                  <p>Click "+ Add Menu Item" above to create dishes.</p>
                </div>
              )}
            </>
          )}

          {/* PAGE 3: DINING TABLES */}
          {activeTab === 'tables' && (
            <>
              {/* 5-column KPI Row */}
              <div className="stats-cards-grid">
                <div className="stat-metric-card card-accent-gold">
                  <div className="stat-header">
                    <span className="stat-label">Total Revenue</span>
                    <span className="stat-icon">💰</span>
                  </div>
                  <div className="stat-value">${stats.total_revenue.toFixed(2)}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-orange">
                  <div className="stat-header">
                    <span className="stat-label">Active Orders</span>
                    <span className="stat-icon">🛎️</span>
                  </div>
                  <div className="stat-value">{stats.active_orders}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-blue">
                  <div className="stat-header">
                    <span className="stat-label">Active Bookings</span>
                    <span className="stat-icon">📅</span>
                  </div>
                  <div className="stat-value">{stats.active_reservations}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-rose">
                  <div className="stat-header">
                    <span className="stat-label">Dining Tables</span>
                    <span className="stat-icon">🪑</span>
                  </div>
                  <div className="stat-value">{stats.total_tables}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-amber">
                  <div className="stat-header">
                    <span className="stat-label">Menu Items</span>
                    <span className="stat-icon">📜</span>
                  </div>
                  <div className="stat-value">{stats.total_menu_items}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
              </div>

              {/* Floor Container with Dinning_banner.png as background */}
              <div className="dining-floor-container">
                {tables.length > 0 ? (
                  <div className="tables-grid">
                    {tables.map((tbl) => (
                      <div className="table-card" key={tbl.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Table
                          </span>
                          <span className="status-badge" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                            Active
                          </span>
                        </div>
                        <div className="table-badge-num">Table #{tbl.table_number}</div>
                        <div className="table-meta-pills">
                          <span className="meta-pill">Capacity: {tbl.capacity} Guests</span>
                          <span className="meta-pill">{tbl.location} Zone</span>
                        </div>
                        <button
                          className="btn-danger"
                          style={{ marginTop: 'auto' }}
                          onClick={() => handleDeleteTable(tbl.id)}
                        >
                          Remove Table
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state" style={{ background: 'transparent', border: 'none', padding: '80px 24px' }}>
                    <div className="empty-state-icon">🪑</div>
                    <h3>No dining tables created yet</h3>
                    <p>Add dining tables to start receiving reservations and orders.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* PAGE 4: RESERVATIONS */}
          {activeTab === 'reservations' && (
            <>
              {/* 5-column KPI Row */}
              <div className="stats-cards-grid">
                <div className="stat-metric-card card-accent-gold">
                  <div className="stat-header">
                    <span className="stat-label">Total Revenue</span>
                    <span className="stat-icon">💰</span>
                  </div>
                  <div className="stat-value">${stats.total_revenue.toFixed(2)}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-orange">
                  <div className="stat-header">
                    <span className="stat-label">Active Orders</span>
                    <span className="stat-icon">🛎️</span>
                  </div>
                  <div className="stat-value">{stats.active_orders}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-blue">
                  <div className="stat-header">
                    <span className="stat-label">Active Bookings</span>
                    <span className="stat-icon">📅</span>
                  </div>
                  <div className="stat-value">{stats.active_reservations}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-rose">
                  <div className="stat-header">
                    <span className="stat-label">Dining Tables</span>
                    <span className="stat-icon">🪑</span>
                  </div>
                  <div className="stat-value">{stats.total_tables}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-amber">
                  <div className="stat-header">
                    <span className="stat-label">Menu Items</span>
                    <span className="stat-icon">📜</span>
                  </div>
                  <div className="stat-value">{stats.total_menu_items}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
              </div>

              {/* Reservations Table */}
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>CUSTOMER</th>
                      <th>PHONE</th>
                      <th>TABLE</th>
                      <th>PARTY SIZE</th>
                      <th>DATE & TIME</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id}>
                        <td><strong>{r.customer_name}</strong></td>
                        <td>{r.customer_phone}</td>
                        <td>Table #{r.table ? r.table.table_number : r.table_id} ({r.table ? r.table.location : ''})</td>
                        <td>{r.party_size} Guests</td>
                        <td>{new Date(r.reservation_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td>
                          <span className={`status-badge ${r.status.toLowerCase()}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {r.status === 'CONFIRMED' && (
                              <button
                                className="btn-secondary"
                                style={{ fontSize: '11px', padding: '4px 8px' }}
                                onClick={() => handleUpdateReservationStatus(r.id, 'SEATED')}
                              >
                                Seat
                              </button>
                            )}
                            {r.status === 'SEATED' && (
                              <button
                                className="btn-secondary"
                                style={{ fontSize: '11px', padding: '4px 8px' }}
                                onClick={() => handleUpdateReservationStatus(r.id, 'COMPLETED')}
                              >
                                Complete
                              </button>
                            )}
                            <button
                              className="btn-danger"
                              onClick={() => handleDeleteReservation(r.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {reservations.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                          No reservations recorded. Click "+ New Reservation" above to book a table.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* PAGE 5: KITCHEN & ORDERS */}
          {activeTab === 'orders' && (
            <>
              {/* Hero Banner with Kitchen Orders Image */}
              <div className="hero-banner kitchen-hero">
                <div className="hero-banner-content">
                  <div className="hero-eyebrow">LIVE KITCHEN</div>
                  <h2 className="hero-title">Live Kitchen POS & Orders</h2>
                  <p className="hero-subtitle">
                    Manage kitchen orders in real-time and keep your service running smoothly.
                  </p>
                </div>
              </div>

              {/* 5-column KPI Row */}
              <div className="stats-cards-grid">
                <div className="stat-metric-card card-accent-gold">
                  <div className="stat-header">
                    <span className="stat-label">Total Revenue</span>
                    <span className="stat-icon">💰</span>
                  </div>
                  <div className="stat-value">${stats.total_revenue.toFixed(2)}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-orange">
                  <div className="stat-header">
                    <span className="stat-label">Active Orders</span>
                    <span className="stat-icon">🛎️</span>
                  </div>
                  <div className="stat-value">{stats.active_orders}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-blue">
                  <div className="stat-header">
                    <span className="stat-label">Active Bookings</span>
                    <span className="stat-icon">📅</span>
                  </div>
                  <div className="stat-value">{stats.active_reservations}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-rose">
                  <div className="stat-header">
                    <span className="stat-label">Dining Tables</span>
                    <span className="stat-icon">🪑</span>
                  </div>
                  <div className="stat-value">{stats.total_tables}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
                <div className="stat-metric-card card-accent-amber">
                  <div className="stat-header">
                    <span className="stat-label">Menu Items</span>
                    <span className="stat-icon">📜</span>
                  </div>
                  <div className="stat-value">{stats.total_menu_items}</div>
                  <svg className="kpi-wave-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12 L100,24 L0,24 Z" fill="currentColor" fillOpacity="0.12" />
                    <path d="M0,18 C25,24 45,6 70,14 C85,20 95,8 100,12" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  </svg>
                </div>
              </div>

              {/* Status Filter Pills */}
              <div className="filter-toolbar">
                {['ALL', 'PLACED', 'PREPARING', 'SERVED', 'PAID', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    className={`filter-btn ${orderStatusFilter === st ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Orders Panel */}
              <div className="orders-pipeline">
                {orders
                  .filter((o) => orderStatusFilter === 'ALL' || o.order_status === orderStatusFilter)
                  .map((order) => (
                    <div className="order-ticket" key={order.id}>
                      <div className="order-ticket-header">
                        <div>
                          <span className="order-id-tag">Order #{order.id}</span>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Table {order.table ? order.table.table_number : 'Takeout'}
                          </div>
                        </div>
                        <span className={`status-badge ${order.order_status.toLowerCase()}`}>
                          {order.order_status}
                        </span>
                      </div>

                      <ul className="order-items-list">
                        {order.items.map((it) => (
                          <li className="order-item-row" key={it.id}>
                            <span>
                              {it.quantity}x {it.menu_item ? it.menu_item.name : `Item #${it.menu_item_id}`}
                            </span>
                            <strong>${it.item_total.toFixed(2)}</strong>
                          </li>
                        ))}
                      </ul>

                      {order.notes && (
                        <div style={{ fontSize: '12px', color: 'var(--accent-gold-light)', margin: '4px 0' }}>
                          Note: {order.notes}
                        </div>
                      )}

                      <div className="order-ticket-footer">
                        <span className="order-total-sum">${order.total_amount.toFixed(2)}</span>
                        <div className="order-actions">
                          {order.order_status === 'PLACED' && (
                            <>
                              <button
                                className="btn-primary"
                                style={{ fontSize: '12px', padding: '6px 12px' }}
                                onClick={() => handleAdvanceOrderStatus(order, 'PREPARING')}
                              >
                                Cook 🍳
                              </button>
                              <button
                                className="btn-danger"
                                onClick={() => handleAdvanceOrderStatus(order, 'CANCELLED')}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {order.order_status === 'PREPARING' && (
                            <button
                              className="btn-primary"
                              style={{ fontSize: '12px', padding: '6px 12px' }}
                              onClick={() => handleAdvanceOrderStatus(order, 'SERVED')}
                            >
                              Serve 🍽️
                            </button>
                          )}
                          {order.order_status === 'SERVED' && (
                            <button
                              className="btn-primary"
                              style={{ fontSize: '12px', padding: '6px 12px' }}
                              onClick={() => handleAdvanceOrderStatus(order, 'PAID')}
                            >
                              Pay 💳
                            </button>
                          )}
                          <button
                            className="btn-secondary"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                            onClick={() => handleDeleteOrder(order.id)}
                            title="Delete Order"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {orders.filter((o) => orderStatusFilter === 'ALL' || o.order_status === orderStatusFilter).length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">🛎️</div>
                  <h3>No orders in this view</h3>
                  <p>Click "+ Place New Order" above to submit kitchen tickets.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* MODAL: ADD MENU ITEM */}
      {showMenuModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>Add New Culinary Dish</h2>
              <button className="modal-close-btn" onClick={() => setShowMenuModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateMenuItem}>
              <div className="modal-form">
                <div className="form-group">
                  <label>Item Name</label>
                  <input name="name" required placeholder="e.g. Pan-Seared Chilean Sea Bass" />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" defaultValue="Main Course">
                      <option>Appetizer</option>
                      <option>Main Course</option>
                      <option>Dessert</option>
                      <option>Beverage</option>
                      <option>Side</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input name="price" type="number" step="0.01" min="0.5" required placeholder="24.50" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" rows="3" placeholder="Ingredients, culinary pairing, preparation..." />
                </div>
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" name="is_available" defaultChecked id="avail-chk" />
                  <label htmlFor="avail-chk" style={{ cursor: 'pointer', margin: 0 }}>Available immediately</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowMenuModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Dish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TABLE */}
      {showTableModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>Add Dining Table</h2>
              <button className="modal-close-btn" onClick={() => setShowTableModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateTable}>
              <div className="modal-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Table Number</label>
                    <input name="table_number" type="number" min="1" required placeholder="e.g. 15" />
                  </div>
                  <div className="form-group">
                    <label>Seating Capacity</label>
                    <input name="capacity" type="number" min="1" max="24" required defaultValue="4" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Location Zone</label>
                  <select name="location" defaultValue="Indoor">
                    <option>Indoor</option>
                    <option>Window</option>
                    <option>Patio</option>
                    <option>Bar</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowTableModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Table</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW RESERVATION */}
      {showResModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>Book Table Reservation</h2>
              <button className="modal-close-btn" onClick={() => setShowResModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateReservation}>
              <div className="modal-form">
                <div className="form-group">
                  <label>Customer Full Name</label>
                  <input name="customer_name" required placeholder="e.g. Eleanor Vance" />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input name="customer_phone" required placeholder="+1 555-0199" />
                  </div>
                  <div className="form-group">
                    <label>Party Size</label>
                    <input name="party_size" type="number" min="1" max="30" defaultValue="2" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Select Table</label>
                  <select name="table_id" required>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        Table #{t.table_number} ({t.location}) &mdash; Cap: {t.capacity} Guests
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Reservation Date & Time</label>
                  <input
                    name="reservation_time"
                    type="datetime-local"
                    required
                    defaultValue={new Date(Date.now() + 3600000).toISOString().slice(0, 16)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowResModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Confirm Reservation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW ORDER */}
      {showOrderModal && (
        <OrderCreateModal
          tables={tables}
          menuItems={menuItems}
          onClose={() => setShowOrderModal(false)}
          onSuccess={() => {
            setShowOrderModal(false);
            showNotification('Order submitted to kitchen!');
            fetchData();
          }}
          onError={(msg) => showNotification(msg, true)}
        />
      )}
    </div>
  );
}

function OrderCreateModal({ tables, menuItems, onClose, onSuccess, onError }) {
  const [selectedTable, setSelectedTable] = useState(tables.length ? tables[0].id : '');
  const [orderItems, setOrderItems] = useState([
    { menu_item_id: menuItems.length ? menuItems[0].id : '', quantity: 1 },
  ]);
  const [notes, setNotes] = useState('');

  const availableItems = menuItems.filter((i) => i.is_available);

  const addItemRow = () => {
    if (availableItems.length) {
      setOrderItems([...orderItems, { menu_item_id: availableItems[0].id, quantity: 1 }]);
    }
  };

  const updateItemRow = (idx, field, val) => {
    const copy = [...orderItems];
    copy[idx][field] = val;
    setOrderItems(copy);
  };

  const removeItemRow = (idx) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== idx));
    }
  };

  const calculatedTotal = orderItems.reduce((acc, row) => {
    const it = menuItems.find((m) => m.id === parseInt(row.menu_item_id, 10));
    return acc + (it ? it.price * (parseInt(row.quantity, 10) || 1) : 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      table_id: selectedTable ? parseInt(selectedTable, 10) : null,
      notes,
      items: orderItems.map((oi) => ({
        menu_item_id: parseInt(oi.menu_item_id, 10),
        quantity: parseInt(oi.quantity, 10),
      })),
    };

    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to place order');
      }
      onSuccess();
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>Place Kitchen Order</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-form">
            <div className="form-group">
              <label>Dining Table</label>
              <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                <option value="">Takeout / No Table</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    Table #{t.table_number} ({t.location}) &mdash; Cap: {t.capacity} Guests
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Order Items</label>
              {orderItems.map((row, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <select
                    style={{ flex: 3 }}
                    value={row.menu_item_id}
                    onChange={(e) => updateItemRow(idx, 'menu_item_id', e.target.value)}
                  >
                    {availableItems.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (${m.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    style={{ flex: 1 }}
                    value={row.quantity}
                    onChange={(e) => updateItemRow(idx, 'quantity', e.target.value)}
                  />
                  {orderItems.length > 1 && (
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => removeItemRow(idx)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                style={{ alignSelf: 'flex-start', marginTop: '4px' }}
                onClick={addItemRow}
              >
                ＋ Add Another Item
              </button>
            </div>

            <div className="form-group">
              <label>Special Instructions / Notes</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Extra napkins, dressing on side"
              />
            </div>

            <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: '800', marginTop: '12px' }}>
              Estimated Total:{' '}
              <span style={{ color: 'var(--accent-gold-light)' }}>
                ${calculatedTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Submit to Kitchen</button>
          </div>
        </form>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
