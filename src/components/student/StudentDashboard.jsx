import React, { useState } from 'react';
import { CheckCircle, Clock, FileText, Calendar, AlertCircle, Upload, X } from 'lucide-react';
import { ViewToggle } from '../common/ViewToggle';

export const StudentDashboard = ({
  assignments,
  pendingCount,
  submittedCount,
  viewMode,
  onViewChange,
  confirmSubmit,
  onConfirmSubmit,
  currentUserId,
  isSubmitted,
  isOverdue,
}) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const studentAssignments = assignments;
  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setSelectedFile(null); // Reset file on open
  };
  const handleCloseModal = () => {
    setSelectedAssignment(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      e.target.value = ''; // Clear input
      return;
    }
    if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('File too large (max 2MB).');
      e.target.value = '';
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmitFromModal = (assignmentId) => {
    if (!selectedFile) {
      alert('Please select a PDF file to upload');
      return;
    }
    onConfirmSubmit(assignmentId, selectedFile);
  };

  const submitted = selectedAssignment ? isSubmitted(selectedAssignment.id, currentUserId) : false;
  const overdue = selectedAssignment ? isOverdue(selectedAssignment.deadline) : false;

  return (
    <>
      {/* Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Submitted Assignments</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{submittedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <ViewToggle viewMode={viewMode} onViewChange={onViewChange} />

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentAssignments.map(assignment => {
            const assignmentSubmitted = isSubmitted(assignment.id, currentUserId);
            const assignmentOverdue = isOverdue(assignment.deadline);
            return (
              <div key={assignment.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${assignmentSubmitted ? 'bg-green-100' : 'bg-blue-100'}`}>
                        {assignmentSubmitted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800">{assignment.title}</h3>
                        <p className="text-gray-600 mt-1">{assignment.description}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className={`text-sm font-medium ${assignmentOverdue && !assignmentSubmitted ? 'text-red-600' : 'text-gray-700'}`}>
                              Due: {new Date(assignment.deadline).toLocaleDateString()}
                            </span>
                          </div>
                          {assignment.driveLink && (
                            <a
                              href={assignment.driveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 underline"
                            >
                              View Resources
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end gap-3">
                    <button
                      onClick={() => handleViewAssignment(assignment)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
                    >
                      <FileText className="w-4 h-4" />
                      View Assignment
                    </button>
                    {assignmentSubmitted ? (
                      <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                        Submitted ✓
                      </div>
                    ) : (
                      <button
                        onClick={() => handleViewAssignment(assignment)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
                      >
                        <Upload className="w-4 h-4" />
                        Submit Assignment
                      </button>
                    )}
                  </div>
                </div>
                {assignmentOverdue && !assignmentSubmitted && (
                  <div className="mt-4 flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">This assignment is overdue!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentAssignments.map(assignment => {
                const assignmentSubmitted = isSubmitted(assignment.id, currentUserId);
                const assignmentOverdue = isOverdue(assignment.deadline);
                return (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{assignment.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-medium ${assignmentOverdue && !assignmentSubmitted ? 'text-red-600' : 'text-gray-700'}`}>
                        {new Date(assignment.deadline).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assignmentSubmitted ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Submitted
                        </span>
                      ) : assignmentOverdue ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Overdue
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewAssignment(assignment)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View
                        </button>
                        {assignmentSubmitted ? (
                          <span className="text-green-600">✓ Submitted</span>
                        ) : (
                          <button
                            onClick={() => handleViewAssignment(assignment)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignment View Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{selectedAssignment.title}</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">{selectedAssignment.description}</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className={`text-sm font-medium ${overdue ? 'text-red-600' : 'text-gray-700'}`}>
                  Due: {new Date(selectedAssignment.deadline).toLocaleDateString()}
                  {overdue && <AlertCircle className="w-4 h-4 inline ml-1" />}
                </span>
              </div>
              {selectedAssignment.driveLink && (
                <a
                  href={selectedAssignment.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Open Resources (Google Drive)
                </a>
              )}
              {!submitted && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF Submission (Max 2MB)</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    accept=".pdf"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</p>
                  )}
                </div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t">
              {submitted ? (
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-center">
                  Submitted ✓
                </div>
              ) : (
                <button
                  onClick={() => handleSubmitFromModal(selectedAssignment.id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!selectedFile}
                >
                  {selectedFile ? 'Submit Assignment' : 'Select a PDF to submit'}
                </button>
              )}
              <button
                onClick={handleCloseModal}
                className="w-full mt-2 text-gray-600 hover:text-gray-800 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};