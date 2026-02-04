import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { DataProvider } from './components/DataContext.tsx'
import "./index.css";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
<<<<<<< HEAD
  </StrictMode>,
=======
  </StrictMode>,  
>>>>>>> bf1c3f529fe991c4fa0ff275ccf572127882cf15
)
