import React , { useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
// import Loading from './Loading';


export default function ForgotPassword() {

    const [email , setEmail] = useState('')
    const [error , setError] = useState('')
    const { resetPassword } = useAuth();
    const [loading , setLoading] = useState(false)
    const [show ,setShow] = useState(false)

    const handleForgotPassword = async(e) => {
      e.preventDefault()
      
      try{
        setLoading(true)
        setError('')
        const data = await resetPassword(email)
        if(!data.ok || !data){
            throw new Error ("Somthing Wrong")
        }
        setShow(true)
        console.log('Password reset email sent successfully ');
      }catch(err){
          console.error(err.message || "Faild" || error)
          setError(err)
      }finally{
        setLoading(false)
      }

    }

  return (
    <div className='position-absolute top-50 start-50  translate-middle rounded'>
      <div className='shadow p-5'>
        <h3 className='text-dark text-center'>Forgot Password</h3>
        <div className=''>
            <form onSubmit={handleForgotPassword}  className='my-3'>
                 <div>
                    <label htmlFor="Email" className='form-label text-dark'>Email</label>
                    <div className='input'>
                       <input type="email" className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                 </div>
                 <div className='d-flex justify-content-between mt-3'>
                    <button type='submit' className='btn btn-primary'>
                        <span class={`${loading ? 'spinner-border spinner-border-sm' : ''}`} role="status" aria-hidden="true">{!loading ? 'Send' : ''}</span>
                         {!loading ? '' : 'Sending...'}
                    </button>
                    <div className=' justify-content-md-end'>
                        <Link to='/login' className='btn btn-primary'>Back To Login</Link>
                    </div>
                 </div>
                   <p className={`text-center text-dark block ${show ? 'd-block' : 'd-none'} my-3`}>Your Request is Sended to your mail Box </p>
            </form>
        </div>
      </div>
    </div>
  )
}
