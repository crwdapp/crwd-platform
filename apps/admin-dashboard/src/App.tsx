import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from './components/Layout/AdminLayout'
import Dashboard from './pages/Dashboard'
import BarList from './pages/Bars/BarList'
import EventList from './pages/Events/EventList'
import SystemAnalytics from './pages/Analytics/SystemAnalytics'
import BarAnalytics from './pages/Analytics/BarAnalytics'
import UserAnalytics from './pages/Analytics/UserAnalytics'
import CampaignList from './pages/Campaigns/CampaignList'
import UserList from './pages/Users/UserList'
import Settings from './pages/Settings/Settings'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="bars" element={<BarList />} />
          <Route path="events" element={<EventList />} />
          <Route path="analytics">
            <Route index element={<SystemAnalytics />} />
            <Route path="system" element={<SystemAnalytics />} />
            <Route path="bars" element={<BarAnalytics />} />
            <Route path="users" element={<UserAnalytics />} />
          </Route>
          <Route path="campaigns" element={<CampaignList />} />
          <Route path="users" element={<UserList />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
