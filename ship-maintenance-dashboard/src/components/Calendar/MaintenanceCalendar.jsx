import React, { useState, useEffect } from 'react';

const MaintenanceCalendar = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [jobsByDate, setJobsByDate] = useState({});
  const [viewType, setViewType] = useState('month'); // 'month' or 'week'
  const [selectedDayJobs, setSelectedDayJobs] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDateClick = (date, jobs) => {
    setSelectedDayJobs({ date, jobs });
    setIsModalOpen(true);
  };

  const getWeekDates = () => {
    const curr = new Date(selectedDate);
    const week = [];
    
    // Starting from Sunday
    curr.setDate(curr.getDate() - curr.getDay());
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    
    return week;
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates();
    
    return (
      <div className="grid grid-cols-7 gap-px">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-semibold bg-gray-50">
            {day}
          </div>
        ))}
        {weekDates.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const dayJobs = jobsByDate[dateStr] || [];
          
          return (
            <div 
              key={index}
              className="p-2 border border-gray-200 min-h-[200px] relative cursor-pointer hover:bg-gray-50"
              onClick={() => handleDateClick(dateStr, dayJobs)}
            >
              <div className="font-semibold">{date.getDate()}</div>
              {dayJobs.map((job) => (
                <div
                  key={job.id}
                  className={`text-sm p-2 mb-1 rounded ${
                    job.priority === 'High' 
                      ? 'bg-red-100 text-red-800'
                      : job.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  <div className="font-medium">{job.componentName}</div>
                  <div className="text-xs">{job.description.substring(0, 30)}...</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
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
        <div 
          key={day} 
          className="p-2 border border-gray-200 min-h-[100px] relative cursor-pointer hover:bg-gray-50"
          onClick={() => handleDateClick(date, dayJobs)}
        >
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
            >
              {job.componentName}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-px">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-semibold bg-gray-50">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else {
      newDate.setDate(newDate.getDate() + (7 * direction));
    }
    setSelectedDate(newDate);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Maintenance Calendar</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="flex rounded-md shadow-sm w-full sm:w-auto">
            <button
              onClick={() => setViewType('month')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-l-md ${
                viewType === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewType('week')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-r-md ${
                viewType === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
          </div>
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto space-x-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            <span className="text-lg font-semibold whitespace-nowrap">
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
      </div>

      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle px-6">
          {viewType === 'month' ? renderMonthView() : renderWeekView()}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Jobs for {selectedDayJobs.date}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {selectedDayJobs.jobs.length === 0 ? (
              <p className="text-gray-500">No jobs scheduled for this day.</p>
            ) : (
              <div className="space-y-4">
                {selectedDayJobs.jobs.map((job) => (
                  <div
                    key={job.id}
                    className={`p-4 rounded-lg ${
                      job.priority === 'High'
                        ? 'bg-red-50'
                        : job.priority === 'Medium'
                        ? 'bg-yellow-50'
                        : 'bg-green-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h4 className="font-medium">{job.componentName}</h4>
                      <div className="flex items-center mt-2 sm:mt-0">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            job.priority === 'High'
                              ? 'bg-red-100 text-red-800'
                              : job.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {job.priority} Priority
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{job.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Assigned to: {job.assignedTo}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceCalendar; 