import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/Admin/AdminAuthContext'
import CircularProgress from '@mui/material/CircularProgress'

const PrivateRouteAdmin = ({ children }) => {
  const { isAuthenticated, isLoading, authChecked } = useAuth()

  if (!authChecked || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    )
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace={true}/>
  }
  return children
}

export default PrivateRouteAdmin