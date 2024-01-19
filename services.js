const users = [
    { id: '1', name: 'riya singh', email: 'riya@gmail.com' },
    { id: '2', name: 'nandini varshney', email: 'nandini@gmail.com' },
];
 
const userService = {
    getAllUsers: () => {
        return users;
    },
 
    getUserById: (userId) => {
        return users.find(user => user.id === userId);
    },
 
};
 
module.exports = userService;