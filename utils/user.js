let users = [];

exports.joinRoom = (id, name, room) => users.push({ id, name, room });

exports.leaveRoom = (id) => {
  users = users.filter((user) => user.id !== id);
};

exports.getRoomUsers = (room) => {
  console.log(users.filter((user) => user.room === room));
  return users.filter((user) => user.room === room);
};
