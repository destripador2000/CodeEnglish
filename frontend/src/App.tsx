import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { VocabularyStudy } from './pages/VocabularyStudy';
import { VerbsStudy } from './pages/VerbsStudy';
import { IdiomsStudy } from './pages/IdiomsStudy';
import { SynonymsStudy } from './pages/SynonymsStudy';
import { SayingsStudy } from './pages/SayingsStudy';
import { CountriesStudy } from './pages/CountriesStudy';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/vocabulary" element={<VocabularyStudy />} />
        <Route path="/dashboard/verbs" element={<VerbsStudy />} />
        <Route path="/dashboard/idioms" element={<IdiomsStudy />} />
        <Route path="/dashboard/synonyms" element={<SynonymsStudy />} />
        <Route path="/dashboard/sayings" element={<SayingsStudy />} />
        <Route path="/dashboard/countries" element={<CountriesStudy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
