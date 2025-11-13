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
    console.log('👥 GET Customers - User:', req.user?.email, 'Role:', req.user?.role, 'Company:', req.user?.company);
    
    const { status, tags, search } = req.query;
    
    let query: any = {};
    
    // Só filtrar por company se existir
    if (req.user?.company) {
      query.company = req.user.company;
    }

    if (status) query.status = status;
    if (tags) query.tags = { $in: (tags as string).split(',') };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('👥 Query filter:', JSON.stringify(query));

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .lean(); // Usar lean() para retornar objetos simples

    console.log('👥 Found customers:', customers.length);

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error: any) {
    console.error('❌ Error in getCustomers:', error);
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
