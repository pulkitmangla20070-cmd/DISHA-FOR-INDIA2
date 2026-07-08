export const attendanceData = [
  { id: '1', date: new Date().toISOString(), volunteerName: 'Aarav Patel', programTitle: 'Beach Cleanup Drive', status: 'present', hours: 4, checkInTime: '08:30 AM', checkOutTime: '12:30 PM' },
  { id: '2', date: new Date().toISOString(), volunteerName: 'Priya Sharma', programTitle: 'Tree Plantation Drive', status: 'present', hours: 5, checkInTime: '07:00 AM', checkOutTime: '12:00 PM' },
  { id: '3', date: new Date().toISOString(), volunteerName: 'Rohan Gupta', programTitle: 'Teaching English to Kids', status: 'present', hours: 3, checkInTime: '09:00 AM', checkOutTime: '12:00 PM' },
  { id: '4', date: new Date().toISOString(), volunteerName: 'Neha Singh', programTitle: 'Flood Relief Distribution', status: 'absent', hours: 0, checkInTime: '-', checkOutTime: '-' },
  { id: '5', date: new Date().toISOString(), volunteerName: 'Ananya Iyer', programTitle: 'Beach Cleanup Drive', status: 'present', hours: 4, checkInTime: '08:45 AM', checkOutTime: '12:45 PM' },
  { id: '6', date: new Date(Date.now() - 86400000).toISOString(), volunteerName: 'Vikram Reddy', programTitle: 'Blood Donation Camp', status: 'present', hours: 6, checkInTime: '06:30 AM', checkOutTime: '12:30 PM' },
  { id: '7', date: new Date(Date.now() - 86400000).toISOString(), volunteerName: 'Karthik Menon', programTitle: 'Career Counseling Workshop', status: 'late', hours: 2, checkInTime: '10:30 AM', checkOutTime: '12:30 PM' },
];
