import React from 'react';
import { Plus, Users, Calendar, Trash2, Edit2, X, Download } from 'lucide-react';
import { ViewToggle } from '../common/ViewToggle';
import { MOCK_STUDENTS } from '../../data/mocks';

export const AdminDashboard = ({
  assignments,
  viewMode,
  onViewChange,
  showAddAssignment,
  onToggleAdd,
  newAssignment,
  onNewAssignmentChange,
  onAddAssignment,
  viewingSubmissionsFor,
  onToggleViewSubmissions,
  editingId,
  tempDeadline,
  onEditDeadlineChange,
  onSaveDeadline,
  onCancelEdit,
  onDeleteAssignment,
  getSubmissionCount,
  isOverdue,
  isSubmitted,
  submissions,
}) => {
  const totalStudents = MOCK_STUDENTS.length;

  const getStudentSubmission = (assignmentId, studentId) => {
    return submissions.find(s => s.assignmentId === assignmentId && s.studentId === studentId);
  };

  const handleDownloadFile = (fileData, fileName) => {
    const byteCharacters = atob(fileData.split(',')[1]); // Extract base64 data
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Manage Assignments</h2>
        <button
          onClick={() => onToggleAdd(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Create Assignment
        </button>
      </div>

      <ViewToggle viewMode={viewMode} onViewChange={onViewChange} />

      {/* Add Assignment Modal - unchanged */}
      {showAddAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Create New Assignment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => onNewAssignmentChange({ ...newAssignment, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => onNewAssignmentChange({ ...newAssignment, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Assignment description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={newAssignment.deadline}
                  onChange={(e) => onNewAssignmentChange({ ...newAssignment, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Drive Link (Optional)</label>
                <input
                  type="url"
                  value={newAssignment.driveLink}
                  onChange={(e) => onNewAssignmentChange({ ...newAssignment, driveLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={onAddAssignment}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Create Assignment
              </button>
              <button
                onClick={() => onToggleAdd(false)}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map(assignment => {
            const submissionCount = getSubmissionCount(assignment.id);
            const percentage = Math.round((submissionCount / totalStudents) * 100);
            const overdue = isOverdue(assignment.deadline);
            return (
              <div key={assignment.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{assignment.title}</h3>
                    <p className="text-gray-600 mt-1">{assignment.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        {editingId === assignment.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="date"
                              value={tempDeadline}
                              onChange={(e) => onEditDeadlineChange(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <button onClick={() => onSaveDeadline(assignment.id)} className="px-3 py-1 bg-green-500 text-white rounded text-sm">Save</button>
                            <button onClick={onCancelEdit} className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm ml-1">Cancel</button>
                          </div>
                        ) : (
                          <span className={`text-sm font-medium ${overdue ? 'text-red-600' : 'text-gray-700'} flex-1 min-w-0`}>
                            Due: {new Date(assignment.deadline).toLocaleDateString()}
                          </span>
                        )}
                        {editingId !== assignment.id && (
                          <button
                            onClick={() => onEditDeadlineChange(assignment.deadline)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded flex-shrink-0"
                            title="Edit deadline"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {assignment.driveLink && (
                        <a
                          href={assignment.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 flex-shrink-0"
                        >
                          Resources Link
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteAssignment(assignment.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete assignment"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {/* Submission Progress */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-700">
                        Submissions: {submissionCount} / {totalStudents}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                {/* View Submissions Button */}
                <div className="mt-4">
                  <button
                    onClick={() => onToggleViewSubmissions(assignment.id)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Users className="w-4 h-4" />
                    View List
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map(assignment => {
                const submissionCount = getSubmissionCount(assignment.id);
                const percentage = Math.round((submissionCount / totalStudents) * 100);
                const overdue = isOverdue(assignment.deadline);
                return (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{assignment.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {editingId === assignment.id ? (
                          <>
                            <input
                              type="date"
                              value={tempDeadline}
                              onChange={(e) => onEditDeadlineChange(e.target.value)}
                              className="text-sm font-medium text-gray-700 border rounded px-2 py-1"
                            />
                            <button
                              onClick={() => onSaveDeadline(assignment.id)}
                              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={onCancelEdit}
                              className="ml-1 px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <span className={`text-sm font-medium ${overdue ? 'text-red-600' : 'text-gray-700'}`}>
                            {new Date(assignment.deadline).toLocaleDateString()}
                          </span>
                        )}
                        {editingId !== assignment.id && (
                          <button
                            onClick={() => onEditDeadlineChange(assignment.deadline)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">{submissionCount}/{totalStudents}</span>
                        <span className="text-sm text-blue-600">{percentage}%</span>
                        <button
                          onClick={() => onToggleViewSubmissions(assignment.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View List
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onDeleteAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Submissions Modal */}
      {viewingSubmissionsFor && (
        (() => {
          const selectedAssignment = assignments.find(a => a.id === viewingSubmissionsFor);
          if (!selectedAssignment) return null;
          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Submissions for {selectedAssignment.title}</h3>
                  <button onClick={() => onToggleViewSubmissions(null)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {MOCK_STUDENTS.map(student => {
                    const submission = getStudentSubmission(selectedAssignment.id, student.id);
                    const submitted = !!submission;
                    return (
                      <div key={student.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{student.name}</span>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${submitted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {submitted ? 'Submitted' : 'Not Submitted'}
                          </span>
                          {submission && (
                            <div className="mt-1 text-xs text-gray-500">
                              <p className="text-xs text-gray-500 mb-1">{new Date(submission.submittedAt).toLocaleString()}</p>
                              {submission.fileName && (
                                <div className="flex items-center gap-1">
                                  <Download className="w-3 h-3 cursor-pointer hover:text-blue-600" onClick={() => handleDownloadFile(submission.fileData, submission.fileName)} title="Download PDF" />
                                  <span>{submission.fileName} ({(submission.fileSize / 1024).toFixed(0)} KB)</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <button
                    onClick={() => onToggleViewSubmissions(null)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      )}
    </>
  );
};