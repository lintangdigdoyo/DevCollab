import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';

import User from '../models/User';
import cloudinary from '../config/cloudinaryConfig';
import Project from '../models/Project';

//Get signed in user data
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user)
      .select('-password')
      .select('-date')
      .select('-__v');

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

//Edit signed in user data
export const editUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      currentPassword,
      newPassword,
      confirmNewPassowrd,
      email,
    } = req.body;

    if (newPassword && newPassword.length < 8) {
      return res.status(400).json({
        errors: [
          { msg: 'Please enter the new password with 8 or more characters' },
        ],
      });
    }

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    //Edit user data
    if (typeof firstName !== 'undefined') user.firstName = firstName.trim();
    if (typeof lastName !== 'undefined') user.lastName = lastName.trim();
    if (typeof email !== 'undefined' && email !== user.email) {
      const users = await User.findOne({ email });
      if (users && email !== user.email) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email already in use' }] });
      }
      user.email = email;

      //Delete googleid if user change email
      if (user.googleId) user.googleId = '';
    }

    //Add avatar
    if (req.file) {
      //Delete old image in the cloudinary cloud
      cloudinary.uploader.destroy(user.avatar?.publicId ?? '');

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatar',
      });
      user.avatar!.url = result?.secure_url ?? '';
      user.avatar!.publicId = result?.public_id ?? '';
      await user.save();

      //Delete image in the upload folder
      await fs.unlink(req.file.path);
    }

    if (newPassword) {
      //Check if password match
      if (newPassword !== confirmNewPassowrd) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Password not match' }] });
      }

      //Check if the password is correct or not
      if (user.havePassword) {
        let isMatch = false;
        if (user.password) {
          isMatch = await bcrypt.compare(currentPassword, user.password);
        }

        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Current password invalid' }] });
        }
      }

      user.password = newPassword;
      user.havePassword = true;
    }

    await user.save();
    const updatedUser = await User.findById(req.user)
      .select('-password')
      .select('-date')
      .select('-__v');

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

//Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user);
    const projects = await Project.find({
      members: { $elemMatch: { user: req.user } },
    });

    //Delete user from projects member
    for (const project of projects) {
      const updatedProject = project.members.filter(
        (member) => member.user?.toString() !== req.user
      );
      project.members = updatedProject;
      await project.save();
    }

    await user?.delete();
    res.status(200).clearCookie('access_token').json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
