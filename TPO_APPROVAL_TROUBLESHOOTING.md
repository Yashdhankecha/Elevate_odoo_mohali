# TPO Approval System Troubleshooting Guide

This guide helps resolve common issues with the TPO Student Profile Approval system.

## Common Issues and Solutions

### 1. "Failed to approve/reject student" Error

**Symptoms:**
- Error message appears when clicking approve/reject buttons
- No success feedback
- Student status doesn't change

**Possible Causes:**
1. **Middleware Issues**: TPO institute verification failing
2. **API Endpoint Issues**: Incorrect route parameters
3. **Authentication Issues**: Invalid or expired token
4. **Database Issues**: Student not found or permission denied

**Solutions:**

#### Check TPO Authentication
```javascript
// In browser console
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('User role:', user.role);
console.log('TPO institute:', user.tpo?.instituteName);
```

#### Verify Student Institute Match
```javascript
// Check if student belongs to TPO's institute
// Student.student.collegeName should match TPO.tpo.instituteName
```

#### Test API Endpoints
```javascript
// Test approve endpoint
fetch('/api/tpo/students/[STUDENT_ID]/approve', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Test reject endpoint
fetch('/api/tpo/students/[STUDENT_ID]/reject', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({ reason: 'Test reason' })
});
```

### 2. Middleware Parameter Mismatch

**Issue:** Route uses `:id` but middleware expects `studentId`

**Solution:** Fixed in `server/middleware/tpoInstituteAccess.js`
```javascript
// Now handles both parameter names
const studentId = req.params.id || req.params.studentId;
```

### 3. API Request Format Issues

**Issue:** Incorrect data format being sent

**Solution:** Ensure correct format
```javascript
// Correct format for reject
await tpoApi.rejectStudent(studentId, reason); // reason as string
// API sends: { reason: reason }
```

### 4. Permission Denied Errors

**Symptoms:**
- 403 Forbidden errors
- "Access denied" messages

**Causes:**
1. User not logged in as TPO
2. TPO institute not configured
3. Student doesn't belong to TPO's institute

**Solutions:**

#### Check User Role
```javascript
// Verify TPO role
if (user.role !== 'tpo') {
  console.error('User is not a TPO');
}
```

#### Check Institute Configuration
```javascript
// Verify TPO has institute configured
if (!user.tpo || !user.tpo.instituteName) {
  console.error('TPO institute not configured');
}
```

#### Check Student Institute
```javascript
// Verify student belongs to TPO's institute
if (student.student.collegeName !== user.tpo.instituteName) {
  console.error('Student does not belong to TPO institute');
}
```

### 5. Database Connection Issues

**Symptoms:**
- 500 Internal Server Error
- "Database connection not ready" messages

**Solutions:**
1. Check MongoDB connection
2. Verify database is running
3. Check connection string in environment variables

### 6. Notification Creation Failures

**Symptoms:**
- Approval/rejection works but no notifications
- Silent failures in notification creation

**Solutions:**
1. Check Notification model import
2. Verify notification schema
3. Check for notification creation errors in logs

## Debugging Steps

### Step 1: Check Browser Console
```javascript
// Open browser console and check for errors
console.log('Current user:', JSON.parse(localStorage.getItem('user')));
console.log('Auth token:', localStorage.getItem('token'));
```

### Step 2: Check Network Tab
1. Open Developer Tools → Network tab
2. Try to approve/reject a student
3. Check the API request/response
4. Look for error status codes or messages

### Step 3: Check Server Logs
```bash
# Check server console for errors
# Look for middleware errors, database errors, etc.
```

### Step 4: Test API Endpoints Directly
```javascript
// Use the test functions
window.testTPOApproval.testAPIEndpoints();
window.testTPOApproval.testMiddleware();
```

## Testing Checklist

### Before Testing
- [ ] TPO is logged in
- [ ] TPO has institute configured
- [ ] Students exist in the system
- [ ] Students belong to TPO's institute
- [ ] Server is running
- [ ] Database is connected

### During Testing
- [ ] Check browser console for errors
- [ ] Monitor network requests
- [ ] Verify API responses
- [ ] Check database updates
- [ ] Verify notifications are created

### After Testing
- [ ] Student approval status updated
- [ ] Notification sent to student
- [ ] UI reflects changes
- [ ] No errors in console

## Common Error Messages

### "Student not found"
- **Cause:** Student ID doesn't exist in database
- **Solution:** Verify student exists and ID is correct

### "Access denied. Only TPOs can access this resource"
- **Cause:** User is not logged in as TPO
- **Solution:** Login as TPO user

### "Access denied. You can only access students from your institute"
- **Cause:** Student doesn't belong to TPO's institute
- **Solution:** Check institute names match exactly

### "TPO profile not found or institute not configured"
- **Cause:** TPO user doesn't have institute configured
- **Solution:** Configure TPO institute in user profile

### "Rejection reason is required"
- **Cause:** No reason provided for rejection
- **Solution:** Provide a reason when rejecting

## Environment Variables

Ensure these are set correctly:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Database Schema Verification

Check that User model has required fields:
```javascript
// Required fields for approval system
approvalStatus: String, // 'Pending', 'Approved', 'Rejected'
approvedAt: Date,
approvedBy: ObjectId,
rejectedAt: Date,
rejectedBy: ObjectId,
rejectionReason: String
```

## Support

If issues persist:
1. Check server logs for detailed error messages
2. Verify all middleware functions are working
3. Test with different TPO and student accounts
4. Check database connectivity and permissions
5. Verify API routes are properly registered

## Quick Fix Commands

### Restart Server
```bash
# Stop and restart the server
npm run dev
# or
node server.js
```

### Clear Browser Data
```javascript
// Clear localStorage
localStorage.clear();
// Then login again
```

### Test Database Connection
```javascript
// In server console
mongoose.connection.readyState
// Should return 1 (connected)
```

### Verify Routes
```bash
# Check if routes are registered
curl -X GET http://localhost:5000/api/tpo/dashboard-stats
```
