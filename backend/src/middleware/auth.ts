import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  console.log('🔐 Auth middleware - Headers:', req.headers.authorization);
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('✅ Token encontrado no header:', token ? `${token.substring(0, 20)}...` : 'NENHUM');
  } else if (req.cookies.token) {
    token = req.cookies.token;
    console.log('✅ Token encontrado no cookie');
  }

  if (!token) {
    console.log('❌ Token não encontrado');
    return res.status(401).json({
      success: false,
      message: 'Não autorizado para acessar esta rota'
    });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log('✅ Token verificado, user ID:', decoded.id);
    req.user = await User.findById(decoded.id);
    console.log('✅ Usuário encontrado:', req.user?.email);
    next();
  } catch (error) {
    console.log('❌ Erro ao verificar token:', error);
    return res.status(401).json({
      success: false,
      message: 'Não autorizado para acessar esta rota'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role de usuário ${req.user?.role} não está autorizado para acessar esta rota`
      });
    }
    next();
  };
};
