import { Request, Response } from 'express';

import Note from '../models/Note';
import { existNotReadOnly, userExist } from '../services/checkPermission';
import Project from '../models/Project';

//Get all notes
export const getNotes = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project can see notes
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const note = await Note.find({
      project: req.params.projectId,
    }).populate('user', ['firstName', 'lastName']);
    res.status(200).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Get a note
export const getNote = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project can see the note
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const note = await Note.findById(req.params.noteId);

    res.status(200).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Create a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and except user with ReadOnly access permission can create note
    const permission = existNotReadOnly(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const { title, contents } = req.body;

    const note = await Note.create({
      project: req.params.projectId,
      user: req.user?.toString() ?? '',
      title,
      contents,
    });

    const newNote = await note
      .populate({ path: 'user', select: ['firstName', 'lastName'] })
      .execPopulate();

    res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Update a note
export const updateNote = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and except user with ReadOnly access permission can update note
    const permission = existNotReadOnly(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const note = await Note.findById(req.params.noteId).populate('user', [
      'firstName',
      'lastName',
    ]);

    if (!note) {
      return res.json(404).json({ msg: 'Note not found' });
    }

    const { title, contents } = req.body;

    //update note
    if (typeof title !== 'undefined') note.title = title;
    if (typeof contents !== 'undefined') note.contents = contents;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Delete a note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and except user with ReadOnly access permission can delete note
    const permission = existNotReadOnly(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    note.delete();

    res.status(200).json({ msg: 'Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
