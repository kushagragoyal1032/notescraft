import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:3030";
  const initialnotes = [];
  const [notes, setNotes] = useState(initialnotes); // set the state
  const [alert, SetAlert] = useState(null);

  const showAlert = (message, type) => {
    SetAlert({
      msg: message,
      typ: type,
    });

    setTimeout(() => {
      SetAlert(null);
    }, 1500);
  };

  // fetch all notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth.token":
          localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };

  // Add note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth.token":
          localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();
    setNotes(notes.concat(note)); //concat return array
    console.log(note);
  };

  // Delete note
  const deleteNote = async (id) => {
    // API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth.token":
          localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    console.log(json);

    console.log("deleteing" + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    }); //filter require arraow func
    setNotes(newNotes);
  };

  // Edit note
  const editNote = async (id, title, description, tag) => {
    // API call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth.token":
          localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes)); //create a copy
    // logic to edit in clint
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    // here value={{}} means these states will be available as context api and we can use anywhere
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes, alert, showAlert }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
