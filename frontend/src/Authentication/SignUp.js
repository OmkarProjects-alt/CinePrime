import React, { useState , useRef } from 'react';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {auth , createUserWithEmailAndPassword} from './firebase'
import {FaEnvelope } from 'react-icons/fa'
import '../Style/SignUp.css'

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();



  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input automatically
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  async function handleVerify() {
    const fullOtp = otp.join("");
     try{
        const res = await fetch("http://localhost:5000/api/verifyOtp" , {
         method : 'POST',
         credentials : 'include',
         headers : {'Content-Type' : 'application/json'},
         body:JSON.stringify({email , otp : fullOtp})
        })

        const data = await res.json()
        if(res.ok && data.verified){
          createUserWithEmailAndPassword(auth , email , password)
          navigate('/')
        }else {
         throw new Error ("OTP verification failed: " + (data.Error || "Invalid OTP"));
        }
     }catch(err){
         console.error(err)
     }
  }

  async function handleReSendOTP() {
    try {
      setError('');
      setLoading(true);
      const result = await signup(email, password);
      
      if (result.status === 'email_sent') {
        setEmailSent(true);
      }
    } catch (err) {
      setError('Failed to create an account: ' + err.message);
    } finally {
      setLoading(false);
    }
  }


  async function handleSubmit(e) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords is not match , Please Reacheak Your Enterd Password');
    }

    try {
      setError('');
      setLoading(true);
      const result = await signup(email, password);
      
      if (result.status === 'email_sent') {
        setEmailSent(true);
      }
    } catch (err) {
      setError('Failed to create an account: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div>
        <p className='text-dark mb-3 my-3 fw-mediam' >Enter OTP</p>
      <div className='justify-content-center' style={{ display: "flex", gap: "10px" }}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{ width: "40px", fontSize: "20px", textAlign: "center" }}
          />
        ))}
      </div>
      <div className= ' d-flex justify-content-between'>
        <button onClick={handleVerify} className='btn btn-dark' style={{ marginTop: "20px" }}>
          Verify OTP
        </button>
        <button onClick={handleReSendOTP} className='btn btn-primary mt-3'>
          <span class={`${loading ? 'spinner-border spinner-border-sm' : ''}`} role="status" aria-hidden="true">{!loading ? 'Re Send' : ''}</span>
          {!loading ? '' : 'Sending OTP...'}
        </button>
      </div>
    </div>
    );
  }

  return (
    <div className="auth-container ">
      <div className="auth-card card shadow p-4  ">
        <div className='d-flex justify-content-center '>
        <FaEnvelope className='' style={{ marginRight: '10px', fontSize: '20px' }}/>
        <p>Sign In With Email</p>
        </div>
        {error && <div className="error-alert text-center">{error}</div>}
        <form onSubmit={handleSubmit} id="loginForm">
          <div className="mb-3">
              <label className='form-label '>Email</label>
            <div className='col-10'>
              <input
                className='form-control'
                id="staticEmail"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>
          <div className="mb-3 ">
              <label className='form-label'>Password</label>
            <div className='col-10'>
            <input 
              className='form-control'
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            </div>
          </div>
          <div className="mb-3">
            <label className='form-label'>Confirm Password</label>
            <div className='col-10'>
            <input 
              className='form-control'
              type="password"
              id='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
            </div>
          </div>
          <button
            type="submit"
            className="auth-button "
            disabled={loading}
          >
              <span class={`${loading ? 'spinner-border spinner-border-sm' : ''}`} role="status" aria-hidden="true">{!loading ? 'Sign up' : ''}</span>
            {!loading ? '' : 'Sending OTP...'}
          </button>
        </form>
        <div className="auth-footer my-4">
          Already have an account? <Link to='/login'>Login</Link>
        </div>
      </div>
    </div>
  );
}