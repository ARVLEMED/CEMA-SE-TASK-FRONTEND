import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import ClientsPage from './pages/ClientsPage';
import Programs from './pages/ProgramsPage';
import Consultation from './pages/ConsultationPage';
import RegisterClient from './pages/RegisterClient';
import ClientEdit from './pages/ClientEdit';
import ClientDetail from './pages/ClientDetails';
import ProgramEdit from './pages/ProgramEdit';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path='/home' element={<HomePage/>}/>
      <Route path='/clients' element={<ClientsPage/>}/>
      <Route path='/programs' element={<Programs/>}/>
      <Route path='/consultation' element={<Consultation/>}/>
      <Route path="/register" element={<RegisterClient />} />
      <Route path="/clients/:id/edit" element={<ClientEdit />} />
      <Route path="/clients/:id" element={<ClientDetail />} />
      <Route path="/programs/:id/edit" element={<ProgramEdit />} />
    </Routes>
  );
}

export default App;
