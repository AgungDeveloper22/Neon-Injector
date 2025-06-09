import { useState, useEffect } from 'react';
import { formatNumber, getClientInfo, showToast } from '../utils';
import Swal from 'sweetalert2';
import IconStar from './IconStar.jsx';

const HeroSection = () => {
  const [stats, setStats] = useState({ total_downloads: 0, total_ratings: 0, average_rating: 0 });
  const [userRating, setUserRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    fetchStats();
    fetchUserRating();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch('https://myapi.videyhost.my.id/api/?action=get_stats&token=AgungDeveloper');
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
    Swal.fire({
      title: 'Confirm Your Rating',
      text: `Are you sure you want to give ${rating} star${rating > 1 ? 's' : ''} to Neon Injector?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-gray-900 text-white',
        confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg',
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
              customClass: { popup: 'bg-gray-900 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: data.message || 'Failed to submit rating.',
              icon: 'error',
              customClass: { popup: 'bg-gray-900 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Error submitting rating. Please try again.',
            icon: 'error',
            customClass: { popup: 'bg-gray-900 text-white', confirmButton: 'bg-neon-purple text-white px-4 py-2 rounded-lg' },
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
    <section className="min-h-screen flex flex-col items-center justify-center text-center relative z-10 px-4 sm:px-6">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neon-purple dark:text-neon-purple">
        Neon <span className="text-neon-purple-light dark:text-neon-purple-light">Injector</span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl mt-4 max-w-xl text-gray-300 dark:text-gray-300">
        The Best Application Injector for Mobile Legends. Experience the ease of using visual skins without any hassle. Works on all Androids.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-xs sm:max-w-md">
        <button
          id="downloadBtn"
          onClick={handleDownload}
          className="px-4 py-2 bg-neon-purple text-white dark:text-white rounded-lg shadow-neon-glow hover:bg-neon-purple-light transition-colors text-sm sm:text-base"
        >
          Download
        </button>
        <a
          href="/docs"
          className="px-4 py-2 bg-transparent text-neon-purple dark:text-neon-purple rounded-lg border border-neon-purple hover:bg-neon-purple-dark dark:hover:bg-transparent transition-colors text-sm sm:text-base"
        >
          View Docs
        </a>
      </div>
      <div className="mt-6 w-full max-w-3xl" itemScope itemType="http://schema.org/SoftwareApplication">
        <meta itemProp="name" content="Neon Injector" />
        <meta itemProp="applicationCategory" content="Tools" />
        <meta itemProp="operatingSystem" content="Android" />
        <meta itemProp="softwareVersion" content="1.0" />
        <meta itemProp="fileSize" content="8MB" />
        <meta itemProp="price" content="0" />
        <meta itemProp="priceCurrency" content="USD" />
        <meta itemProp="author" content="Agung Developer" />
        <div className="grid grid-cols-1 text-xs text-gray-300 dark:text-gray-300">
          <div itemProp="aggregateRating" itemScope itemType="http://schema.org/AggregateRating">
            <meta itemProp="ratingValue" content={stats.average_rating ? stats.average_rating.toFixed(1) : '0.0'} />
            <meta itemProp="ratingCount" content={stats.total_ratings || 0} />
            <table className="w-full border-collapse border border-neon-purple-dark text-left">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-neon-purple dark:text-neon-purple font-semibold border border-neon-purple-dark">
                    Detail
                  </th>
                  <th className="px-3 py-2 text-neon-purple dark:text-neon-purple font-semibold border border-neon-purple-dark">
                    Information
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 flex items-center border border-neon-purple-dark">
                    <span className="w-4 h-4 mr-1.5 text-neon-purple">ℹ️</span> Total Downloads
                  </td>
                  <td className="px-3 py-2 border border-neon-purple-dark">{formatNumber(stats.total_downloads)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border border-neon-purple-dark">
                    <span className="w-4 h-4 mr-1.5 text-neon-purple">⭐</span> Rating
                  </td>
                  <td className="px-3 py-2 border border-neon-purple-dark">
                    <div className="flex items-center flex-wrap gap-1 whitespace-normal">
                      <div className="flex space-x-0.5" id="avgRatingStars" aria-label="Average rating">
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
                  <td className="px-3 py-2 flex items-center border border-neon-purple-dark">
                    <span className="w-4 h-4 mr-1.5 text-neon-purple">ℹ️</span> Name
                  </td>
                  <td className="px-3 py-2 border border-neon-purple-dark">Neon Injector</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border border-neon-purple-dark">
                    <span className="w-4 h-4 mr-1.5 text-neon-purple">ℹ️</span> Publisher
                  </td>
                  <td className="px-3 py-2 border border-neon-purple-dark">Agung Developer</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border border-neon-purple-dark">
                    <span className="w-4 h-4 mr-1.5 text-neon-purple">ℹ️</span> Category
                  </td>
                  <td className="px-3 py-2 border border-neon-purple-dark">Tools</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border border-neon-purple-dark">
                    <span className="w-4 h-4 mr-1.5 text-neon-purple">ℹ️</span> Version
                  </td>
                  <td className="px-3 py-2 border border-neon-purple-dark">1.0</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border border-neon-purple-dark">
                    <span className="w-4 h-4 mr-1.5 text-neon-purple">ℹ️</span> Size
                  </td>
                  <td className="px-3 py-2 border border-neon-purple-dark">8MB</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border border-neon-purple-dark">
                    <span className="w-4 h-4 mr-1.5 text-neon-purple">ℹ️</span> Package Name
                  </td>
                  <td className="px-3 py-2 border border-neon-purple-dark">com.neon.injector</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border border-neon-purple-dark">
                    <span className="w-4 h-4 mr-1.5 text-neon-purple">ℹ️</span> Price
                  </td>
                  <td className="px-3 py-2 border border-neon-purple-dark">Free</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border border-neon-purple-dark">
                    <span className="w-4 h-4 mr-1.5 text-neon-purple">ℹ️</span> Requires
                  </td>
                  <td className="px-3 py-2 border border-neon-purple-dark">Works on All Android</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 flex items-center border border-neon-purple-dark">
                    <span className="w-4 h-4 mr-1.5 text-neon-purple">ℹ️</span> APK Features
                  </td>
                  <td className="px-3 py-2 border border-neon-purple-dark">Unlock All Skin</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;