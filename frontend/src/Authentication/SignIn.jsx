import React ,{useState , useEffect} from 'react';
import { signInWithPopup, GoogleAuthProvider , FacebookAuthProvider } from 'firebase/auth';
import { auth, googleProvider , facebookProvider } from './firebase';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import '../Style/SignIn.css'; 
import Loading from './Loading'
import SignUp from '../Authentication/SignUp';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ onSuccess, onError }) => {
  const [Gloading, setGLoading] = useState(false);
  const [Floading , setFLoading] = useState(false);
  const navigate = useNavigate();


  const handleFacebookSignIn = async () => {
       try{
        setFLoading(true)
        const result = await signInWithPopup(auth , facebookProvider);
        const credential = FacebookAuthProvider.credentialFromResult(result)
        const token = credential.accessToken;
        const user = result.user;

        if(onSuccess){
          onSuccess({
            user,
            token,
            provider: 'facebook'
          });
        }
        navigate('/')
       }catch(error){
        console.error("FaceBook Sign In Faild:" , error)

        if(onError){
          onError({
            code: error.code,
            message: error.message,
            email: error.customData?.email,
            credential: FacebookAuthProvider.credentialFromError(error)
          })
        }
       }finally{
        setFLoading(false)
       }
  }


  const handleGoogleSignIn = async () => {
    try {
      setGLoading(true)
      const result = await signInWithPopup(auth, googleProvider);
      // This gives you a Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      
      if (onSuccess) {
        onSuccess({
          user,
          token,
          provider: 'google'
        });
      }
      navigate('/')
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      if (onError) {
        onError({
          code: error.code,
          message: error.message,
          email: error.customData?.email,
          credential: GoogleAuthProvider.credentialFromError(error)
        });
      }
    }
    finally {
      setGLoading(false)
    }
  };

  return (
    <>
      <div className='Sign'></div>
        <div className='container d-flex justify-content-center align-items-center Sing-Container'>
          <div className='Border position-absolute top-50 start-50 translate-middle   '>
            <div className='p-5'>
              <button onClick={handleFacebookSignIn} className="signin-button">
                  {Floading ? (
                    <Loading/>
                  ): (
                    <>
                      <FaFacebook style={{ marginRight: '10px', fontSize: '20px' }}/>
                      Sign in with Facebook
                    </>
                  )}
              </button>
              <button onClick={handleGoogleSignIn} className="signin-button">
                {Gloading ? (
                  <Loading/>
                ) : (
                  <>
                    <FcGoogle style={{ marginRight: '10px', fontSize: '20px' }} />
                    Sign in with Google
                  </>
                )}
              </button>
              <SignUp/>
            </div>
          </div>
        </div>
    </>
  );
};

export default SignIn;