import React, {Suspense, lazy} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from './utils/ThemeContext';

import './css/style.css';

import { Loading } from './components/ui';
const App = lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
          <Suspense fallback={<Loading />}>
            <App />
          </Suspense>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
