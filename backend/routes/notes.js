const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");

// ROUTE:1 Get all notes: GET "/api/notes/fetchallnotes" - login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!!");
  }
});

// ROUTE:2 Add new notes: POST "/api/notes/addnote" - login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid name").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters.. ").isLength(
      {
        min: 5,
      }
    ),
  ],
  async (req, res) => {
    try {
      // if there are errors here then it return bad request and errors
      const { title, description, tag } = req.body; // here we are using "destructuring"
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({ title, description, tag, user: req.user.id });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error!!");
    }
  }
);

// ROUTE:3 update an exisiting note : put "/api/notes/updatenote" - login required
router.put(
  "/updatenote/:id",
  fetchuser,
  [
    body("title", "Enter a valid name").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters.. ").isLength(
      {
        min: 5,
      }
    ),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body; // here we are using "destructuring"
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      // find which note to update and update
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found!!");
      }
      //   allow updation only if use owns this note
      if (note.user.toString() !== req.user.id) {     // need to clear more
        // not clear to me !important
        return res.status(401).send("Not Allowd!!");
      }

      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json(note);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error!!");
    }
  }
);

// ROUTE:4 delete an exisiting note : DELETE "/api/notes/deletenote" - login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body; // here we are using "destructuring"

    // find which note to update and update
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found!!");
    }
    // allow deletion only if use owns this note
    if (note.user.toString() !== req.user.id) {
      // not clear to me !important
      return res.status(401).send("Not Allowd!!");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted..", note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!!");
  }
});

module.exports = router;
