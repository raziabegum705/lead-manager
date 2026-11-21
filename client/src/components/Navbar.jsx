import { useAuth } from '../context/AuthContext';
import { avatarStyle } from '../utils/avatar';
import { LogoMark } from './Icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand"><LogoMark /><span>LeadFlow</span></div>
        <div className="navbar-user">
          <div className="avatar avatar-ring" style={avatarStyle(user.name)}>{user.name.charAt(0).toUpperCase()}</div>
          <span className="navbar-name">{user.name}</span>
          <button className="btn btn-nav" onClick={logout}>Log out</button>
        </div>
      </div>
    </header>
  );
}
