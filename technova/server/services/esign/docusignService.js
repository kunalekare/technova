import crypto from 'crypto';

/**
 * Mock DocuSign Service
 * Generates mock signature requests and URLs
 */
export const generateSignatureRequest = async (contractId, clientEmail, clientName) => {
  // In a real app, this would make an API call to DocuSign/Zoho Sign
  // to create an envelope and return a signing URL.
  
  const mockToken = crypto.randomBytes(16).toString('hex');
  
  return {
    success: true,
    envelopeId: `mock_env_${crypto.randomBytes(8).toString('hex')}`,
    signUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/sign-mock/${contractId}?token=${mockToken}`,
    status: 'sent',
  };
};

export const checkSignatureStatus = async (envelopeId) => {
  // In a real app, we'd poll DocuSign or rely on Webhooks
  return {
    status: 'signed',
    signedAt: new Date(),
  };
};
