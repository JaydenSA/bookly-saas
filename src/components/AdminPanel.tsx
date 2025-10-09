"use client";

import { useState } from 'react';
import UsersTester from './admin/UsersTester';
import BusinessesTester from './admin/BusinessesTester';
import ServicesTester from './admin/ServicesTester';
import BookingsTester from './admin/BookingsTester';
import { AdminPanelProps, TabType } from '@/types';

const DashboardIcon = () => (
  <svg className="general-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="general-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const BusinessIcon = () => (
  <svg className="general-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ServiceIcon = () => (
  <svg className="general-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BookingIcon = () => (
  <svg className="general-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PaymentIcon = () => (
  <svg className="general-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);


  const StatusIndicator = ({ connected, pingOk }: { connected: boolean; pingOk: boolean }) => (
    <div className="status-indicator">
      <div className="status-badge">
        <div className={`status-dot ${connected ? 'status-dot-success' : 'status-dot-error'}`}></div>
        <span className="status-text">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <div className="status-badge">
        <div className={`status-dot ${pingOk ? 'status-dot-success' : 'status-dot-error'}`}></div>
        <span className="status-text">
          {pingOk ? 'Ping OK' : 'Ping Failed'}
        </span>
      </div>
    </div>
  );

export default function AdminPanel({
  connected,
  pingOk,
  userCount,
  businessCount,
  serviceCount,
  bookingCount,
  errorMessage,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'businesses', label: 'Businesses', icon: BusinessIcon },
    { id: 'services', label: 'Services', icon: ServiceIcon },
    { id: 'bookings', label: 'Bookings', icon: BookingIcon },
    { id: 'payments', label: 'Payments', icon: PaymentIcon },
  ];

  const stats = [
    { 
      label: 'Users', 
      value: userCount ?? 0, 
      icon: UsersIcon,
      bgColor: 'stat-icon-bg-blue'
    },
    { 
      label: 'Businesses', 
      value: businessCount ?? 0, 
      icon: BusinessIcon,
      bgColor: 'stat-icon-bg-green'
    },
    { 
      label: 'Services', 
      value: serviceCount ?? 0, 
      icon: ServiceIcon,
      bgColor: 'stat-icon-bg-purple'
    },
    { 
      label: 'Bookings', 
      value: bookingCount ?? 0, 
      icon: BookingIcon,
      bgColor: 'stat-icon-bg-orange'
    },
  ];

  return (
    <div className="admin-layout">
      {/* Clean Header */}
      <div className="admin-header">
        <div className="general-container">
          <div className="admin-header-content">
            <div>
              <h1 className="dashboard-title">Admin Dashboard</h1>
              <p className="admin-subtitle">Booking System Management Portal</p>
            </div>
            <StatusIndicator connected={connected} pingOk={pingOk} />
          </div>
        </div>
      </div>

      {/* Clean Navigation */}
      <div className="admin-nav">
        <div className="general-container">
          <nav className="admin-nav-content">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`admin-nav-item ${
                    activeTab === tab.id
                      ? 'admin-nav-item-active'
                      : 'admin-nav-item-inactive'
                  }`}
                >
                  <Icon />
                  <span className="ml-2">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="general-container py-12">
        {errorMessage && (
          <div className="alert-error">
            <div className="alert-error-content">
              <div className="alert-error-icon">
                <svg className="alert-error-icon-svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="alert-error-body">
                <h3 className="alert-error-title">Database Error</h3>
                <div className="alert-error-message">
                  <pre className="alert-error-code">{errorMessage}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="admin-section">
            {/* Welcome Section */}
            <div className="dashboard-card">
              <div className="dashboard-welcome">
                <div>
                  <h2 className="dashboard-title">Welcome to your Dashboard</h2>
                  <p className="dashboard-subtitle">Monitor your booking system performance and manage your business operations.</p>
                </div>
                <div className="general-hidden-lg">
                  <div className="dashboard-welcome-icon">
                    <svg className="dashboard-welcome-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Database Status Cards */}
            <div className="admin-dashboard-grid">
              <div className="dashboard-card">
                <h3 className="card-title">
                  <svg className="general-icon-lg general-icon-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  Database Status
                </h3>
                <div className="general-space-y-6">
                  <div className="db-status-item">
                    <span className="db-status-label">MongoDB Connection</span>
                    <div className="db-status-value">
                      <div className={`db-status-dot ${connected ? 'db-status-dot-success' : 'db-status-dot-error'}`}></div>
                      <span className={`db-status-text ${connected ? 'db-status-text-success' : 'db-status-text-error'}`}>
                        {connected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                  <div className="db-status-item">
                    <span className="db-status-label">Database Ping</span>
                    <div className="db-status-value">
                      <div className={`db-status-dot ${pingOk ? 'db-status-dot-success' : 'db-status-dot-error'}`}></div>
                      <span className={`db-status-text ${pingOk ? 'db-status-text-success' : 'db-status-text-error'}`}>
                        {pingOk ? 'OK' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3 className="card-title">
                  <svg className="general-icon-lg general-icon-success mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Quick Actions
                </h3>
                <div className="quick-actions-grid">
                  <button className="quick-action-btn quick-action-btn-primary">
                    <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="quick-action-text">Add User</span>
                  </button>
                  <button className="quick-action-btn quick-action-btn-secondary">
                    <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="quick-action-text">New Business</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="stats-section">
              <h3 className="stats-section-title">
                <svg className="stats-section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                System Statistics
              </h3>
              <div className="stats-grid">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="stat-card">
                      <div className="stat-card-icon">
                        <div className={`stat-icon-bg ${stat.bgColor}`}>
                          <Icon />
                        </div>
                      </div>
                      <div>
                        <p className="stat-label">{stat.label}</p>
                        <p className="stat-value">{stat.value.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className={`${activeTab !== 'dashboard' ? 'mt-12' : ''}`}>
          {activeTab === 'users' && <div className="table-container"><UsersTester /></div>}
          {activeTab === 'businesses' && <div className="table-container"><BusinessesTester /></div>}
          {activeTab === 'services' && <div className="table-container"><ServicesTester /></div>}
          {activeTab === 'bookings' && <div className="table-container"><BookingsTester /></div>}
          {activeTab === 'payments' && (
            <div className="table-container">
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">
                    <svg className="admin-card-title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payments
                  </h3>
                </div>
                <div className="admin-card-padding">
                  <p className="general-text-secondary">Payment management functionality coming soon.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
