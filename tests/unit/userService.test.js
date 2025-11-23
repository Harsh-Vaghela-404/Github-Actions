const userService = require('../../src/services/userService');

describe('UserService - Unit Tests', () => {
  beforeEach(() => {
    // Reset users before each test
    userService.resetUsers();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = await userService.getAllUsers();
      
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(3);
    });

    it('should return users with correct properties', async () => {
      const users = await userService.getAllUsers();
      
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('email');
      expect(users[0]).toHaveProperty('role');
    });
  });

  describe('getUserById', () => {
    it('should return user when valid id is provided', async () => {
      const user = await userService.getUserById('1');
      
      expect(user).toBeDefined();
      expect(user.id).toBe('1');
      expect(user.name).toBe('John Doe');
    });

    it('should return undefined when user not found', async () => {
      const user = await userService.getUserById('999');
      
      expect(user).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const newUserData = {
        name: 'Test User',
        email: 'test@example.com'
      };

      const newUser = await userService.createUser(newUserData);
      
      expect(newUser).toBeDefined();
      expect(newUser.id).toBeDefined();
      expect(newUser.name).toBe('Test User');
      expect(newUser.email).toBe('test@example.com');
      expect(newUser.role).toBe('user'); // default role
    });

    it('should assign custom role when provided', async () => {
      const newUserData = {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      };

      const newUser = await userService.createUser(newUserData);
      
      expect(newUser.role).toBe('admin');
    });

    it('should throw error when email already exists', async () => {
      const duplicateUserData = {
        name: 'Duplicate',
        email: 'john@example.com' // Already exists
      };

      await expect(userService.createUser(duplicateUserData))
        .rejects
        .toThrow('Email already exists');
    });

    it('should include createdAt timestamp', async () => {
      const newUserData = {
        name: 'Test User',
        email: 'timestamp@example.com'
      };

      const newUser = await userService.createUser(newUserData);
      
      expect(newUser.createdAt).toBeDefined();
      expect(new Date(newUser.createdAt)).toBeInstanceOf(Date);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const result = await userService.deleteUser('1');
      
      expect(result).toBe(true);
      
      const deletedUser = await userService.getUserById('1');
      expect(deletedUser).toBeUndefined();
    });

    it('should return false when user not found', async () => {
      const result = await userService.deleteUser('999');
      
      expect(result).toBe(false);
    });
  });
});