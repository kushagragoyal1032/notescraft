import React, { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/notes/NoteContext";
import Noteitem from "./Noteitem";
import Addnote from "./Addnote";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const context = useContext(NoteContext);
  let navigate = useNavigate(); // use-history replaces with use-navigate
  const { notes, getNotes, editNote, showAlert} = context; // destructuring    // this coming from NoteState where we have all notes

  useEffect(() => {
    if(localStorage.getItem("token")) {
      getNotes();
    }
    else {
      console.log(navigate('/login'));
      navigate('/login');
    }
    // eslint-disable-next-line
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);
  const [note, setNote] = useState({eid:"", etitle: "", edescription: "", etag: "" });

  const updateNote = (currentnote) => {
    ref.current.click();
    setNote({
      eid: currentnote._id,
      etitle: currentnote.title,
      edescription: currentnote.description,
      etag: currentnote.tag,
    }); // now note have all previously added field
  };

  const handleclick = (e) => {
    console.log("updateNote", note);
    editNote(note.eid, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    showAlert("Updated Successfully!!", "success");
  };

  const onChange = (e) => setNote({ ...note, [e.target.name]: e.target.value });

  return (
    <>
    <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Update Note
    </button>

    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <form>
      <div className="mb-3">
          <label htmlFor="etitle" className="form-label">Title</label>
          <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onChange} minLength={5} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="edescription" className="form-label" autoComplete="on">Description</label>
          <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required/>
        </div>
        <div className="mb-3">
            <label htmlFor="etag" className="form-label">Tag</label>
            <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} minLength={5} required/>
        </div>
      </form>
      </div>
      <div className="modal-footer">
        <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" disabled={note.etitle.length<5 || note.edescription.length<5} className="btn btn-primary" onClick={handleclick} >Update Changes</button>
      </div>
    </div>
  </div>
    </div>
      <Addnote />
      <div className="row my-3">
        <h1>Your Notes</h1>
        <div className="container my-3">
            <h3>
            {notes.length===0 && 'No notes are available...'}
            </h3>
        </div>
        {notes.map((note) => {
          return (
            <Noteitem key={note._id} updateNote={updateNote} note={note} />
          );
        })}
      </div>
    </>
  );
};

export default Notes;
