const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'client', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const files = {
  'dashboardData.js': export default {
    totalVolunteers: 18,
    activePrograms: 1,
    hoursVolunteered: 0,
    signupsThisMonth: 18,
    totalPrograms: 1,
    draftPrograms: 0,
    completedPrograms: 0,
    pendingApplications: 1
};,
  'notifications.js': export default [
    { id: '1', title: 'New Application', message: 'Rohan applied for Beach Cleanup.', type: 'info', read: false, createdAt: new Date().toISOString() },
    { id: '2', title: 'Target Reached', message: 'You reached 10 total programs', type: 'success', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() }
];,
  'announcements.js': export default [
    { id: '1', title: 'Platform Update 2.0', message: 'Updated the dashboard features.', type: 'system', status: 'published', createdAt: new Date().toISOString() },
    { id: '2', title: 'Weekend Drive', message: 'Plantation drive this weekend.', type: 'event', status: 'scheduled', createdAt: new Date().toISOString() }
];,
  'messages.js': export default [
    { id: '1', sender: 'Priya Sharma', text: 'Where is the meeting point?', read: false, date: new Date().toISOString() }
];,
  'programs.js': export default [
    { id: '1', title: 'Beach Cleanup', category: 'Environment', location: { city: 'Mumbai' }, status: 'published' }
];,
  'applications.js': export default [
    { id: '1', volunteerName: 'Aarav Patel', programTitle: 'Beach Cleanup', status: 'pending', date: new Date().toISOString() }
];,
  'attendance.js': export default [
    { id: '1', date: new Date().toISOString(), volunteerName: 'Aarav Patel', program: 'Beach Cleanup', status: 'present', hours: 4 }
];,
  'volunteers.js': export default [
    { id: '1', name: 'Aarav Patel', email: 'aarav@example.com', joinDate: new Date().toISOString(), status: 'Active' }
];,
  'analytics.js': export default {
    volunteerGrowth: [{ month: 'Jan', count: 5 }, { month: 'Feb', count: 18 }],
    applications: [{ month: 'Jan', count: 0 }, { month: 'Feb', count: 1 }]
};,
  'forecast.js': export default {
    projectedVolunteers: 25,
    projectedHours: 100
};,
  'reports.js': export default [
    { id: '1', type: 'Monthly Review', date: new Date().toISOString() }
];,
  'certificates.js': export default [
    { id: '1', volunteerName: 'Aarav Patel', program: 'Beach Cleanup', issueDate: new Date().toISOString() }
];,
  'contributions.js': export default {
    totalamount: 5000,
    recent: [{ id: '1', donor: 'John Doe', amount: 500, date: new Date().toISOString() }]
};,
  'support.js': export default [
    { id: '1', user: 'Neha Singh', subject: 'Login issue', status: 'open', date: new Date().toISOString() }
];
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dataDir, filename), content);
}
console.log('Mock files created thoroughly.');
