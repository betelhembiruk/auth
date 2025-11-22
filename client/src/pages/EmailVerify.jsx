import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';

const EmailVerify = () => {
    const { backendUrl, getUserData } = useContext(AppContext);
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    axios.defaults.withCredentials = true;

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData("Text").slice(0,6);
        pasteData.split("").forEach((char, idx) => {
            if (inputRefs.current[idx]) inputRefs.current[idx].value = char;
        });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const otp = inputRefs.current.map(i => i.value).join('');
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });
            if (data.success) {
                toast.success(data.message);
                await getUserData();
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Error verifying OTP');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
            <img
                onClick={() => navigate('/')}
                src={assets.logo}
                alt=""
                className="absolute left-5 sm:left-20 top-5 sm:w-32 cursor-pointer"
            />
            <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
                <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email</p>

                <div className="flex justify-between mb-8" onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            required
                            className="w-12 h-12 bg-[#333A5c] text-white text-center text-xl rounded-md"
                            ref={el => inputRefs.current[index] = el}
                            onInput={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-full transition-all">
                    Verify Email
                </button>
            </form>
        </div>
    );
};

export default EmailVerify;
