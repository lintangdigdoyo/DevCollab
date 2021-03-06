import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';
import { UserType } from '../../actions/authTypes';

//Function to create a new peer
export const createPeer = (
  socketRef: React.MutableRefObject<Socket | undefined>,
  userToSignal: string,
  callerId: string,
  stream: MediaStream,
  iceServers: any[]
) => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
    config: {
      iceServers: iceServers,
    },
  });

  peer.on('signal', (signal) => {
    //sending offer
    socketRef.current?.emit('sending signal', {
      userToSignal,
      callerId,
      signal,
    });
  });

  return peer;
};

//Function to add a peer
export const addPeer = (
  incomingSignal: string,
  callerId: string,
  stream: MediaStream,
  socketRef: React.MutableRefObject<Socket | undefined>,
  iceServers: any[],
  user?: UserType
) => {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream,
    config: {
      iceServers: iceServers,
    },
  });

  peer.on('signal', (signal) => {
    socketRef.current?.emit('returning signal', {
      signal,
      callerId,
      userId: user?._id,
    });
  });

  peer.signal(incomingSignal);

  return peer;
};

//Function to create share screen peer
export const createPeerScreen = (
  socketRef: React.MutableRefObject<Socket | undefined>,
  userToSignal: string,
  callerId: string,
  stream: MediaStream,
  iceServers: any[]
) => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
    config: {
      iceServers: iceServers,
    },
  });

  peer.on('signal', (signal) => {
    //sending offer
    socketRef.current?.emit('sending signal screen', {
      userToSignal,
      callerId,
      signal,
    });
  });

  return peer;
};

//Function to add share screen peer
export const addPeerScreen = (
  incomingSignal: string,
  callerId: string,
  socketRef: React.MutableRefObject<Socket | undefined>,
  iceServers: any[],
  user?: UserType
) => {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    config: {
      iceServers: iceServers,
    },
  });

  peer.on('signal', (signal) => {
    socketRef.current?.emit('returning screen signal', {
      signal,
      callerId,
      userId: user?._id,
    });
  });

  peer.signal(incomingSignal);

  return peer;
};
