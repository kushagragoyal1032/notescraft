import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import NoteContext from "../context/notes/NoteContext";

const Signup = (props) => {
  const context = useContext(NoteContext);
  const {showAlert} = context;
    const [credentials, setCredentials] = useState({name: "", email: "", password: "", cpassword: ""});
    let navigate = useNavigate(); // use-history replaces with use-navigate
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await fetch(`http://localhost:3030/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name: credentials.name, email: credentials.email, password: credentials.password}),
      });
      const json = await response.json();
      console.log(json);
      if(json.success){
          // save auth token and redirect
          localStorage.setItem('token', json.authtoken);
          navigate("/");
          showAlert("Account Created Successfully!!", "success");
      }
      else {
        showAlert("Invalid Details!!", "danger");
      }
    }
  
    const onChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value }); // don't know 
    }
      
  return (
    <div className='container'>
    <h2 className="my-3">Signup to Continue..</h2>
    <form onSubmit={handleSubmit}>
    <div className="mb-3">
    <label htmlFor="name" className="form-label">Name</label>
    <input type="text" className="form-control" id="name" name="name" value={credentials.name} onChange={onChange} minLength={3} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange} required/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
    <input type="password" className="form-control" id="cpassword" name="cpassword" value={credentials.cpassword} onChange={onChange} minLength={5} required/>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Signup
