import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import EnterEmail from './components/EnterEmail'
import EnterOtp from './components/EnterOtp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<EnterEmail />} />
        <Route path='/verify' element={<EnterOtp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
