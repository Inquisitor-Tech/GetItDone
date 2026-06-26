import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Habits from './pages/Habits'
import Leaderboard from './pages/Leaderboard'
import PublicProfile from './pages/PublicProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile/:userId" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
