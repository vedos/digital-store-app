import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggingService } from './logging.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            if (err.status === 401) {
                // auto logout if 401 response returned from api
                //location.reload(true);
            }

            const logger = this.injector.get(LoggingService);
            logger.logError(err);

            //const error = err.error.error || err.statusText;
            return throwError(() => new Error(err));
        }))
    }
}