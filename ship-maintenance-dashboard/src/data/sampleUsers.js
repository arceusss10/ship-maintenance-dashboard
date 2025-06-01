// Sample users data including admin and engineers
const sampleUsers = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@shipmanagement.com',
    role: 'Admin',
    password: 'admin123' // In a real app, this would be hashed
  },
  {
    id: 'e1',
    name: 'Engineer 1',
    email: 'engineer1@shipmanagement.com',
    role: 'Engineer',
    specialization: 'Mechanical Systems',
    certification: 'Marine Engineer',
    experience: '10 years'
  },
  {
    id: 'e2',
    name: 'Engineer 2',
    email: 'engineer2@shipmanagement.com',
    role: 'Engineer',
    specialization: 'Electrical Systems',
    certification: 'Marine Engineer',
    experience: '8 years'
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