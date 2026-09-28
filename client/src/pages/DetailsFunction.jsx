import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import {
  FaArrowLeft,
  FaShareAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRoute,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaTicketAlt,
  FaFacebook,
  FaInstagram,
  FaTripadvisor
} from 'react-icons/fa';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400';

export default function DetailsFunction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [expandedReviews, setExpandedReviews] = useState({});
  const [submittingReview, setSubmittingReview] = useState(false);

  const showNotification = (type, text) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: '', text: '' }), 3500);
  };

  useEffect(() => {
    try {
      const storedName =
        localStorage.getItem('registeredUser') ||
        localStorage.getItem('name') ||
        localStorage.getItem('username') ||
        localStorage.getItem('userName');

      const storedUser = JSON.parse(
        localStorage.getItem('user') ||
        localStorage.getItem('userInfo') ||
        '{}'
      );

      setReviewName(
        storedName ||
          storedUser.name ||
          storedUser.fullName ||
          storedUser.username ||
          ''
      );
    } catch {
      setReviewName('');
    }
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await axios.get(`${API_BASE_URL}/api/admin/items/${id}`);
        const data = res.data?.data || res.data;

        if (!data) {
          setItem(null);
          setError('Function / Event not found.');
          return;
        }

        setItem(data);

        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      } catch (err) {
        console.error('Error fetching function/event details:', err);
        setError('Failed to load Function / Event details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const packageImages = useMemo(() => {
    const source = Array.isArray(item?.packageImages)
      ? item.packageImages
      : [];

    return source
      .map((pkg) => {
        if (typeof pkg === 'string') {
          return { url: pkg, title: 'Package', description: '' };
        }

        return {
          url: pkg?.url || pkg?.image || pkg?.imageUrl || '',
          title: pkg?.title || pkg?.name || 'Package',
          description: pkg?.description || ''
        };
      })
      .filter((pkg) => pkg.url);
  }, [item]);

  const toggleReadMore = (index) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!reviewName.trim() || !reviewComment.trim()) {
      showNotification(
        'error',
        'කරුණාකර නම සහ අදහස (Comment) ඇතුළත් කරන්න.'
      );
      return;
    }

    setSubmittingReview(true);

    const newReview = {
      name: reviewName.trim(),
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    try {
      if (!localStorage.getItem('token')) {
        showNotification('error', 'Please log in before submitting a comment.');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/items/${id}/reviews`,
        newReview,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setReviews(Array.isArray(response.data?.data) ? response.data.data : [newReview, ...reviews]);

      setReviewComment('');
      setReviewRating(5);
      showNotification('success', 'ඔබේ review එක සාර්ථකව එකතු කරන ලදී!');
    } catch (err) {
      console.error('Review submit error:', err);
      showNotification('error', 'Review එක යැවීමේදී දෝෂයක් ඇති විය.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating =
    Number(item?.rating) > 0 ? Number(item.rating).toFixed(1) : '4.8';

  const directionsUrl =
    item?.mapUrl && !item.mapUrl.includes('iframe')
      ? item.mapUrl
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          `${item?.name || ''} ${item?.location || ''}`
        )}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-[#7c3aed] border-t-[#06b6d4] animate-spin" />
          <p className="text-sm text-slate-300">Loading Function / Event...</p>
        </div>
      </div>
    );
  }

  if (!item || error) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center">
          <FaExclamationTriangle className="text-[#06b6d4]" size={24} />
        </div>
        <p className="text-sm text-slate-300">
          {error || 'Function / Event not found.'}
        </p>
        <Link
          to="/functions"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white text-xs font-bold"
        >
          Back to Functions & Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-[#7c3aed] selection:text-white pb-20">
      {message.text && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl border backdrop-blur-xl ${
              message.type === 'error'
                ? 'bg-rose-950/90 border-rose-700'
                : 'bg-emerald-950/90 border-emerald-700'
            }`}
          >
            {message.type === 'error' ? (
              <FaExclamationTriangle size={16} />
            ) : (
              <FaCheckCircle size={16} />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition"
        >
          <FaArrowLeft size={12} />
          Back
        </button>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard
              ?.writeText(window.location.href)
              .then(() => showNotification('success', 'Link copied!'))
              .catch(() => showNotification('error', 'Unable to copy link.'));
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition"
        >
          <FaShareAlt size={12} />
          Share
        </button>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative h-[380px] sm:h-[480px] md:h-[540px] rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl">
          <img
            src={item.image || FALLBACK_IMAGE}
            alt={item.name || item.title || 'Function / Event'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/45 to-black/20" />

          <div className="absolute left-5 right-5 sm:left-9 sm:right-9 md:left-12 md:right-12 bottom-8">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/50 text-[#c4b5fd] text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
              {item.subCategory || item.category || 'Function & Event'}
            </span>

            <h1 className="mt-3 text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
              {item.name || item.title}
            </h1>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-slate-200">
              {(item.location || item.district) && (
                <span className="inline-flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#06b6d4]" />
                  {item.location}
                  {item.district ? `, ${item.district}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick information */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#06b6d4] font-bold">
                Quick Information
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7c3aed]/15 border border-[#7c3aed]/30">
                <FaStar className="text-amber-400" size={13} />
                <span className="text-xs font-bold text-white">
                  {averageRating} / 5
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <InfoCard
                icon={<FaPhoneAlt />}
                label="Contact"
                value={item.contact || 'Contact venue'}
                href={item.contact ? `tel:${item.contact}` : undefined}
              />
              <InfoCard
                icon={<FaCalendarAlt />}
                label="Event Date"
                value={item.eventDate || item.date || 'Contact for date'}
              />
              <InfoCard
                icon={<FaClock />}
                label="Event Time"
                value={item.eventTime || item.time || 'Contact for time'}
              />
              <InfoCard
                icon={<FaUsers />}
                label="Capacity"
                value={item.capacity || 'Capacity not specified'}
              />
            </div>

            <div className="mt-4">
              <InfoCard
                icon={<FaTicketAlt />}
                label="Price / Package Rate"
                value={item.price || item.ticketPrice || 'Contact for price'}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 sm:p-6 shadow-xl flex flex-col gap-4">
            <div className="h-40 sm:h-48 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              {item.mapUrl ? (
                <iframe
                  title="Function / Event Map Preview"
                  src={
                    item.mapUrl.includes('iframe')
                      ? item.mapUrl.match(/src="([^"]+)"/)?.[1] || item.mapUrl
                      : item.mapUrl
                  }
                  className="w-full h-full border-0 pointer-events-none"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 text-center px-5">
                  Map preview not configured
                </div>
              )}
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:opacity-90 text-white text-xs font-bold shadow-lg transition"
            >
              <FaRoute size={14} />
              Get Directions / View Map
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 py-12 border-y border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#06b6d4] font-bold">
              The Event
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">
              About this Function / Event
            </h2>
          </div>
          <div>
            <p className="text-sm text-slate-300 leading-7 whitespace-pre-line">
              {item.aboutUs ||
                item.description ||
                'No additional description has been added for this Function / Event yet.'}
            </p>
          </div>
        </div>
      </section>

      {/* Packages */}
      {packageImages.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#06b6d4] font-bold">
              Packages
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">
              Function & Event Packages
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Packages and promotional images are managed by the admin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packageImages.map((pkg, index) => (
              <article
                key={`${pkg.url}-${index}`}
                className="overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl hover:border-[#7c3aed]/50 transition"
              >
                <div className="bg-slate-950 p-2">
                  <img
                    src={pkg.url}
                    alt={pkg.title}
                    className="w-full h-60 object-cover rounded-2xl"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-white">
                    {pkg.title}
                  </h3>
                  {pkg.description && (
                    <p className="mt-2 text-xs text-slate-400 leading-6">
                      {pkg.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Social links */}
      {(item.facebookUrl || item.instagramUrl || item.tripadvisorUrl) && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-12">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {item.facebookUrl && (
              <SocialLink
                href={item.facebookUrl}
                icon={<FaFacebook />}
                title="Facebook Page"
                subtitle="Connect with us"
                iconClass="text-blue-400 bg-blue-500/10"
              />
            )}
            {item.instagramUrl && (
              <SocialLink
                href={item.instagramUrl}
                icon={<FaInstagram />}
                title="Instagram Profile"
                subtitle="Follow photos"
                iconClass="text-pink-400 bg-pink-500/10"
              />
            )}
            {item.tripadvisorUrl && (
              <SocialLink
                href={item.tripadvisorUrl}
                icon={<FaTripadvisor />}
                title="TripAdvisor Listing"
                subtitle="Read reviews"
                iconClass="text-emerald-400 bg-emerald-500/10"
              />
            )}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#06b6d4] font-bold">
            Guest Notes
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black">
            What guests remember.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length > 0 ? (
            reviews.map((review, index) => {
              const name = review.name || 'Guest';
              const comment = review.comment || review.review || '';
              const expanded = expandedReviews[index];
              const longText = comment.length > 120;

              return (
                <article
                  key={review.id || index}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center font-black">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{name}</h3>
                      <p className="text-[11px] text-slate-500">
                        {review.date || 'Recent'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={14}
                        className={
                          star <= Number(review.rating || 5)
                            ? 'text-amber-400'
                            : 'text-slate-700'
                        }
                      />
                    ))}
                  </div>

                  <p className="mt-4 text-sm text-slate-300 leading-7">
                    {longText && !expanded
                      ? `${comment.substring(0, 120)}...`
                      : comment}
                  </p>

                  {longText && (
                    <button
                      type="button"
                      onClick={() => toggleReadMore(index)}
                      className="mt-2 text-xs font-bold text-[#06b6d4] hover:text-[#c4b5fd]"
                    >
                      {expanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </article>
              );
            })
          ) : (
            <div className="md:col-span-2 text-center py-10 text-sm text-slate-500">
              No reviews available yet. Be the first to share your experience!
            </div>
          )}
        </div>
      </section>

      {/* Review form */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#06b6d4] font-bold">
                Your Experience
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black">
                Visited this place?
              </h2>
              <p className="mt-3 text-sm text-slate-400 leading-7">
                Leave a review to help other people discover this Function /
                Event.
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <input
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7c3aed]"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <FaStar
                        size={20}
                        className={
                          star <= reviewRating
                            ? 'text-amber-400'
                            : 'text-slate-700'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows="5"
                placeholder="Write your experience..."
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7c3aed] resize-none"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold transition"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, label, value, href }) {
  const content = (
    <>
      <div className="p-2.5 rounded-xl bg-[#7c3aed]/15 text-[#06b6d4]">
        {icon}
      </div>
      <div className="min-w-0">
        <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold">
          {label}
        </span>
        <span className="block mt-1 text-xs font-bold text-white break-words">
          {value}
        </span>
      </div>
    </>
  );

  return href ? (
    <a
      href={href}
      className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 hover:border-[#7c3aed]/50 transition"
    >
      {content}
    </a>
  ) : (
    <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
      {content}
    </div>
  );
}

function SocialLink({ href, icon, title, subtitle, iconClass }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 shrink-0 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-5 py-3 rounded-2xl transition"
    >
      <div className={`p-2.5 rounded-xl ${iconClass}`}>{icon}</div>
      <div>
        <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold">
          {subtitle}
        </span>
        <span className="block text-xs font-bold text-white mt-0.5">
          {title}
        </span>
      </div>
    </a>
  );
}
