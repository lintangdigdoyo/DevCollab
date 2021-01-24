import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';
import { createProject, getProjects } from '../../controllers/project';

/**
 *  @route POST api/projects
 *  @desc Create new project
 *  @access Private
 */
router.post(
  '/',
  auth,
  check('name', 'Project name is required').notEmpty(),
  validateInput,
  createProject
);

/**
 *  @route GET api/projects
 *  @desc Get signed in user projects
 *  @access Private
 */
router.get('/', auth, getProjects);

export default router;
