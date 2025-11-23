// Mock database - In production, this would connect to a real database
let users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

const getAllUsers = async () => {
  // Simulate async database call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users);
    }, 10);
  });
};

const getUserById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find(u => u.id === id);
      resolve(user);
    }, 10);
  });
};

const createUser = async (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if email already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        reject(new Error('Email already exists'));
        return;
      }

      const newUser = {
        id: String(users.length + 1),
        ...userData,
        role: userData.role || 'user',
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      resolve(newUser);
    }, 10);
  });
};

const deleteUser = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 10);
  });
};

// For testing purposes - reset the users array
const resetUsers = () => {
  users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
  ];
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  resetUsers
};