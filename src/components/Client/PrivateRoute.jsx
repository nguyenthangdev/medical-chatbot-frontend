import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/Client/ClientAuthContext'
import CircularProgress from '@mui/material/CircularProgress'

const PrivateRouteClient = ({ children }) => {
  const { isAuthenticated, loading, authChecked } = useAuth()
  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace={true}/>
  }
  return children

}

export default PrivateRouteClient