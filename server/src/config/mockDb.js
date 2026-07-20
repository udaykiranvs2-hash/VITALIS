// Mock user database for development (without MongoDB)
let mockUsers = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    passwordHash: '$2b$10$NwrZlb/vYqG5gfcRFCdrMOoaYP2Ffsc0A7twme/P6Zn02Va2RsUoi', // bcrypt hash of 'demo123'
    profile: { fullName: 'Demo User' },
    role: 'user',
    reports: [],
    appointments: [],
    notifications: [],
    history: []
  }
];

export const getMockUserByEmail = (email) => {
  return mockUsers.find(u => u.email === email);
};

export const createMockUser = (user) => {
  const newUser = {
    id: Date.now().toString(),
    ...user,
    reports: [],
    appointments: [],
    notifications: [],
    history: []
  };
  mockUsers.push(newUser);
  return newUser;
};

export const updateMockUser = (id, updates) => {
  const index = mockUsers.findIndex(u => u.id === id);
  if (index > -1) {
    mockUsers[index] = { ...mockUsers[index], ...updates };
    return mockUsers[index];
  }
  return null;
};

export const getMockUserById = (id) => {
  return mockUsers.find(u => u.id === id);
};

export const getAllMockUsers = () => {
  return mockUsers;
};
