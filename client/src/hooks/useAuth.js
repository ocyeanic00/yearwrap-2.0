import { useEffect } from 'react'
import useUserStore from '../store/userStore'

function useAuth() {
  const { user, token, setUser, setToken, logout } = useUserStore()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [setToken])

  return { user, token, logout }
}

export default useAuth
