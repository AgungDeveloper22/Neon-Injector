import React, { useEffect, useState } from 'react';
import { formatDate, getClientInfo, showToast, generateIdentifier } from '../utils';
import Swal from 'sweetalert2';

const CommentsSection = () => {
  const [hasCommented, setHasCommented] = useState(false);
  const [userComment, setUserComment] = useState(null);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [userIdentifier, setUserIdentifier] = useState('');
  const [lastCommentsHash, setLastCommentsHash] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allComments, setAllComments] = useState([]);

  useEffect(() => {
    async function init() {
      const { userAgent } = await getClientInfo();
      const ip = await fetch('https://api.ipify.org?format=json').then((res) => res.json()).then((data) => data.ip);
      const identifier = await generateIdentifier(ip, userAgent);
      setUserIdentifier(identifier);
      fetchUserComment();
      fetchComments();
      startCommentPolling();
    }
    init();

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      fetchAllComments();
    }
  }, [isModalOpen]);

  let pollInterval;
  function startCommentPolling() {
    pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchComments();
      }
    }, 30000);
  }

  async function fetchUserComment() {
    try {
      const { userAgent } = await getClientInfo();
      const response = await fetch('https://myapi.videyhost.my.id/api/?action=get_user_comment&token=AgungDeveloper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAgent }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success && data.has_commented) {
        setHasCommented(true);
        setUserComment(data.comment);
      } else {
        setHasCommented(false);
      }
    } catch (error) {
      showToast('Error loading user comment.', 'error');
    }
  }

  async function fetchComments() {
    if (document.visibilityState !== 'visible') return;
    try {
      const response = await fetch('https://myapi.videyhost.my.id/api/?action=get_comments&token=AgungDeveloper&limit=10');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        const commentsHash = JSON.stringify(data.comments);
        if (commentsHash !== lastCommentsHash) {
          setComments(data.comments);
          setTotalComments(data.total_comments);
          setLastCommentsHash(commentsHash);
        }
      } else {
        showToast('Failed to load comments.', 'error');
      }
    } catch (error) {
      showToast('Error loading comments. Please try again.', 'error');
    }
  }

  async function fetchAllComments() {
    try {
      const response = await fetch('https://myapi.videyhost.my.id/api/?action=get_comments&token=AgungDeveloper');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setAllComments(data.comments);
      } else {
        showToast('Failed to load all comments.', 'error');
      }
    } catch (error) {
      showToast('Error loading all comments.', 'error');
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    const name = e.target.commentName.value.trim();
    const message = e.target.commentMessage.value.trim();
    if (!name || !message) {
      Swal.fire({
        title: 'Error!',
        text: 'Name and message are required.',
        icon: 'error',
        customClass: { popup: 'bg-gray-800 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
      });
      return;
    }
    Swal.fire({
      title: 'Confirm Your Comment',
      text: `Are you sure you want to submit this comment as ${name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-gray-800 text-white',
        confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg',
        cancelButton: 'bg-gray-600 text-white px-4 py-2 rounded-lg',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { userAgent } = await getClientInfo();
          const response = await fetch('https://myapi.videyhost.my.id/api/?action=add_comment&token=AgungDeveloper', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, message, userAgent }),
          });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (data.success) {
            e.target.reset();
            fetchUserComment();
            fetchComments();
            Swal.fire({
              title: 'Success!',
              text: 'Comment submitted successfully!',
              icon: 'success',
              customClass: { popup: 'bg-gray-800 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: data.message || 'Failed to submit comment.',
              icon: 'error',
              customClass: { popup: 'bg-gray-800 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Error submitting comment. Please try again.',
            icon: 'error',
            customClass: { popup: 'bg-gray-800 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
          });
        }
      }
    });
  }

  async function handleEditComment() {
    const name = document.getElementById('editCommentName').value.trim();
    const message = document.getElementById('editCommentMessage').value.trim();
    if (!name || !message) {
      Swal.fire({
        title: 'Error!',
        text: 'Name and message are required.',
        icon: 'error',
        customClass: { popup: 'bg-gray-800 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
      });
      return;
    }
    Swal.fire({
      title: 'Confirm Update',
      text: `Are you sure you want to update your comment as ${name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-gray-800 text-white',
        confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg',
        cancelButton: 'bg-gray-600 text-white px-4 py-2 rounded-lg',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { userAgent } = await getClientInfo();
          const response = await fetch('https://myapi.videyhost.my.id/api/?action=edit_comment&token=AgungDeveloper', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, message, userAgent }),
          });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (data.success) {
            fetchComments();
            Swal.fire({
              title: 'Success!',
              text: 'Comment updated successfully!',
              icon: 'success',
              customClass: { popup: 'bg-gray-800 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: data.message || 'Failed to update comment.',
              icon: 'error',
              customClass: { popup: 'bg-gray-800 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Error updating comment. Please try again.',
            icon: 'error',
            customClass: { popup: 'bg-gray-800 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
          });
        }
      }
    });
  }

  async function handleDeleteComment() {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete your comment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-gray-800 text-white',
        confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg',
        cancelButton: 'bg-gray-600 text-white px-4 py-2 rounded-lg',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { userAgent } = await getClientInfo();
          const response = await fetch('https://myapi.videyhost.my.id/api/?action=delete_comment&token=AgungDeveloper', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAgent }),
          });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (data.success) {
            fetchUserComment();
            fetchComments();
            Swal.fire({
              title: 'Success!',
              text: 'Comment deleted successfully!',
              icon: 'success',
              customClass: { popup: 'bg-gray-800 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: data.message || 'Failed to delete comment.',
              icon: 'error',
              customClass: { popup: 'bg-gray-800 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Error deleting comment. Please try again.',
            icon: 'error',
            customClass: { popup: 'bg-gray-800 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
          });
        }
      }
    });
  }

  return (
    <section className="py-12 sm:py-16 relative z-10 px-4 sm:px-6 bg-gray-900">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-neon-purple dark:text-neon-purple">User Comments</h2>
      <div className="max-w-2xl mx-auto">
        <div id="commentFormContainer" className="mb-8">
          <form id="commentForm" className={hasCommented ? 'hidden' : ''} onSubmit={handleCommentSubmit}>
            <div className="mb-4">
              <label htmlFor="commentName" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="commentName"
                className="mt-1 block w-full px-3 py-2 bg-gray-800 text-white border border-neon-purple rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
                maxLength="50"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="commentMessage" className="block text-sm font-medium text-gray-300">
                Comment
              </label>
              <textarea
                id="commentMessage"
                className="mt-1 block w-full px-3 py-2 bg-gray-800 text-white border border-neon-purple rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
                rows="4"
                maxLength="500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-neon-purple text-white rounded-lg shadow-neon-glow hover:bg-neon-purple-light transition-colors"
            >
              Submit Comment
            </button>
          </form>
          <div id="editCommentForm" className={hasCommented ? '' : 'hidden'}>
            <div className="mb-4">
              <label htmlFor="editCommentName" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="editCommentName"
                className="mt-1 block w-full px-3 py-2 bg-gray-800 text-white border border-neon-purple rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
                maxLength="50"
                required
                defaultValue={userComment?.name || ''}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editCommentMessage" className="block text-sm font-medium text-gray-300">
                Comment
              </label>
              <textarea
                id="editCommentMessage"
                className="mt-1 block w-full px-3 py-2 bg-gray-800 text-white border border-neon-purple rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
                rows="4"
                maxLength="500"
                required
                defaultValue={userComment?.message || ''}
              ></textarea>
            </div>
            <button
              id="submitEditComment"
              onClick={handleEditComment}
              className="px-4 py-2 bg-neon-purple text-white rounded-lg shadow-neon-glow hover:bg-neon-purple-light transition-colors"
            >
              Update Comment
            </button>
          </div>
        </div>
        <div id="commentsList" className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-300 text-center">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.identifier} className="bg-gray-800 p-4 rounded-lg border border-neon-purple-dark">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-neon-purple">{comment.name}</h3>
                  <span className="text-xs text-gray-400">{formatDate(comment.timestamp)}</span>
                </div>
                <p className="text-gray-300">{comment.message}</p>
                {comment.identifier === userIdentifier && (
                  <div className="mt-2 flex space-x-2">
                    <button
                      className="editCommentBtn px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => {
                        document.getElementById('editCommentForm').classList.remove('hidden');
                        document.getElementById('commentForm').classList.add('hidden');
                        window.scrollTo({
                          top: document.getElementById('commentFormContainer').offsetTop,
                          behavior: 'smooth',
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="deleteCommentBtn px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      onClick={handleDeleteComment}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {totalComments > 10 && (
          <div className="mt-4 text-center">
            <button
              className="text-neon-purple hover:underline"
              onClick={() => setIsModalOpen(true)}
            >
              View All Comments
            </button>
          </div>
        )}
      </div>

      {/* Modal for All Comments */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-neon-purple">All Comments</h3>
              <button
                className="text-gray-300 hover:text-white"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {allComments.length === 0 ? (
                <p className="text-gray-300 text-center">No comments available.</p>
              ) : (
                allComments.map((comment) => (
                  <div key={comment.identifier} className="bg-gray-900 p-4 rounded-lg border border-neon-purple-dark">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-neon-purple">{comment.name}</h4>
                      <span className="text-xs text-gray-400">{formatDate(comment.timestamp)}</span>
                    </div>
                    <p className="text-gray-300">{comment.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CommentsSection;