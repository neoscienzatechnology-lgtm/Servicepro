import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    console.log('📅 GET Appointments - User:', req.user?.email, 'Role:', req.user?.role, 'Company:', req.user?.company);
    
    const { status, technician, customer, startDate, endDate } = req.query;
    
    let query: any = {};
    
    // Filter by company - Admin pode ver todos da empresa
    if (req.user?.role === 'admin' && req.user.company) {
      query.company = req.user.company;
    } else if (req.user?.role === 'technician') {
      query.technician = req.user._id;
    } else if (req.user?.role === 'customer') {
      query.customer = req.user._id;
    }

    console.log('📅 Query filter:', JSON.stringify(query));

    // Additional filters
    if (status) query.status = status;
    if (technician) query.technician = technician;
    if (customer) query.customer = customer;
    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) query.scheduledDate.$gte = new Date(startDate as string);
      if (endDate) query.scheduledDate.$lte = new Date(endDate as string);
    }

    // Buscar appointments sem populate primeiro para evitar erros
    console.log('📅 Fetching appointments...');
    const appointments = await Appointment.find(query)
      .sort({ scheduledDate: 1, scheduledStartTime: 1 })
      .lean(); // Usar lean() para retornar objetos JavaScript simples

    console.log('📅 Found appointments:', appointments.length);

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error: any) {
    console.error('❌ Error in getAppointments:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer')
      .populate('technician')
      .populate('service')
      .populate('invoice');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    req.body.company = req.user?.company;

    const appointment = await Appointment.create(req.body);

    // TODO: Send notifications to customer and technician
    // TODO: Add to Google Calendar if integrated

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = async (req: AuthRequest, res: Response) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // TODO: Send notification about update

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    await appointment.deleteOne();

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

// @desc    Check-in to appointment
// @route   POST /api/appointments/:id/checkin
// @access  Private (Technician)
export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const { location, photos } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'in-progress',
        actualStartTime: new Date(),
        checkIn: {
          time: new Date(),
          location,
          photos
        }
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check-out from appointment
// @route   POST /api/appointments/:id/checkout
// @access  Private (Technician)
export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    const { location, photos, customerSignature } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        actualEndTime: new Date(),
        checkOut: {
          time: new Date(),
          location,
          photos,
          customerSignature
        }
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    // TODO: Auto-generate invoice

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel appointment
// @route   POST /api/appointments/:id/cancel
// @access  Private
export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledBy: req.user?._id,
        cancelledAt: new Date()
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    // TODO: Send cancellation notification

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
