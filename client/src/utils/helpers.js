// Helper function to get user initials from name
export const getUserInitials = (name) => {
  if (!name) return 'U';
  
  const names = name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Helper function to get user display name
export const getUserDisplayName = (user) => {
  if (!user) return 'User';
  
  if (user.name) return user.name;
  if (user.username) return user.username;
  if (user.email) return user.email.split('@')[0];
  
  return 'User';
};

// Helper function to get role display name
export const getRoleDisplayName = (role) => {
  const roleMap = {
    'student': 'Student',
    'tpo': 'TPO',
    'company': 'Company',
    'superadmin': 'Super Administrator'
  };
  
  return roleMap[role] || 'User';
};
