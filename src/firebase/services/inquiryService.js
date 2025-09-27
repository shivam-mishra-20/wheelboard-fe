import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../config';

const COLLECTION_NAME = 'inquiries';

/**
 * Saves an inquiry to Firestore with document ID format: name_date
 * @param {Object} inquiryData - The inquiry data (name, email, etc.)
 * @returns {Promise} - Promise that resolves when the inquiry is saved
 */
export const saveInquiry = async (inquiryData) => {
  try {
    const { name } = inquiryData;

    // Format the current date as YYYYMMDD
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

    // Create document ID in format name_date
    const docId = `${name.replace(/\s+/g, '_').toLowerCase()}_${dateStr}`;

    // Add timestamp to the inquiry data
    const dataWithTimestamp = {
      ...inquiryData,
      createdAt: now.toISOString(),
      timestamp: now,
    };

    // Reference to the document with our custom ID
    const inquiryRef = doc(db, COLLECTION_NAME, docId);

    // Set the document data
    await setDoc(inquiryRef, dataWithTimestamp);

    return { success: true, docId };
  } catch (error) {
    console.error('Error saving inquiry:', error);
    return { success: false, error: error.message };
  }
};
