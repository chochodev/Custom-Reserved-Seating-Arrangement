import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AddSeat from './pages/create';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<a href='/create'>Create</a>} />
        <Route path="/create" element={<AddSeat />} />
      </Routes>
    </Router>
  )
}

export default App;