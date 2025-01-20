import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../store/authSlice';
import Loader from './Loader';
import Input from './Search';
import "./style/style.css"
import Button from './Button';
import Profile from "./Profile";
import AddButton from "./AddButton";
import FormSubmit from './FormSubmit';

const Dashboard = () => {
    const user = useSelector((state) => state.auth.userData);
    const [inputQuery, setInputQuery] = useState('');
    console.log(user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!user || !user?.status) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <section>
            <div>
                <div className='profile'>
                    <div>
                        <Profile username={user?.data?.username} />
                    </div>
                    <Button
                        onClick={() => dispatch(logout())}
                    >
                        Logout
                    </Button>
                </div>
                <div>
                    <Input
                        onChange={(e) => setInputQuery(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <FormSubmit inputQuery={inputQuery} />
            </div>
        </section>
    );
}

export default Dashboard;
