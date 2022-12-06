import React,{ useState } from 'react'
import { useNavigate } from "react-router-dom";
import Util from '../Util';

function Auth() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  const handleUsername= (e) => {
    setUsername(e.target.value)
  }
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleSubmit = (e) => { 
    e.preventDefault()
    console.log(username, password)
    if (username === 'blastx' && password ==='!innovation') {
      document.cookie = "authorized=true"
      navigate('/', { state: { authorized: true } })
    } else { 
      console.log(username, password,'false')
      // window.location.reload()
    }
  }
  return (
    <div className="mt-16 text-center">
      <h1 className="text-xxl">Please login</h1>
    
      <form className="mt-8" onSubmit={handleSubmit}>
        <label htmlFor='text'>
          Username
        </label>
        <br />
      
        <input 
         id='username' 
         type='username' 
         placeholder='Username' 
         onChange={handleUsername} 
         className="border"
         value={username}
        />
        <br />
        <label htmlFor='password'> 
          Password
        </label>
        <br />
        <input 
         id='password' 
         type='password' 
         placeholder='Password' 
         onChange={handlePassword} 
         className="border"
         value={password} 
        />
        <br />
        <br />
        <button className="border px-4 py-2" type='submit'>Login</button>
      </form>
    </div>
  )
}
export default Auth