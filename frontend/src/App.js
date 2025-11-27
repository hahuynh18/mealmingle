import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pantry from './pages/Pantry';
import EditItem from './pages/EditItem';

function App() {
  return (
    <Router>
      <header className="App-header">
        <div className="App">
          <Routes>
            <Route path="/" element={<Pantry />} />
            <Route path="/edit/:id" element={<EditItem />} />
          </Routes>
        </div>
      </header>
    </Router>
  );
}

export default App;
