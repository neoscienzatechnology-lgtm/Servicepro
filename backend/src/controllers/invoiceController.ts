import { Request, Response } from 'express';
import Invoice from '../models/Invoice';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
export const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    console.log('💰 GET Invoices - User:', req.user?.email, 'Role:', req.user?.role, 'Company:', req.user?.company);
    
    const { status, customer, startDate, endDate } = req.query;
    
    let query: any = {};
    
    // Só filtrar por company se existir
    if (req.user?.company) {
      query.company = req.user.company;
    }

    if (status) query.status = status;
    if (customer) query.customer = customer;
    if (startDate || endDate) {
      query.issueDate = {};
      if (startDate) query.issueDate.$gte = new Date(startDate as string);
      if (endDate) query.issueDate.$lte = new Date(endDate as string);
    }

    console.log('💰 Query filter:', JSON.stringify(query));

    const invoices = await Invoice.find(query)
      .sort({ issueDate: -1 })
      .lean(); // Usar lean() para retornar objetos simples

    console.log('💰 Found invoices:', invoices.length);

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error: any) {
    console.error('❌ Error in getInvoices:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
export const getInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('appointment')
      .populate('createdBy', 'firstName lastName');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Fatura não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
export const createInvoice = async (req: AuthRequest, res: Response) => {
  try {
    req.body.company = req.user?.company;
    req.body.createdBy = req.user?._id;

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;

    req.body.items.forEach((item: any) => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemTax = itemTotal * (item.taxRate / 100);
      const itemDiscount = item.discount || 0;
      
      item.total = itemTotal + itemTax - itemDiscount;
      subtotal += itemTotal;
      taxAmount += itemTax;
    });

    req.body.subtotal = subtotal;
    req.body.taxAmount = taxAmount;
    req.body.total = subtotal + taxAmount - (req.body.discountAmount || 0);
    req.body.amountDue = req.body.total;

    const invoice = await Invoice.create(req.body);

    // TODO: Send invoice email to customer

    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
export const updateInvoice = async (req: AuthRequest, res: Response) => {
  try {
    let invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Fatura não encontrada'
      });
    }

    // Recalculate totals if items changed
    if (req.body.items) {
      let subtotal = 0;
      let taxAmount = 0;

      req.body.items.forEach((item: any) => {
        const itemTotal = item.quantity * item.unitPrice;
        const itemTax = itemTotal * (item.taxRate / 100);
        const itemDiscount = item.discount || 0;
        
        item.total = itemTotal + itemTax - itemDiscount;
        subtotal += itemTotal;
        taxAmount += itemTax;
      });

      req.body.subtotal = subtotal;
      req.body.taxAmount = taxAmount;
      req.body.total = subtotal + taxAmount - (req.body.discountAmount || 0);
      req.body.amountDue = req.body.total - invoice.amountPaid;
    }

    invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
export const deleteInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Fatura não encontrada'
      });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível deletar uma fatura paga'
      });
    }

    await invoice.deleteOne();

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

// @desc    Add payment to invoice
// @route   POST /api/invoices/:id/payments
// @access  Private
export const addPayment = async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Fatura não encontrada'
      });
    }

    invoice.payments.push(req.body);
    invoice.amountPaid += req.body.amount;
    invoice.amountDue = invoice.total - invoice.amountPaid;

    if (invoice.amountDue <= 0) {
      invoice.status = 'paid';
    } else if (invoice.amountPaid > 0) {
      invoice.status = 'partial';
    }

    await invoice.save();

    // TODO: Send payment confirmation email

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send invoice reminder
// @route   POST /api/invoices/:id/remind
// @access  Private
export const sendReminder = async (req: AuthRequest, res: Response) => {
  try {
    const { method } = req.body; // 'email' or 'sms'

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Fatura não encontrada'
      });
    }

    invoice.reminders.push({
      sentAt: new Date(),
      method
    });

    await invoice.save();

    // TODO: Send actual reminder via email or SMS

    res.status(200).json({
      success: true,
      message: 'Lembrete enviado com sucesso'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
