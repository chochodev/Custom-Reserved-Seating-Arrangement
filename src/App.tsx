import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CreatePage from './pages/create';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<a href='/create'>Create</a>} />
        <Route path="/create" element={<CreatePage />} />
      </Routes>
    </Router>
  )
}

export default App;