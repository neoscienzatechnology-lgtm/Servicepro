import { Request, Response } from 'express';
import Customer from '../models/Customer';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
export const getCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const { status, tags, search } = req.query;
    
    let query: any = { company: req.user?.company };

    if (status) query.status = status;
    if (tags) query.tags = { $in: (tags as string).split(',') };
    if (search) {
      query.$or = [
        { 'user.firstName': { $regex: search, $options: 'i' } },
        { 'user.lastName': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query)
      .populate('user', 'firstName lastName email phone avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
export const getCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('user')
      .populate('preferences.preferredTechnician');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = async (req: AuthRequest, res: Response) => {
  try {
    req.body.company = req.user?.company;

    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = async (req: AuthRequest, res: Response) => {
  try {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    await customer.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add address to customer
// @route   POST /api/customers/:id/addresses
// @access  Private
export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    customer.addresses.push(req.body);
    await customer.save();

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
