import { io, Socket } from 'socket.io-client';
import { AppActions, AppState } from './state';

export const socketIOUrl = `http://${import.meta.env.VITE_API_HOST}:${
  import.meta.env.VITE_API_PORT
}/${import.meta.env.VITE_POLLS_NAMESPACE}`;

type CreateSocketOptions = {
  socketIOUrl: string;
  state: AppState;
  actions: AppActions;
};

export const createSocketWithHandlers = ({
  socketIOUrl,
  state,
  actions,
}: CreateSocketOptions): Socket => {
  console.log(`Creating socket with accessToken: ${state.accessToken}`);
  
  const socket = io(socketIOUrl, {
    auth: {
      token: state.accessToken,
    },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log(`Connected with socket ID: ${socket.id}`);

    
    if (state.accessToken) {
      socket.emit('join_by_token', { token: state.accessToken }, (poll: any | null) => {
        if (poll) {
          console.log('Rejoined poll successfully', poll);
          actions.initializePoll(poll);
        } else {
          console.log('Invalid token or poll not found. Cleaning and Starting over.');
          state.accessToken = undefined;
          localStorage.removeItem('accessToken');
          actions.startOver();
        }
      });
    }

    actions.stopLoading();
  });

  socket.on('exception', (error) => {
    console.log('WS exception: ', error);
    actions.addWsError(error);
  });

  socket.on('poll_updated', (poll) => {
    if (poll) {
      console.log('event: "poll_updated" received', poll);
      actions.updatePoll(poll);
    } else {
      console.log('Received null poll. Cleaning up and starting over.');
      state.accessToken = undefined;
      localStorage.removeItem('accessToken');
      actions.startOver();
    }
  });

  socket.on('poll_cancelled', ({ pollId }) => {

    console.log(`Poll ${pollId} was cancelled`);
    const tokenKey = `accessToken:${pollId}`;
    localStorage.removeItem(tokenKey);

    actions.startOver();
  });

  return socket;
};
