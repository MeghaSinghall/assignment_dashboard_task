import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Upload, Plus, Users, FileText, Calendar, AlertCircle, LogOut, Trash2, LayoutGrid, List, Edit2, X } from 'lucide-react';
import { MOCK_STUDENTS, MOCK_ADMIN, INITIAL_ASSIGNMENTS } from './data/mocks';
import { Header } from './components/common/Header';
import { LoginForm } from './components/common/LoginForm';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

const STORAGE_VERSION = 'v1'; // For migration

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showLogin, setShowLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(null);
  const [viewMode, setViewMode] = useState('card');
  const [viewingSubmissionsFor, setViewingSubmissionsFor] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [tempDeadline, setTempDeadline] = useState('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    deadline: '',
    driveLink: '',
  });

  // Enhanced storage helpers with versioning and error handling
  const getFromStorage = (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      const parsed = JSON.parse(item);
      if (parsed.version !== STORAGE_VERSION) {
        // Migrate old data (simple reset for demo)
        console.warn(`Migrating ${key} from old version`);
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      localStorage.removeItem(key);
      return null;
    }
  };

  const setToStorage = (key, value) => {
    try {
      const payload = { version: STORAGE_VERSION, data: value, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(payload));
      // Broadcast change to other tabs
      const channel = new BroadcastChannel('storage-update');
      channel.postMessage({ key, value });
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      alert('Storage error: Browser quota exceeded. Clear cache.');
    }
  };

  // Dynamic sync listener for other tabs
  useEffect(() => {
    const channel = new BroadcastChannel('storage-update');
    const handleBroadcast = (event) => {
      if (event.data.key === 'assignments') {
        setAssignments(event.data.value || []);
      } else if (event.data.key === 'submissions') {
        setSubmissions(event.data.value || []);
      }
    };
    channel.addEventListener('message', handleBroadcast);

    // Also listen to StorageEvent (for non-same-origin, but useful fallback)
    const handleStorageChange = (event) => {
      if (event.key === 'assignments') {
        setAssignments(getFromStorage('assignments') || []);
      } else if (event.key === 'submissions') {
        setSubmissions(getFromStorage('submissions') || []);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Initial load
    let storedAssignments = getFromStorage('assignments');
    if (!storedAssignments) {
      storedAssignments = INITIAL_ASSIGNMENTS;
      setToStorage('assignments', storedAssignments);
    }
    setAssignments(storedAssignments);

    let storedSubmissions = getFromStorage('submissions') || [];
    setSubmissions(storedSubmissions);

    // Cleanup
    return () => {
      channel.removeEventListener('message', handleBroadcast);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (loginEmail === MOCK_ADMIN.email && loginPassword === MOCK_ADMIN.password) {
      setCurrentUser(MOCK_ADMIN);
      setUserRole('admin');
      setShowLogin(false);
    } else {
      const student = MOCK_STUDENTS.find(
        s => s.email === loginEmail && s.password === loginPassword
      );
      if (student) {
        setCurrentUser(student);
        setUserRole('student');
        setShowLogin(false);
      } else {
        alert('Invalid credentials');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setShowLogin(true);
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleAddAssignment = () => {
    if (!newAssignment.title || !newAssignment.deadline) {
      alert('Please fill in title and deadline');
      return;
    }
    const assignment = {
      id: 'a' + Date.now(),
      ...newAssignment,
      createdBy: currentUser.id,
    };
    const updatedAssignments = [...assignments, assignment];
    setAssignments(updatedAssignments);
    setToStorage('assignments', updatedAssignments); // Triggers broadcast
    
    setNewAssignment({ title: '', description: '', deadline: '', driveLink: '' });
    setShowAddAssignment(false);
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
      setAssignments(updatedAssignments);
      setToStorage('assignments', updatedAssignments);
      
      const updatedSubmissions = submissions.filter(s => s.assignmentId !== assignmentId);
      setSubmissions(updatedSubmissions);
      setToStorage('submissions', updatedSubmissions);
    }
  };

  const handleSubmitAssignment = (assignmentId, file) => {
    if (file && file.type !== 'application/pdf') {
      alert('Only PDF files are allowed for submission.');
      return;
    }
    if (file && file.size > 2 * 1024 * 1024) {
      alert('File too large (max 2MB).');
      return;
    }

    let submission = {
      id: 's' + Date.now(),
      assignmentId,
      studentId: currentUser.id,
      submittedAt: new Date().toISOString(),
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        submission.fileName = file.name;
        submission.fileSize = file.size;
        submission.fileType = file.type;
        submission.fileData = e.target.result;

        const updatedSubmissions = [...submissions, submission];
        setSubmissions(updatedSubmissions);
        setToStorage('submissions', updatedSubmissions); // Triggers broadcast
        setConfirmSubmit(null);
      };
      reader.readAsDataURL(file);
    } else {
      const updatedSubmissions = [...submissions, submission];
      setSubmissions(updatedSubmissions);
      setToStorage('submissions', updatedSubmissions);
      setConfirmSubmit(null);
    }
  };

  const isSubmitted = (assignmentId, studentId) => {
    return submissions.some(
      s => s.assignmentId === assignmentId && s.studentId === studentId
    );
  };

  const getSubmissionCount = (assignmentId) => {
    return submissions.filter(s => s.assignmentId === assignmentId).length;
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const handleSaveDeadline = (id) => {
    if (!tempDeadline) {
      alert('Please select a deadline');
      return;
    }
    const updatedAssignments = assignments.map(a =>
      a.id === id ? { ...a, deadline: tempDeadline } : a
    );
    setAssignments(updatedAssignments);
    setToStorage('assignments', updatedAssignments); // Triggers broadcast
    setEditingId(null);
    setTempDeadline('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTempDeadline('');
  };

  // Student view calculations
  const studentAssignments = userRole === 'student' ? assignments : [];
  const pendingCount = studentAssignments.filter(
    a => !isSubmitted(a.id, currentUser?.id)
  ).length;
  const submittedCount = studentAssignments.filter(
    a => isSubmitted(a.id, currentUser?.id)
  ).length;

  const handleConfirmSubmit = (assignmentId, file) => {
    if (confirmSubmit === assignmentId) {
      handleSubmitAssignment(assignmentId, file);
    } else {
      setConfirmSubmit(assignmentId);
    }
  };

  if (showLogin) {
    return (
      <LoginForm
        loginEmail={loginEmail}
        onEmailChange={setLoginEmail}
        loginPassword={loginPassword}
        onPasswordChange={setLoginPassword}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header currentUser={currentUser} userRole={userRole} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === 'student' && (
          <StudentDashboard
            assignments={studentAssignments}
            pendingCount={pendingCount}
            submittedCount={submittedCount}
            viewMode={viewMode}
            onViewChange={setViewMode}
            confirmSubmit={confirmSubmit}
            onConfirmSubmit={handleConfirmSubmit}
            currentUserId={currentUser.id}
            isSubmitted={isSubmitted}
            isOverdue={isOverdue}
          />
        )}
        {userRole === 'admin' && (
          <AdminDashboard
            assignments={assignments}
            viewMode={viewMode}
            onViewChange={setViewMode}
            showAddAssignment={showAddAssignment}
            onToggleAdd={setShowAddAssignment}
            newAssignment={newAssignment}
            onNewAssignmentChange={setNewAssignment}
            onAddAssignment={handleAddAssignment}
            viewingSubmissionsFor={viewingSubmissionsFor}
            onToggleViewSubmissions={setViewingSubmissionsFor}
            editingId={editingId}
            tempDeadline={tempDeadline}
            onEditDeadlineChange={setTempDeadline}
            onSaveDeadline={handleSaveDeadline}
            onCancelEdit={handleCancelEdit}
            onDeleteAssignment={handleDeleteAssignment}
            getSubmissionCount={getSubmissionCount}
            isOverdue={isOverdue}
            isSubmitted={isSubmitted}
            submissions={submissions}
          />
        )}
      </main>
    </div>
  );
};

export default App;