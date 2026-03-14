import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Import Tailwind CSS
import { AuthProvider } from './contexts/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)