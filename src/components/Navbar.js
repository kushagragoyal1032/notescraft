// import React, { useEffect } from 'react'
import React, {useContext} from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import NoteContext from '../context/notes/NoteContext';
import Alert from './Alert';

const Navbar = () => {
  const context = useContext(NoteContext);
  const navigate = useNavigate(); // use-history replaces with use-navigate
  const { alert } = context; // destructuring 

  const handlelogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  let location = useLocation(); // get the location
  // useEffect(() => {
  //   console.log(location.pathname);
  // }, [location]);
  return (
    <>
<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid">
    <Link className="navbar-brand" to="/">NotesCraft</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname==='/'? "active": ""}`} aria-current="page" to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname==='/about'? "active": ""}`} to="/about">About</Link>
        </li>
      </ul>
      {!localStorage.getItem('token')? <form className="d-flex">
      <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
      <Link className="btn btn-primary mx-1" to="/signup" role="button">Signup</Link>
      </form> : <Link className="btn btn-primary mx-1" onClick={handlelogout} role="button">Logout</Link>}
    </div>
  </div>
</nav>
<Alert alert={alert}/>
  </>

  )
}

export default Navbar
