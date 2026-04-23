import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SmoothScrollProvider } from './motion/SmoothScroll';

const HomePage = lazy(() => import('./pages/HomePage'));
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'));

function App() {
  return (
    <SmoothScrollProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/works/:id" element={<CaseStudyPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </SmoothScrollProvider>
  );
}

export default App;
