import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

/**
 * Global exception filter sederhana untuk menyeragamkan bentuk error:
 * { message: string, success: false, data: null }
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<{ url?: string; originalUrl?: string }>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Terjadi kesalahan pada server';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') message = response;
      else if (response && typeof response === 'object') {
        const msgField = (response as Record<string, unknown>).message;
        if (Array.isArray(msgField)) message = msgField.join(', ');
        else if (typeof msgField === 'string') message = msgField;
        else message = exception.message;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      // Bisa diubah untuk tidak menampilkan pesan asli (keamanan)
      message = exception.message;
    }

    res.status(status).json({
      message,
      success: false,
      data: null,
      path: req.originalUrl || req.url || '',
      timestamp: new Date().toISOString(),
    });
  }
}
