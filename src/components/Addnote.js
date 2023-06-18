import React, { useState, useContext } from "react";
import NoteContext from "../context/notes/NoteContext";

const Addnote = (props) => {
  const context = useContext(NoteContext);
  const { addNote, showAlert } = context; // destructuring   // here addNote is function in NoteState

  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: ""
  });

  const handleclick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({title: "", description: "", tag: ""})
    showAlert("Added Successfully!!", "success");
  };
  const onChange = (e) => setNote({ ...note, [e.target.name]: e.target.value });

  return (
    <div className="container my-3">
      <h1>Add a Note</h1>
      <form>
      <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="title" name="title" value={note.title} onChange={onChange} minLength={5} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label" autoComplete="on">Description</label>
          <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required/>
        </div>
        <div className="mb-3">
            <label htmlFor="tag" className="form-label">Tag</label>
            <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} minLength={5} required/>
        </div>
        <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleclick}>Add Note</button>
      </form>
    </div>
  );
};

export default Addnote;
