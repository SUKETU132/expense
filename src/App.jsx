// App.jsx
import { ToastContainer } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Outlet } from 'react-router-dom'
import axios from 'axios'
import { login, logout, selectAuthStatus } from './store/authSlice'
import './App.css'

export default function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoggedIn = useSelector(selectAuthStatus)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(
          'https://expense-manager-5.onrender.com/api/v1/manager/user/getCurrentUser',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true,
          }
        )
        return res
      } catch {
        dispatch(logout())
        return null
      }
    }

    fetchUser().then(res => {
      if (res?.data?.status) {
        dispatch(login({ userData: res.data }))
        navigate('/dashboard')
      } else {
        dispatch(logout())
      }
      setLoading(false)
    })
  }, [dispatch, navigate])

  useEffect(() => {
    if (!isLoggedIn && !loading) navigate('/')
  }, [isLoggedIn, loading, navigate])

  return (
    <main>
      {loading && (
        <div className="loader-overlay">
          <div className="loader-spinner">
            <div className="dot dot1" />
            <div className="dot dot2" />
            <div className="dot dot3" />
          </div>
        </div>
      )}
      {!loading && (isLoggedIn ? <Outlet /> : <p>Redirecting to login…</p>)}
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </main>
  )
}
