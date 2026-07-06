 Employee Management System
A modern, responsive employee management dashboard built with vanilla JavaScript, HTML, and CSS. Perform CRUD operations with data persistence using localStorage.

https://img.shields.io/badge/demo-live-brightgreen
https://img.shields.io/badge/made%2520with-vanilla%2520JS-blue
https://img.shields.io/badge/license-MIT-green

🎯 Live Demo
🔗 View Live Application

✨ Features
Core Functionality
✅ Add Employee - Create new employee records with real-time validation

✅ View Employees - Display all employees in a clean, sortable table

✅ Edit Employee - Update existing employee information

✅ Delete Employee - Remove employee records with confirmation dialog

✅ Search Employees - Real-time filtering by name or department

✅ Statistics Dashboard - View total employees and department count

User Experience
🎨 Clean UI - Modern design with smooth animations

📱 Fully Responsive - Works on desktop, tablet, and mobile

💾 Data Persistence - All data stored in browser's localStorage

⚡ Real-time Updates - Instant feedback on all actions

🔔 Success/Error Messages - Clear feedback for every action

Security
🛡️ XSS Protection - Input sanitization prevents attacks

✅ Form Validation - Comprehensive validation with helpful error messages

🔒 Email Uniqueness - Prevents duplicate email addresses

🚀 Quick Start
Installation
bash
# Clone the repository
git clone https://github.com/sidraliaqat/employee-managment-dashboard.git

# Navigate to project directory
cd employee-managment-dashboard

# Open in browser
open index.html   # On macOS
start index.html  # On Windows
Usage
Add Employee

Go to "Add Employee" tab

Fill in name (must start with a letter)

Enter email (must end with @gmail.com)

Select department from dropdown

Click "Add Employee"

Manage Records

Switch to "View Employees" tab

Search by name or department

Click ✏️ to edit or 🗑️ to delete

📊 Data Structure
javascript
{
  id: "1642345678901-a3f9k2",  // Auto-generated unique ID
  name: "John Doe",            // Employee full name
  email: "johndoe@gmail.com",  // Valid Gmail address
  department: "Engineering"    // Department from dropdown
}
🔧 Technologies Used
Technology	Purpose
HTML5	Semantic markup structure
CSS3	Modern styling with Flexbox & Grid
JavaScript ES6+	Application logic with no dependencies
Font Awesome	Icon library for visual elements
localStorage	Browser storage for data persistence
📋 Validation Rules
Field	Rule
Name	• Must start with a letter (A-Z)
• Minimum 2 characters
• Letters, spaces, hyphens, and apostrophes only
Email	• Must end with @gmail.com
• Must be unique
• Valid email format required
Department	• Must be selected from dropdown
🎨 Customization
Adding Departments
Edit the department dropdown in index.html:

html
<select id="empDept" required>
    <option value="">Select Department</option>
    <option value="Engineering">Engineering</option>
    <option value="Marketing">Marketing</option>
    <!-- Add your departments here -->
</select>
Styling
Modify style.css:

Primary color: #1a1a1a

Error color: #cc3333

Success color: #2d7a4a

🌐 Browser Support
Browser	Support
Chrome	✅
Firefox	✅
Edge	✅
Safari	✅
Opera	✅
📱 Responsive Design
Screen Size	Layout
> 768px	Full desktop layout
481px - 768px	Tablet - 2 column stats
< 480px	Mobile - Single column
📁 Project Structure
text
employee-managment-dashboard/
│
├── index.html          # Main HTML structure
├── style.css           # All styles & responsive design
├── app.js              # Complete application logic
└── README.md           # Documentation
🔒 Security Features
XSS Protection: escapeHtml() function sanitizes all user input

Input Validation: Comprehensive client-side validation

Email Uniqueness: Prevents duplicate email addresses

Data Sanitization: Cleans data on load and save

📝 Future Enhancements
Export data to CSV

Import data from CSV

Dark mode support

Column sorting

Pagination for large datasets

Employee profile pictures

Date of joining field

Employee status (Active/Inactive)

Advanced search filters

Data backup and restore

Print employee list

🤝 Contributing
Fork the repository

Create feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request
