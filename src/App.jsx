import React, { useState } from 'react';
import Login from './Login';
import Weather from './Weather';
import PrivateRoute from './PrivateRoute';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpg_UsK_SzpQJKmwmNxUQXIszNBh8dTYc",
  authDomain: "reaktos.firebaseapp.com",
  projectId: "reaktos",
  storageBucket: "reaktos.appspot.com",
  messagingSenderId: "303728840212",
  appId: "1:303728840212:web:75c88fe8f2a01ff4cca101",
  measurementId: "G-QGTTGTEYBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = (username, password) => {
    setCredentials({ username, password });
    setIsAuthenticated(true);
  };

  return (
    <div>
      <PrivateRoute isAuthenticated={isAuthenticated}>
        <Weather />
      </PrivateRoute>
      {!isAuthenticated && <Login onLogin={handleLogin} />}
    </div>
  );
};

export default App;
