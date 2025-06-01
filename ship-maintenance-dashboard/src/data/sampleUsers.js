// Sample users data including admin and engineers
const sampleUsers = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@entnt.in',
    role: 'Admin',
    password: 'admin123' // In a real app, this would be hashed
  },
  {
    id: 'e1',
    name: 'Inspector',
    email: 'inspector@entnt.in',
    role: 'Inspector',
    specialization: 'Quality Control',
    certification: 'Marine Inspector',
    experience: '10 years',
    password: 'inspect123'
  },
  {
    id: 'e2',
    name: 'Engineer',
    email: 'engineer@entnt.in',
    role: 'Engineer',
    specialization: 'Marine Systems',
    certification: 'Marine Engineer',
    experience: '8 years',
    password: 'engine123'
  }
];

// Function to initialize sample users in localStorage
export const initializeSampleUsers = () => {
  const existingUsers = localStorage.getItem('users');
  if (!existingUsers) {
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
};

export default sampleUsers; 