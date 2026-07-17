import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="nav-bar">
      <div className="nav-brand" onClick={() => navigate('/')}>AI Health Navigator</div>
      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink to="/" end>Home</NavLink>
        {user ? (
          <>
            <NavLink to="/app">Dashboard</NavLink>
            <NavLink to="/app/symptoms">Symptom Checker</NavLink>
            <NavLink to="/app/reports">Reports</NavLink>
            <NavLink to="/app/doctors">Doctors</NavLink>
            <NavLink to="/app/assistant">AI Assistant</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
      {user ? (
        <div className="nav-actions">
          <span className="nav-user">Hello, {user.profile.fullName || user.name}</span>
          <button className="secondary-button" type="button" onClick={logout}>Logout</button>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
