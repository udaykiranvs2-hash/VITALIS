import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchNotifications } from '../api/api.js';
import Loader from '../components/Loader.jsx';

function DashboardPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetchNotifications();
        setNotifications(response.data.notifications || []);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const recentActivity = user?.history?.slice(0, 3).map((item, index) => ({
    title: item.result.possibleConditions?.[0] || 'Symptom check',
    subtitle: item.duration,
    date: new Date(item.checkedAt).toLocaleDateString()
  })) || [];

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>{user?.profile?.fullName || user?.name}, your health hub is ready.</h1>
          <p>Review your latest activity, manage reports, and access AI-guided care tools in one place.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/app/symptoms" className="primary-button">Start symptom check</Link>
          <Link to="/app/reports" className="secondary-button">Analyze report</Link>
        </div>
      </section>

      <section className="section stat-grid">
        <article>
          <h3>{user?.reports?.length || 0}</h3>
          <p>Uploaded reports</p>
        </article>
        <article>
          <h3>{user?.appointments?.filter((item) => item.status !== 'cancelled').length || 0}</h3>
          <p>Upcoming appointments</p>
        </article>
        <article>
          <h3>{user?.history?.length || 0}</h3>
          <p>Health checks</p>
        </article>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Recent activity</h2>
          <Link to="/app/history">View history</Link>
        </div>
        {recentActivity.length ? (
          <div className="activity-list">
            {recentActivity.map((item, index) => (
              <article key={index} className="activity-card">
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
                <span>{item.date}</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">No recent activity yet. Start with a symptom check or report analyzer.</p>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Notifications</h2>
          <span>{notifications.length} items</span>
        </div>
        {loading ? (
          <Loader label="Loading notifications…" />
        ) : notifications.length ? (
          <ul className="notification-list">
            {notifications.map((notification, index) => (
              <li key={index} className="notification-item">
                <p>{notification.message}</p>
                <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No notifications at the moment.</p>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
