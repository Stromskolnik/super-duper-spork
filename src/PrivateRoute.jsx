import React from 'react';

const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <>{children}</> : <p></p>;
};

export default PrivateRoute;
