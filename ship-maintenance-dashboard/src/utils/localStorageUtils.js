export const initializeMockData = () => {
  console.log("Initializing mock data...");
  
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
        shipId: "s1",
        componentId: "c1",
        componentName: "Main Engine",
        type: "Routine Check",
        jobType: "Preventive Maintenance",
        priority: "Medium",
        status: "Pending",
        scheduledDate: "2024-04-01",
        description: "Regular maintenance check of main engine",
        assignedEngineerId: "e1",
        assignedEngineerName: "Engineer 1"
      },
      {
        id: "j2",
        shipId: "s2",
        componentId: "c2",
        componentName: "Radar",
        type: "Repair",
        jobType: "Corrective Maintenance",
        priority: "High",
        status: "In Progress",
        scheduledDate: "2024-03-25",
        description: "Fix radar signal interference issue",
        assignedEngineerId: "e2",
        assignedEngineerName: "Engineer 2"
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
    const jobsInProgress = jobs.filter(job => job.status === 'In Progress').length;
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
