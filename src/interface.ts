export enum Methods {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export interface HttpMessage {
  path: string;
  method: string;
  httpVersion: string;
  headers: {[k: string]: string};
  body: string;
}

export interface User {
  id: string;
  name: string;
}
