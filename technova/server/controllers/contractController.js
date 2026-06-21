import Contract from '../models/Contract.js';
import { generateSignatureRequest } from '../services/esign/docusignService.js';

// @desc    Get all contracts for user
// @route   GET /api/v1/contracts
// @access  Private
export const getMyContracts = async (req, res, next) => {
  try {
    const contracts = await Contract.find({ client: req.user._id })
      .populate('project', 'title status')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: contracts.length,
      data: contracts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contracts (Admin)
// @route   GET /api/v1/contracts/all
// @access  Private/Admin
export const getAllContracts = async (req, res, next) => {
  try {
    const contracts = await Contract.find()
      .populate('project', 'title status')
      .populate('client', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: contracts.length,
      data: contracts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate/Send a contract
// @route   POST /api/v1/contracts
// @access  Private/Admin
export const createAndSendContract = async (req, res, next) => {
  try {
    const { projectId, clientId } = req.body;

    const contract = await Contract.create({
      project: projectId,
      client: clientId,
      status: 'draft',
    });

    // Mock API call to E-signature provider
    const signRequest = await generateSignatureRequest(contract._id, 'mock@email.com', 'Mock Name');
    
    contract.status = 'sent';
    contract.pdfUrl = signRequest.signUrl; // In real life, this is the signing link, not the PDF
    await contract.save();

    res.status(201).json({
      success: true,
      data: contract,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sign contract (Mock webhook endpoint)
// @route   POST /api/v1/contracts/:id/sign
// @access  Private
export const signContract = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      res.status(404);
      throw new Error('Contract not found');
    }

    if (contract.client.toString() !== req.user._id.toString() && req.user.role?.name !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to sign this contract');
    }

    contract.status = 'signed';
    contract.signedAt = new Date();
    await contract.save();

    res.status(200).json({
      success: true,
      data: contract,
    });
  } catch (error) {
    next(error);
  }
};
