import { Socket } from 'socket.io';

import Task from '../../models/Task';

export default (socket: Socket) => {
  socket.on('move column', async (data) => {
    try {
      const task = await Task.findOne({ project: data.projectId });

      if (task) {
        task.columnOrder = data.columnOrder;

        const newColumnOrder = await (await task.save())
          .populate({
            path: 'tasks.$*.comments.user',
            select: ['firstName', 'lastName', 'avatar'],
          })
          .populate({
            path: 'tasks.$*.members.user',
            select: ['email', 'avatar'],
          })
          .execPopulate();
        //Send the data to client
        socket.to(data.projectId).emit('move column update', newColumnOrder);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
