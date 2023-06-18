import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import NoteContext from "../context/notes/NoteContext";

const Login = (props) => {
  const context = useContext(NoteContext);
  const {showAlert} = context;
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate(); // use-history replaces with use-navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3030/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password}),
    });
    const json = await response.json();
    console.log(json);
    if(json.success){
        // save auth token and redirect
        localStorage.setItem('token', json.authtoken);
        navigate("/");
        showAlert("Loggedin Successfully!!", "success");
    }
    else {
      showAlert("Invalid Credentials!!", "danger");

    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value }); // don't know 
  }

  return (
    <div className="container">
      <h2 className="my-3">Login to Continue..</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 ">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            aria-describedby="emailHelp"
            value={credentials.email}
            onChange={onChange}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            autoComplete="on"
            value={credentials.password}
            onChange={onChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
