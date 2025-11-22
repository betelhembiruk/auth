import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  axios.defaults.withCredentials = true;


const sendVerifyOtp = async () => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/api/auth/send-verify-otp`,
      { email: userData.email },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );

    if (data.success) {
      toast.success('Verification email sent.');
      navigate('/email-verify');
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

 
  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 ">
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {userData ? (
        <div className="relative">
          {/* User circle */}
          <div
            className="w-10 h-10 flex justify-center items-center rounded-full bg-black text-white font-medium cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {userData.name[0].toUpperCase()}
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50">
              <ul className="p-2 text-sm">
                {!userData.isAccountVerified && (
                  <li
                    onClick={() => {
                      sendVerifyOtp();
                      setDropdownOpen(false);
                    }}
                    className="py-2 px-3 hover:bg-gray-200 cursor-pointer rounded"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="py-2 px-3 hover:bg-gray-200 cursor-pointer rounded"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="arrow" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
