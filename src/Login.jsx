import React, { useState } from 'react';
import './App.css';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      // Sign in with email and password using Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      // If sign-in is successful, call onLogin callback
      onLogin();
    } catch (error) {
      setError(error.message);
    }
    // Clear email and password fields after login
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
