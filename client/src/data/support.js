export const supportTicketsData = [
  { id: '1', userName: 'Neha Singh', subject: 'Login issue', status: 'open', latestMessage: 'I cannot log in to my account since yesterday. Password reset also failed.', createdAt: new Date().toISOString() },
  { id: '2', userName: 'Vikram Reddy', subject: 'QR Scanner not working', status: 'open', latestMessage: 'The attendance QR scanner shows a blank screen on my Android phone.', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', userName: 'Rahul Gupta', subject: 'Hours not updating', status: 'closed', latestMessage: 'My volunteer hours from last week are not reflected on the dashboard. Resolved after cache clear.', createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: '4', userName: 'Meera Joshi', subject: 'Certificate download error', status: 'open', latestMessage: 'When I click download on my certificate, I get a 404 error. Please fix.', createdAt: new Date(Date.now() - 172800000).toISOString() },
];
