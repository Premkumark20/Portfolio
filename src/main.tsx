import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { fetchPortfolioData } from './lib/csvData.ts'

// Kick off data fetch immediately — before React even renders.
// By the time components mount and call fetchPortfolioData(),
// the singleton cache is already populated or in-flight.
fetchPortfolioData();

createRoot(document.getElementById("root")!).render(<App />);
