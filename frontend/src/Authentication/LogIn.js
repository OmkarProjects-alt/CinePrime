import React , {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../Style/SignIn.css'
import {Link} from 'react-router-dom'

export default function LogIn() {

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { login } = useAuth();


    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            setLoading(true)
            setError('')
            const data = await login(email , password)
            if(data.user){
                console.log("Login successful")
                navigate('/')
            }else{
                console.error("Login failed")
                setError("Login failed")
            }
        }catch(err){
            console.error("Login error:", err)
            setError(err.message || "Login failed" || error)
        }finally{
            setLoading(false)
        }
    }

  return (
      <>
       <div className='Sign'></div>
        <div className='container  rounded-3 position-absolute w-25  h-50 start-50 top-50 translate-middle' style={{width:'30vmin'}}>
        <div className='card shadow p-4'>
            <h2 className='text-center'>Log In</h2>
            <div className='d-flex '>

                <form onSubmit={handleSubmit} id="loginForm" className='my-5'>
                <div className="mb-3">
                    <label className='form-label '>Email</label>
                    <div className='input'>
                    <input
                        className='form-control w-100'
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
                    <div className='input'>
                    <input 
                    className='form-control w-100'
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    />
                    </div>
                </div>
                <div className='d-flex justify-content-between'>
                    <button
                        type="submit"
                        className="auth-button btn btn-primary my-3"
                        disabled={loading}
                    >
                        <span class={`${loading ? 'spinner-border spinner-border-sm' : ''}`} role="status" aria-hidden="true">{!loading ? 'Log In' : ''}</span>
                        {!loading ? '' : 'Loading...'}
                    </button>
                    <Link className='btn btn-primary my-3' to='/forgotpassword'>Forgot Password</Link>
                </div>
                </form>
            </div>
        </div>
      </div>
    </>
  )
}
