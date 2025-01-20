import React, { useState } from 'react';
import styled from 'styled-components';
import axios from "axios";
import { lineSpinner } from "ldrs";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router';

lineSpinner.register();

const BlackThemedRegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("https://expense-manager-5.onrender.com/api/v1/manager/register", {
                username: formData.username,
                userName: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });
            toast.success('Registration successful!', {
                style: {
                    backgroundColor: 'black',
                    width: '320px',
                    color: 'white',
                }
            });
            dispatch(login({ userData: response.data }));
            setFormData({ username: "", email: "", password: "", confirmPassword: "" });
            setError(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong.', {
                style: {
                    backgroundColor: 'black',
                    width: '320px',
                    color: 'white',
                }
            });
            setError(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post("https://expense-manager-5.onrender.com/api/v1/manager/login", {
                userName: formData.email,
                password: formData.password,
            });
            toast.success('Login successful!', {
                style: {
                    backgroundColor: 'black',
                    width: '320px',
                    color: 'white',
                }
            });
            dispatch(login({ userData: response.data }));
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
            setFormData({ username: "", email: "", password: "", confirmPassword: "" });
            setError(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong.', {
                style: {
                    backgroundColor: 'black',
                    width: '320px',
                    color: 'white',
                }
            });
            setError(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StyledWrapper>
            {!isLogin ? <form className="form" onSubmit={handleSubmit}>
                <h2 className="form-title">Register</h2>

                {error && <p className="error">{error}</p>}

                <div className="input-group">
                    <label htmlFor="username" className="label">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="email" className="label">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password" className="label">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword" className="label">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button className="submit-btn" type="submit">
                    {isLoading ? (
                        <l-line-spinner
                            size="25"
                            stroke="3"
                            speed="1"
                            color="black"
                        ></l-line-spinner>
                    ) : (
                        'Submit'
                    )}
                </button>
                <div className="helper-text">
                    Already have an account? <a href="#" onClick={() => setIsLogin(true)} >Sign in</a>
                </div>
            </form> : <form className="form" onSubmit={handleSubmitLogin}>
                <h2 className="form-title">Login</h2>

                {error && <p className="error">{error}</p>}

                <div className="input-group">
                    <label htmlFor="email" className="label">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password" className="label">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button className="submit-btn" type="submit">
                    {isLoading ? (
                        <l-line-spinner
                            size="25"
                            stroke="3"
                            speed="1"
                            color="black"
                        ></l-line-spinner>
                    ) : (
                        'Submit'
                    )}
                </button>

                <div className="helper-text">
                    Forgot password? <a href="#">Reset</a>
                </div>
                <div className="helper-text">
                    Don't have an account? <a href="#" onClick={() => setIsLogin(false)} >Sign Up</a>
                </div>
            </form>}
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%; 
  padding: 1rem;

  .form {
    background: #1e1e1e;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    color: #ffffff;
  }

  .form-title {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .label {
    font-weight: 600;
  }

  input[type='email'],
  input[type='password'],
  input[type='text'] {
    padding: 0.75rem 1rem;
    border: 1px solid #333;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    background-color: #2c2c2c;
    color: #fff;
    transition: border-color 0.3s ease;
  }

  input[type='email']:focus,
  input[type='password']:focus,
  input[type='text']:focus {
    border-color: #58bc82;
    outline: none;
  }

  .submit-btn {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    color: #fff;
    background: #58bc82;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .submit-btn:hover {
    background: #45a472;
  }

  .helper-text {
    font-size: 0.9rem;
    text-align: center;
  }

  .helper-text a {
    color: #58bc82;
    text-decoration: none;
    font-weight: bold;
  }

  .helper-text a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .form {
      padding: 1.5rem;
      gap: 1rem;
    }

    .form-title {
      font-size: 1.25rem;
    }

    .submit-btn {
      font-size: 0.9rem;
      padding: 0.6rem 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .form {
      padding: 1rem;
    }

    .form-title {
      font-size: 1.1rem;
    }

    input[type='email'],
    input[type='password'],
    input[type='text'] {
      font-size: 0.9rem;
    }

    .submit-btn {
      font-size: 0.8rem;
      padding: 0.5rem 0.7rem;
    }

    .helper-text {
      font-size: 0.8rem;
    }
  }
`;

export default BlackThemedRegisterForm;
