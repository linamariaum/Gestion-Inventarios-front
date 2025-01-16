import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Options {
  headers?: HttpHeaders;
  params?: HttpParams;
}

@Injectable()
export class HttpService {
  private readonly CONTENT_TYPE_HEADER = 'Content-Type';
  private readonly TYPE_JSON = 'application/json';
  private readonly TYPE_FORM_DATA = 'application/x-www-form-urlencoded';

  constructor(protected http: HttpClient) { }

  protected createDefaultOptions(): Options {
    return {
      headers: new HttpHeaders()
        .set(this.CONTENT_TYPE_HEADER, this.TYPE_JSON)
        .set('Accept', '*/*')
    };
  }

  protected optsName(name: string): Options {
    const newopts = this.createDefaultOptions();
    newopts.headers?.set('xhr-name', name);
    return newopts;
  }

  protected createOptions(opts?: Options): Options {
    const defaultOpts: Options = this.createDefaultOptions();
    if (opts) {
      opts = {
        params: opts.params || defaultOpts.params,
        headers: opts.headers || defaultOpts.headers
      };
      if (!opts.headers?.get(this.CONTENT_TYPE_HEADER)) {
        opts.headers?.set(this.CONTENT_TYPE_HEADER, this.TYPE_JSON);
      }
    }
    return opts || defaultOpts;
  }

  optsWithParams(params: any): Options {
    const newopts = this.createDefaultOptions();
    newopts.params = params;
    return newopts;
  }

  protected doGet<T>(serviceUrl: string, opts?: Options): Observable<T> {
    const ropts = this.createOptions(opts);

    return this.http.get(serviceUrl, ropts).pipe(
      map(response => response as T)
    );
  }

  protected doGetParameters<T>(serviceUrl: string, parametros: HttpParams, opts?: Options): Observable<T> {
    const ropts = this.createOptions(opts);
    const options = parametros !== null ? {
      headers: ropts.headers,
      params: parametros
    } : ropts;

    return this.http.get(serviceUrl, options).pipe(
      map(response => response as T)
    );
  }

  protected doPost<T, R>(serviceUrl: string, body: T, opts?: Options, formData = false): Observable<R> {
    if (formData) {
      opts = {
        headers: new HttpHeaders()
          .set(this.CONTENT_TYPE_HEADER, this.TYPE_FORM_DATA)
          .set('Accept', '*/*')
      }  
    }
    const ropts = this.createOptions(opts);

    return this.http.post(serviceUrl, body, ropts).pipe(
      map(response => response as R)
    );
  }

  protected doPut<T, R>(serviceUrl: string, body: T, opts?: Options): Observable<R> {
    const ropts = this.createOptions(opts);

    return this.http.put(serviceUrl, body, ropts).pipe(
      map(response => response as R)
    );
  }

  protected doPatch<T, R>(serviceUrl: string, body: T, opts?: Options): Observable<R> {
    const ropts = this.createOptions(opts);

    return this.http.patch(serviceUrl, body, ropts).pipe(
        map(response => response as R)
    );
  }
}
