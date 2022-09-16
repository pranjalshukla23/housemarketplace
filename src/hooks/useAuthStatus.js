import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {useState, useEffect, useRef} from 'react'

//custom hook
export const useAuthStatus = () =>{

  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const isMounted = useRef(true)

  useEffect(() =>{

    if(isMounted){
      const auth = getAuth()

      //check sign-in status change of user
      onAuthStateChanged(auth,(user)=>{

        //if logged in
        if(user){

          //set login status
          setLoggedIn(true)
        }

        //set checking status
        setCheckingStatus(false)
      })
    }

    return () => {
      isMounted.current = false
    }

  },[isMounted])
  return {loggedIn, checkingStatus}
}
