import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ReactGA from 'react-ga4'

import HomeScreen from './views/HomeScreen'
import Layout from './components/Layout'

if (import.meta.env.VITE_NODE_ENV === 'production') {
  ReactGA.initialize(import.meta.env.VITE_GTAG_ID)
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<HomeScreen />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
