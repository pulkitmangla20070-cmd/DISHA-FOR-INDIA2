export const notificationsData = [
  { id: '1', title: 'New Application Received', message: 'Rohan Gupta applied for Beach Cleanup Drive.', type: 'info', read: false, createdAt: new Date().toISOString() },
  { id: '2', title: 'Milestone Reached', message: 'You have reached 10 total active programs!', type: 'success', read: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', title: 'Volunteer Check‑in Alert', message: 'Priya Sharma checked in for Weekend Plantation Drive.', type: 'info', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: '4', title: 'Certificate Issued', message: 'Certificate for Aarav Patel has been generated and emailed.', type: 'success', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '5', title: 'Support Ticket Opened', message: 'Neha Singh opened a new support ticket: "Login issue".', type: 'warning', read: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: '6', title: 'Program Completed', message: 'Tree Plantation Drive has been marked as completed.', type: 'success', read: true, createdAt: new Date(Date.now() - 259200000).toISOString() },
];
