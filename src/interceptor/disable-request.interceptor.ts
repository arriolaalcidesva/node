import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DisableRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const disableHeader = request.headers['disable-request'];

    if (disableHeader === 'true') {
      return new Observable(observer => {
        observer.next({ 
            status: 503,
            message: 'El sitio está en mantenimiento.' });
        observer.complete();
      });
    }

    return next.handle();
  }
}
