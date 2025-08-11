import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import IconStar from './IconStar.jsx';
import { formatNumber, getClientInfo, showToast } from '../utils';

export default function HeroSection() {
  const [stats, setStats] = useState({ total_downloads: 0, total_ratings: 0, average_rating: 0 });
  const [userRating, setUserRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchStats();
    fetchUserRating();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch('https://myapi.videyhost.my.id/api/?action=get_stats&token=AgungDeveloper', { cache: 'force-cache' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) setStats(data);
      else showToast('Failed to load statistics.', 'error');
    } catch (error) {
      showToast('Error loading statistics. Please try again.', 'error');
    }
  }

  async function fetchUserRating() {
    try {
      const { userAgent } = await getClientInfo();
      const response = await fetch('https://myapi.videyhost.my.id/api/?action=get_user_rating&token=AgungDeveloper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAgent }),
        cache: 'force-cache',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success && data.has_rated) {
        setUserRating(data.rating);
        setSelectedRating(data.rating);
      }
    } catch (error) {
      showToast('Error loading user rating.', 'error');
    }
  }

  async function handleRating(rating) {
    if (userRating !== null) {
      showToast('You have already submitted a rating.', 'info');
      return;
    }

    Swal.fire({
      title: 'Confirm Your Rating',
      text: `Are you sure you want to give ${rating} star${rating > 1 ? 's' : ''} to Neon Injector?`,
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
          const response = await fetch('https://myapi.videyhost.my.id/api/?action=rate&token=AgungDeveloper', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, userAgent }),
          });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (data.success) {
            setStats((prev) => ({
              ...prev,
              total_ratings: data.total_ratings,
              average_rating: data.average_rating,
            }));
            setUserRating(rating);
            setSelectedRating(rating);
            Swal.fire({
              title: 'Success!',
              text: 'Rating submitted successfully!',
              icon: 'success',
              customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: data.message || 'Failed to submit rating.',
              icon: 'error',
              customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Error submitting rating. Please try again.',
            icon: 'error',
            customClass: { popup: 'bg-[var(--bg-color)] text-[var(--text-color)]', confirmButton: 'btn-neon' },
          });
        }
      }
    });
  }

  async function handleDownload() {
    try {
      const { userAgent } = await getClientInfo();
      const response = await fetch('https://myapi.videyhost.my.id/api/?action=download&token=AgungDeveloper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAgent }),
      });
      const data = await response.json();
      if (data.success) {
        setStats((prev) => ({ ...prev, total_downloads: data.total_downloads }));
        showToast('Download recorded successfully!', 'success');
      } else if (data.message === 'This device has already downloaded the app') {
        showToast('You have already downloaded the app.', 'error');
      } else {
        showToast(data.message || 'Failed to record download.', 'error');
      }
    } catch (error) {
      showToast('Error processing download. Please try again.', 'error');
    } finally {
      window.location.href = '/download';
    }
  }

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center text-center relative z-10 container"
      role="region"
      aria-label="Hero section"
    >
      <p className="text-lg sm:text-xl md:text-2xl mt-4 max-w-xl text-[var(--text-color)]">
        The Best Application Injector for Mobile Legends. Experience the ease of using visual skins without any hassle. Works on all Androids.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-xs sm:max-w-md">
        <button
          id="downloadBtn"
          onClick={handleDownload}
          className="btn-neon text-sm sm:text-base"
          aria-label="Download Neon Injector"
        >
          Download
        </button>
        <a
          href="/docs"
          className="px-4 py-2 bg-transparent text-[var(--heading-color)] rounded-lg border-neon hover:bg-neon-purple-dark/20 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-neon-purple"
          aria-label="View documentation"
        >
          View Docs
        </a>
      </div>
      <div className="mt-6 w-full max-w-3xl" itemScope itemType="http://schema.org/SoftwareApplication">
        <meta itemProp="name" content="Neon Injector" />
        <meta itemProp="applicationCategory" content="Tools" />
        <meta itemProp="operatingSystem" content="Android" />
        <meta itemProp="softwareVersion" content="1.3" />
        <meta itemProp="fileSize" content="4.5MB" />
        <meta itemProp="price" content="0" />
        <meta itemProp="priceCurrency" content="USD" />
        <meta itemProp="author" content="Agung Developer" />
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex space-x-2"
            role="radiogroup"
            aria-label="Rate Neon Injector from 1 to 5 stars"
            aria-describedby="rating-instructions"
          >
            <p id="rating-instructions" className="sr-only">
              {userRating !== null
                ? `You have rated Neon Injector ${userRating} star${userRating > 1 ? 's' : ''}.`
                : 'Select a star to rate Neon Injector from 1 to 5.'}
            </p>
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleRating(starValue)}
                  onMouseEnter={() => !userRating && setHoverRating(starValue)}
                  onMouseLeave={() => !userRating && setHoverRating(0)}
                  onFocus={() => !userRating && setHoverRating(starValue)}
                  onBlur={() => !userRating && setHoverRating(0)}
                  disabled={userRating !== null}
                  className={`p-1 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] rounded-sm ${
                    userRating !== null ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                  aria-checked={selectedRating === starValue}
                  role="radio"
                >
                  <IconStar
                    className="w-6 h-6"
                    fill={hoverRating >= starValue || selectedRating >= starValue ? '#facc15' : '#9ca3af'}
                    stroke={hoverRating >= starValue || selectedRating >= starValue ? '#facc15' : '#9ca3af'}
                  />
                </button>
              );
            })}
          </div>
          <div
            className="grid grid-cols-1 text-xs text-[var(--text-color)] w-full"
            itemProp="aggregateRating"
            itemScope
            itemType="http://schema.org/AggregateRating"
          >
            <meta itemProp="ratingValue" content={stats.average_rating ? stats.average_rating.toFixed(1) : '0.0'} />
            <meta itemProp="ratingCount" content={stats.total_ratings || 0} />
            <table className="w-full border-collapse border-neon text-left">
              <caption className="sr-only">Neon Injector application details</caption>
              <thead>
                <tr>
                  <th className="px-3 py-2 font-semibold border-neon" scope="col">Detail</th>
                  <th className="px-3 py-2 font-semibold border-neon" scope="col">Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 flex items-center border-neon">
                    <span className="w-4 h-4 mr-1.5 text-[var(--heading-color)]" aria-hidden="true">ℹ️</span> Total Downloads
                  </td>
                  <td className="px-3 py-2 border-neon">{formatNumber(stats.total_downloads)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border-neon">
                    <span className="w-4 h-4 mr-1.5 text-[var(--heading-color)]" aria-hidden="true">⭐</span> Rating
                  </td>
                  <td className="px-3 py-2 border-neon">
                    <div className="flex items-center flex-wrap gap-1 whitespace-normal">
                      <div
                        className="flex space-x-0.5"
                        id="avgRatingStars"
                        aria-label={`Average rating: ${stats.average_rating ? stats.average_rating.toFixed(1) : '0.0'} stars`}
                      >
                        {[...Array(5)].map((_, i) => (
                          <IconStar
                            key={i}
                            className="w-4 h-4"
                            fill={
                              i < Math.floor(stats.average_rating)
                                ? '#facc15'
                                : i === Math.floor(stats.average_rating) && stats.average_rating % 1 >= 0.5
                                ? 'url(#halfGrad)'
                                : '#9ca3af'
                            }
                            stroke="#9ca3af"
                          >
                            {i === Math.floor(stats.average_rating) && stats.average_rating % 1 >= 0.5 && (
                              <defs>
                                <linearGradient id="halfGrad" x1="0%" x2="100%">
                                  <stop offset="50%" stopColor="#facc15" />
                                  <stop offset="50%" stopColor="#9ca3af" />
                                </linearGradient>
                              </defs>
                            )}
                          </IconStar>
                        ))}
                      </div>
                      <span className="text-left">
                        {stats.average_rating ? stats.average_rating.toFixed(1) : '0.0'} ({formatNumber(stats.total_ratings)} reviews)
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border-neon">
                    <span className="w-4 h-4 mr-1.5 text-[var(--heading-color)]" aria-hidden="true">ℹ️</span> Name
                  </td>
                  <td className="px-3 py-2 border-neon">Neon Injector</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border-neon">
                    <span className="w-4 h-4 mr-1.5 text-[var(--heading-color)]" aria-hidden="true">ℹ️</span> Publisher
                  </td>
                  <td className="px-3 py-2 border-neon">Agung Developer</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border-neon">
                    <span className="w-4 h-4 mr-1.5 text-[var(--heading-color)]" aria-hidden="true">ℹ️</span> Category
                  </td>
                  <td className="px-3 py-2 border-neon">Tools</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border-neon">
                    <span className="w-4 h-4 mr-1.5 text-[var(--heading-color)]" aria-hidden="true">ℹ️</span> Version
                  </td>
                  <td className="px-3 py-2 border-neon">1.3</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border-neon">
                    <span className="w-4 h-4 mr-1.5 text-[var(--heading-color)]" aria-hidden="true">ℹ️</span> Size
                  </td>
                  <td className="px-3 py-2 border-neon">4.5MB</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border-neon">
                    <span className="w-4 h-4 mr-1.5 text-[var(--heading-color)]" aria-hidden="true">ℹ️</span> Package Name
                  </td>
                  <td className="px-3 py-2 border-neon">com.neon.injector</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border-neon">
                    <span className="w-4 h-4 mr-1.5 text-[var(--heading-color)]" aria-hidden="true">ℹ️</span> Price
                  </td>
                  <td className="px-3 py-2 border-neon">Free</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border-neon">
                    <span className="w-4 h-4 mr-1.5 text-[var(--heading-color)]" aria-hidden="true">ℹ️</span> Requires
                  </td>
                  <td className="px-3 py-2 border-neon">Works on All Android</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border-neon">
                    <span className="w-4 h-4 mr-1.5 text-[var(--heading-color)]" aria-hidden="true">ℹ️</span> APK Features
                  </td>
                  <td className="px-3 py-2 border-neon">Unlock All Skin</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}