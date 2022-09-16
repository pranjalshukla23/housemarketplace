import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {db} from '../firebase.config'
import {doc,setDoc,serverTimestamp} from 'firebase/firestore'
import OAuth from '../components/OAuth';

function SignUp(){

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const {email,password,name} = formData


  //useNavigate hook is used for redirection
  const navigate = useNavigate()


  const onChange = (e) =>{

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onSubmit = async(e) =>{

    e.preventDefault()

    try{
      const auth = getAuth()

      //register user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      //get user info
      const user = userCredential.user

      //update the profile in firebase
      await updateProfile(auth.currentUser, {
        displayName: name
      })

      const formDataCopy = {...formData}

      //delete password property
      delete formDataCopy.password
      //set timestamp property
      formDataCopy.timestamp = serverTimestamp()

      //add data to database in users collection
      await setDoc(doc(db,'users',user.uid),formDataCopy)


      navigate('/')

    }catch(err){

      toast.error('Something went wrong with registration')
    }
  }

  return(
      <>
        <div className="pageContainer">
          <header>
            <p className="pageHeader">
              Welcome Back!
            </p>
          </header>
          <main>
            <form onSubmit={onSubmit}>
              <input type="text" className="nameInput" placeholder="Name" id="name" value={name} onChange={onChange}/>
              <input type="email" className="emailInput" placeholder="Email" id="email" value={email} onChange={onChange}/>
              <div className="passwordInputDiv">
                <input type={showPassword ? 'text' : 'password'} className="passwordInput" placeholder="Password" id="password" value={password} onChange={onChange}/>
                <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPassword((prevState) => !prevState)}/>
              </div>
              <Link to='/forgot-password' className="forgotPasswordLink">
                Forgot Password
              </Link>
              <div className="signUpBar">
                <p className="signUpText">
                  Sign Up
                </p>
                <button className="signUpButton">
                  <ArrowRightIcon fill='#fff' width='34px' height='34px' />
                </button>
              </div>
            </form>

            <OAuth />
            <Link to="/sign-in" className="registerLink">
              Sign In Instead
            </Link>
          </main>
        </div>
      </>
  )
}

export default SignUp
