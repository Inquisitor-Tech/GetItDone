function ProtectedRoute({ children }) {
  // Placeholder until AuthContext exists (Stage 4).
  // Once auth is wired in, this will redirect to /login if there's no user.
  return children;
}

export default ProtectedRoute;