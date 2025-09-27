import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config';

const COLLECTION_NAME = 'partner_applications';

/**
 * Save a partner application to Firestore with custom ID pattern: company_date_time
 * @param {Object} data Partner application form data
 * @returns {Promise<{success:boolean, docId?:string, error?:string}>}
 */
export const savePartnerApplication = async (data) => {
  try {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const base = (data.companyName || 'company')
      .replace(/\s+/g, '_')
      .toLowerCase();
    const docId = `${base}_${dateStr}_${timeStr}`;

    await setDoc(doc(db, COLLECTION_NAME, docId), {
      ...data,
      createdAt: now.toISOString(),
      timestamp: now,
    });

    return { success: true, docId };
  } catch (error) {
    console.error('Error saving partner application:', error);
    return { success: false, error: error.message };
  }
};

export default savePartnerApplication;
