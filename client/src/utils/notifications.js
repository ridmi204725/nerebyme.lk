import { getTranslation } from './i18n';

export const getStoredLanguage = () => {
  const value = localStorage.getItem('selectedLanguage') || localStorage.getItem('lang') || 'English';
  if (value === 'EN') return 'English';
  if (value === 'SI') return 'Sinhala';
  if (value === 'TA') return 'Tamil';
  return ['English', 'Sinhala', 'Tamil'].includes(value) ? value : 'English';
};

const COMMON_MESSAGES = {
  'Please log in before submitting a comment.': 'loginBeforeComment',
  'කරුණාකර නම සහ අදහස (Comment) ඇතුළත් කරන්න.': 'commentRequired',
  'ඔබේ විචාරය (Review) සාර්ථකව එකතු කරන ලදී!': 'commentAdded',
  'Review එක යැවීමේදී දෝෂයක් ඇති විය.': 'commentFailed',
  'Link copied to clipboard!': 'linkCopied',
  'Link copied!': 'linkCopied',
  'Unable to copy link.': 'copyFailed',
  'Review එක යැවීමේදී දෝෂයක් ඇති විය.': 'commentFailed',
  'Please login before adding a listing.': 'loginBeforeListing',
  'Submission failed!': 'submissionFailed',
  'An error occurred while retrieving the data.': 'loadFailed',
  'Please enter a valid photo URL.': 'invalidPhotoUrl',
  'A photo was successfully added!': 'photoAdded',
  'The photograph was removed.': 'photoRemoved',
  'Please enter a menu photo URL.': 'invalidMenuPhotoUrl',
  'Menu photo added!': 'menuPhotoAdded',
  'The menu photo was removed.': 'menuPhotoRemoved',
  'Please enter a valid package image URL.': 'invalidPackageUrl',
  'Function / Event package image added!': 'packageAdded',
  'Function / Event package image removed.': 'packageRemoved',
  'Please enter a name.': 'nameRequired',
  'The hotel room package has been added!': 'roomPackageAdded',
  'The item was removed.': 'itemRemoved',
  'The review has been updated.': 'reviewUpdated',
  'The review was removed.': 'reviewRemoved',
  'Details successfully updated!': 'detailsUpdated',
  'New details have been successfully added!': 'detailsAdded',
  'An error occurred during the operation.': 'operationFailed',
  'The record was successfully removed.': 'recordRemoved',
  'An error occurred during deletion.': 'deleteFailed',
  'පුරනය වීම සාර්ථකයි! සාදරයෙන් පිළිගනිමු.': 'loginSuccess',
  'Google හරහා පුරනය වීම සාර්ථකයි!': 'googleLoginSuccess',
  'Facebook හරහා පුරනය වීම සාර්ථකයි!': 'facebookLoginSuccess',
  'Apple Sign-In successful!': 'appleLoginSuccess',
  'ගිණුම තෝරාගැනීම සාර්ථකයි!': 'accountSelected',
  'Review එක යැවීමේදී දෝෂයක් ඇති විය.': 'commentFailed',
  'ඔබේ review එක සාර්ථකව එකතු කරන ලදී!': 'commentAdded',
  'Submission successful! Your listing has been submitted for Admin approval. You earned +1 point!': 'listingSubmitted',
  'Could not save package image': 'packageSaveFailed',
  'Select an approved item and choose an image.': 'selectApprovedImage'
};

export const translateNotification = (text, language = getStoredLanguage()) => {
  const key = COMMON_MESSAGES[String(text || '')];
  const t = getTranslation(language);
  return key && t.notifications?.[key] ? t.notifications[key] : String(text || '');
};

export const notify = (type, text, options = {}) => {
  window.dispatchEvent(new CustomEvent('app-notification', {
    detail: {
      type,
      text,
      key: options.key || COMMON_MESSAGES[String(text || '')] || null,
      duration: options.duration || 3500
    }
  }));
};
