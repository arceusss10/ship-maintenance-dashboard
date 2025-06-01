import React, { useState, useEffect } from 'react';

const MaintenanceCalendar = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [jobsByDate, setJobsByDate] = useState({});

  useEffect(() => {
    // Load all maintenance jobs
    const loadJobs = () => {
      const allJobs = JSON.parse(localStorage.getItem('jobs')) || [];
      setJobs(allJobs);
      
      // Group jobs by date
      const groupedJobs = allJobs.reduce((acc, job) => {
        const date = job.scheduledDate.split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(job);
        return acc;
      }, {});
      
      setJobsByDate(groupedJobs);
    };

    loadJobs();
    window.addEventListener('storage', loadJobs);
    return () => window.removeEventListener('storage', loadJobs);
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-gray-200"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayJobs = jobsByDate[date] || [];
      
      days.push(
        <div key={day} className="p-2 border border-gray-200 min-h-[100px] relative">
          <div className="font-semibold">{day}</div>
          {dayJobs.map((job, index) => (
            <div
              key={job.id}
              className={`text-xs p-1 mb-1 rounded ${
                job.priority === 'High' 
                  ? 'bg-red-100 text-red-800'
                  : job.priority === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
              title={`${job.componentName} - ${job.description}`}
            >
              {job.componentName}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Maintenance Calendar</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <span className="text-lg font-semibold">
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-semibold bg-gray-50">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 rounded mr-1"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 rounded mr-1"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 rounded mr-1"></div>
            <span>Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCalendar; 