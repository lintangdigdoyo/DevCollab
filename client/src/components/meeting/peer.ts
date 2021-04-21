import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';
import { UserType } from '../../actions/authTypes';

//Function to create a new peer
export const createPeer = (
  socketRef: React.MutableRefObject<Socket | undefined>,
  userToSignal: string,
  callerId: string,
  stream: MediaStream
) => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
        {
          url: 'turn:numb.viagenie.ca',
          username: 'webrtc@live.com',
          credential: 'muazkh',
        },
      ],
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
  user?: UserType
) => {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
        {
          url: 'turn:numb.viagenie.ca',
          username: 'webrtc@live.com',
          credential: 'muazkh',
        },
      ],
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
  stream: MediaStream
) => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
      ],
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
  user?: UserType
) => {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
      ],
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
