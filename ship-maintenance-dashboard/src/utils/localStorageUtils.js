export const initializeMockData = () => {
  console.log("Initializing mock data...");
  
  // Initialize Users
  const existingUsers = localStorage.getItem("users");
  if (!existingUsers) {
    console.log("Setting up mock users...");
    const users = [
      { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
      { id: "2", role: "Inspector", email: "inspector@entnt.in", password: "inspect123" },
      { id: "3", role: "Engineer", email: "engineer@entnt.in", password: "engine123" },
    ];
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Initialize Ships
  const existingShips = localStorage.getItem("ships");
  if (!existingShips) {
    console.log("Setting up mock ships...");
    const ships = [
      { id: "s1", name: "Ever Given", imo: "9811000", flag: "Panama", status: "Active" },
      { id: "s2", name: "Maersk Alabama", imo: "9164263", flag: "USA", status: "Under Maintenance" }
    ];
    localStorage.setItem("ships", JSON.stringify(ships));
  }

  // Initialize Components
  const existingComponents = localStorage.getItem("components");
  if (!existingComponents) {
    console.log("Setting up mock components...");
    const components = [
      { 
        id: "c1", 
        shipId: "s1", 
        name: "Main Engine", 
        serialNumber: "ME-1234",
        installDate: "2020-01-10", 
        lastMaintenanceDate: "2024-03-12" 
      },
      { 
        id: "c2", 
        shipId: "s2", 
        name: "Radar", 
        serialNumber: "RAD-5678",
        installDate: "2021-07-18", 
        lastMaintenanceDate: "2023-12-01" 
      }
    ];
    localStorage.setItem("components", JSON.stringify(components));
  }

  // Initialize Maintenance Jobs
  const existingJobs = localStorage.getItem("jobs");
  if (!existingJobs) {
    console.log("Setting up mock jobs...");
    const jobs = [
      { 
        id: "j1", 
        componentId: "c1", 
        shipId: "s1", 
        type: "Inspection", 
        priority: "High",
        status: "Open", 
        assignedEngineerId: "3", 
        scheduledDate: "2025-05-05" 
      },
      { 
        id: "j2", 
        componentId: "c2", 
        shipId: "s2", 
        type: "Maintenance", 
        priority: "Medium",
        status: "In Progress", 
        assignedEngineerId: "3", 
        scheduledDate: "2024-04-15" 
      },
      {
        id: "j3",
        componentId: "c1",
        shipId: "s1",
        type: "Repair",
        priority: "Low",
        status: "Completed",
        assignedEngineerId: "3",
        scheduledDate: "2024-03-01"
      }
    ];
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }

  console.log("Mock data initialization complete");
};

export const calculateDashboardStats = () => {
  try {
    // Get data from localStorage
    const ships = JSON.parse(localStorage.getItem('ships')) || [];
    const components = JSON.parse(localStorage.getItem('components')) || [];
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];

    // Calculate statistics
    const totalShips = ships.length;
    
    // Count components with overdue maintenance
    const currentDate = new Date();
    const overdueComponents = components.filter(component => {
      const lastMaintenanceDate = new Date(component.lastMaintenanceDate);
      const monthsDifference = (currentDate.getFullYear() - lastMaintenanceDate.getFullYear()) * 12 +
        (currentDate.getMonth() - lastMaintenanceDate.getMonth());
      return monthsDifference >= 6; // Assuming maintenance is required every 6 months
    }).length;

    // Count jobs by status
    const jobsInProgress = jobs.filter(job => job.status === 'Open' || job.status === 'In Progress').length;
    const jobsCompleted = jobs.filter(job => job.status === 'Completed').length;

    return {
      totalShips,
      overdueComponents,
      jobsInProgress,
      jobsCompleted
    };
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    return {
      totalShips: 0,
      overdueComponents: 0,
      jobsInProgress: 0,
      jobsCompleted: 0
    };
  }
};
