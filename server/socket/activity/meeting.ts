import { Server, Socket } from 'socket.io';

import Activity, { Avatar } from '../../models/Activity';
import User from '../../models/User';

export default (io: Server, socket: Socket) => {
  socket.on('create activity meeting', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      //Find users email
      const users = await User.find({ _id: { $in: data.membersId } });
      const usersEmail = users.map((user) => user.email);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.meeting,
          name: 'Meeting Room',
          message: `${data.userName} invited ${usersEmail.join(', ')} to ${
            data.roomName
          } meeting room`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('update activity meeting', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.meeting,
          name: 'Meeting Room',
          message: `${data.userName} updated ${data.roomName} meeting room`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('delete activity meeting', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.meeting,
          name: 'Meeting Room',
          message: `${data.userName} deleted ${data.roomName} meeting room`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });
};