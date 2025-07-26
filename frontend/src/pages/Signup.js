import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaUserPlus, FaHome } from 'react-icons/fa';
import '../styles/Auth.css';

function Signup({ darkMode }) {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        contact: '',
        location: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, contact, location, password } = signupInfo;

        if (!name || !email || !password) {
            return handleError('Name, email and password are required');
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('contact', contact);
            formData.append('location', location);
            formData.append('password', password);

            const response = await fetch(' http://localhost:5000/auth/signup', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                handleSuccess(result.message);
                setTimeout(() => navigate('/login'), 1500);
            } else if (result.error) {
                const details = result.error?.details?.[0]?.message;
                handleError(details || result.message);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`auth-page ${darkMode ? 'dark' : ''}`}>
            <div className='auth-container'>
                <div className="auth-header">
                    <h1><FaUserPlus className="auth-icon" /> Sign Up</h1>
                    <p>Create your AgriRental account</p>
                </div>
                
                <form className='auth-form' onSubmit={handleSignup}>
                    <div className='form-group'>
                        <label htmlFor='name'>
                            <FaUser className="input-icon" /> Name
                        </label>
                        <input
                            onChange={handleChange}
                            type='text'
                            name='name'
                            placeholder='Enter your full name'
                            value={signupInfo.name}
                            required
                            autoFocus
                        />
                    </div>
                    
                    <div className='form-group'>
                        <label htmlFor='email'>
                            <FaEnvelope className="input-icon" /> Email
                        </label>
                        <input
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email'
                            value={signupInfo.email}
                            required
                        />
                    </div>
                    
                    <div className='form-group'>
                        <label htmlFor='contact'>
                            <FaPhone className="input-icon" /> Contact
                        </label>
                        <input
                            onChange={handleChange}
                            type='text'
                            name='contact'
                            placeholder='Enter your phone number'
                            value={signupInfo.contact}
                        />
                    </div>
                    
                    <div className='form-group'>
                        <label htmlFor='location'>
                            <FaMapMarkerAlt className="input-icon" /> Location
                        </label>
                        <input
                            onChange={handleChange}
                            type='text'
                            name='location'
                            placeholder='Enter your location'
                            value={signupInfo.location}
                        />
                    </div>
                    
                    <div className='form-group'>
                        <label htmlFor='password'>
                            <FaLock className="input-icon" /> Password
                        </label>
                        <input
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Create a password'
                            value={signupInfo.password}
                            required
                        />
                    </div>
                    
                    <button 
                        type='submit' 
                        className='submit-btn'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Sign Up'}
                    </button>
                    
                    <div className='auth-links'>
                        <Link to="/login" className="auth-link">
                            Already have an account? Login
                        </Link>
                        <Link to="/" className="auth-link">
                            <FaHome /> Back to home
                        </Link>
                    </div>
                </form>
                <ToastContainer position="bottom-right" theme={darkMode ? 'dark' : 'light'} />
            </div>
        </div>
    );
}

export default Signup;