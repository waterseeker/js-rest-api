//fake db
let users = {
    1: {
      id: '1',
      username: 'Some Person',
    },
    2: {
      id: '2',
      username: 'Somet Other Person',
    },
};
let messages = {
    1: {
      id: '1',
      text: 'This is a message.',
      userId: '1',
    },
    2: {
      id: '2',
      text: 'This is another message.',
      userId: '2',
    },
};

export default {
    users, 
    messages,
};