import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { formatDate, getClientInfo, showToast, generateIdentifier } from '../utils';

export default function CommentsSection() {
  const [hasCommented, setHasCommented] = useState(false);
  const [userComment, setUserComment] = useState(null);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [userIdentifier, setUserIdentifier] = useState('');
  const [lastCommentsHash, setLastCommentsHash] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('#commentsSection');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

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
  }, [isVisible]);

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
        customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
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
        popup: 'bg-[var(--bg-color)] text-[var(--text-color)]',
        confirmButton: 'btn-neon',
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
              customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: data.message || 'Failed to submit comment.',
              icon: 'error',
              customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Error submitting comment. Please try again.',
            icon: 'error',
            customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
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
        customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
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
        popup: 'bg-[var(--bg-color)] text-[var(--text-color)]',
        confirmButton: 'btn-neon',
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
              customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: data.message || 'Failed to update comment.',
              icon: 'error',
              customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Error updating comment. Please try again.',
            icon: 'error',
            customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
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
        popup: 'bg-[var(--bg-color)] text-[var(--text-color)]',
        confirmButton: 'btn-neon',
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
              customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: data.message || 'Failed to delete comment.',
              icon: 'error',
              customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Error deleting comment. Please try again.',
            icon: 'error',
            customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
            });
        }
      }
    });
  }

  if (!isVisible) {
    return <div id="commentsSection" className="h-96"></div>;
  }

  return (
    <section id="commentsSection" className="py-12 sm:py-16 relative z-10 container bg-[var(--bg-color)]">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">User Comments</h2>
      <div className="max-w-2xl mx-auto">
        <div id="commentFormContainer" className="mb-8">
          <form id="commentForm" className={hasCommented ? 'hidden' : ''} onSubmit={handleCommentSubmit}>
            <div className="mb-4">
              <label htmlFor="commentName" className="block text-sm font-medium text-[var(--text-color)]">
                Name
              </label>
              <input
                type="text"
                id="commentName"
                className="mt-1 block w-full px-3 py-2 bg-[var(--bg-color)] text-[var(--text-color)] border-neon rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
                maxLength="50"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="commentMessage" className="block text-sm font-medium text-[var(--text-color)]">
                Comment
              </label>
              <textarea
                id="commentMessage"
                className="mt-1 block w-full px-3 py-2 bg-[var(--bg-color)] text-[var(--text-color)] border-neon rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
                rows="4"
                maxLength="500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn-neon"
            >
              Submit Comment
            </button>
          </form>
          <div id="editCommentForm" className={hasCommented ? '' : 'hidden'}>
            <div className="mb-4">
              <label htmlFor="editCommentName" className="block text-sm font-medium text-[var(--text-color)]">
                Name
              </label>
              <input
                type="text"
                id="editCommentName"
                className="mt-1 block w-full px-3 py-2 bg-[var(--bg-color)] text-[var(--text-color)] border-neon rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
                maxLength="50"
                required
                defaultValue={userComment?.name || ''}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editCommentMessage" className="block text-sm font-medium text-[var(--text-color)]">
                Comment
              </label>
              <textarea
                id="editCommentMessage"
                className="mt-1 block w-full px-3 py-2 bg-[var(--bg-color)] text-[var(--text-color)] border-neon rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
                rows="4"
                maxLength="500"
                required
                defaultValue={userComment?.message || ''}
              ></textarea>
            </div>
            <button
              id="submitEditComment"
              onClick={handleEditComment}
              className="btn-neon"
            >
              Update Comment
            </button>
          </div>
        </div>
        <div id="commentsList" className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-[var(--text-color)] text-center">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.identifier} className="bg-[var(--bg-color)] p-4 rounded-lg border-neon">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{comment.name}</h3>
                  <span className="text-xs text-[var(--text-color)]">{formatDate(comment.timestamp)}</span>
                </div>
                <p className="text-[var(--text-color)]">{comment.message}</p>
                {comment.identifier === userIdentifier && (
                  <div className="mt-2 flex space-x-2">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
                      className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
              className="text-[var(--heading-color)] hover:underline"
              onClick={() => setIsModalOpen(true)}
            >
              View All Comments
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-color)] rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">All Comments</h3>
              <button
                className="text-[var(--text-color)] hover:text-neon-purple-light"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {allComments.length === 0 ? (
                <p className="text-[var(--text-color)] text-center">No comments available.</p>
              ) : (
                allComments.map((comment) => (
                  <div key={comment.identifier} className="bg-[var(--bg-color)] p-4 rounded-lg border-neon">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold">{comment.name}</h4>
                      <span className="text-xs text-[var(--text-color)]">{formatDate(comment.timestamp)}</span>
                    </div>
                    <p className="text-[var(--text-color)]">{comment.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}