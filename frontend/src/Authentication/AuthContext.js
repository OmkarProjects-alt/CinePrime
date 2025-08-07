import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth , signInWithEmailAndPassword , sendPasswordResetEmail , updateEmail , updatePassword , EmailAuthProvider , reauthenticateWithCredential} from './firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [emailLinkSent, setEmailLinkSent] = useState(false);


  async function signup(email) {
    try {
        if(email){
         const res = await fetch('http://localhost:5000/api/sendEmail' , {
            method: 'POST',
            credentials: 'include',
            headers:{
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({email})
         })
          if(!res.ok){
            const errorData = await res.json()
            console.error(errorData || "Failed to send email")
          }else{
            const data = await res.json()
            if(data.status === 'email_sent'){
              console.log("Email sent successfully")
            }
          }
          return ({status: 'email_sent'})
        }
    } catch (error) {
      throw error;
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return auth.signOut();
  }

 async function resetPassword(email) {
    try{
      await sendPasswordResetEmail(auth, email);
      return{ok : true}
    }catch(err){
      console.error("Error Sending password reset email . ", err)
      return {ok : false , error : err.message};
    }
  }

  function updateUserEmail(email) {
    return updateEmail(currentUser, email);
  }

  function updateUserPassword(password) {
    return updatePassword(currentUser, password);
  }

  function reauthenticate(password) {
    const credential = EmailAuthProvider.credential(
      currentUser.email, 
      password
    );
    return reauthenticateWithCredential(currentUser, credential);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    reauthenticate
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}