import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

import { login, logout, selectAuthStatus, selectUserData } from './store/authSlice';
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector(selectAuthStatus);
  const currentUser = useSelector(selectUserData);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(
          "https://expense-manager-5.onrender.com/api/v1/manager/user/getCurrentUser",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
        return response;
      } catch (error) {
        console.error("Login first", error);
        dispatch(logout());
        return null;
      }
    };

    getCurrentUser().then((response) => {
      if (response?.data?.status) {
        dispatch(login({ userData: response.data }));
        navigate('/dashboard');
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <main>
      {isLoggedIn ? (
        <Outlet />
      ) : (
        <p>Checking authentication…</p>
      )}
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </main>
  );
}

export default App;
