export default function StatsSection() {
  return (
    <section className="landing-stats-section">
      <div className="general-container">
        <div className="landing-stats-header">
          <h2 className="landing-stats-title">
            Trusted by thousands of businesses
          </h2>
          <p className="landing-stats-subtitle">
            Join the growing community of successful businesses
          </p>
        </div>
        <div className="landing-stats-grid">
          <div className="landing-stat-item">
            <div className="landing-stat-value landing-stat-value-blue">10K+</div>
            <div className="landing-stat-label">Active Users</div>
          </div>
          <div className="landing-stat-item">
            <div className="landing-stat-value landing-stat-value-green">50K+</div>
            <div className="landing-stat-label">Bookings Made</div>
          </div>
          <div className="landing-stat-item">
            <div className="landing-stat-value landing-stat-value-purple">99.9%</div>
            <div className="landing-stat-label">Uptime</div>
          </div>
          <div className="landing-stat-item">
            <div className="landing-stat-value landing-stat-value-orange">4.9/5</div>
            <div className="landing-stat-label">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
