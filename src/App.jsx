import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { login, logout } from './store/authSlice';
import "./App.css"

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get("expense-manager-three-eta.vercel.app/api/v1/manager/user/getCurrentUser", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

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

  }, [dispatch]);

  return (
    <main>
      <Outlet />
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </main>
  );
}

export default App;
