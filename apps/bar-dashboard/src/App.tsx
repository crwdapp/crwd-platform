import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from './components/Layout/DashboardLayout'
import { DashboardOverview } from './pages/DashboardOverview'

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardOverview />} />
      </Routes>
    </DashboardLayout>
  )
}


export default App