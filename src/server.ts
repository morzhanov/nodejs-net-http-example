import net, {Server, Socket} from 'net';
import {inspect} from 'util';

import {errorHandler} from './utils';
import {HttpMessage, Methods} from './interface';
import {deleteHandler, getHandler, postHandler, putHandler} from './router';

const parseMessage = (message: Buffer): HttpMessage => {
  const [requestHeader, ...bodyContent] = message.toString().split('\r\n\r\n');

  const [firstLine, ...otherLines] = requestHeader.split('\n');
  const [method, path, httpVersion] = firstLine.trim().split(' ');
  const headers = Object.fromEntries(
    otherLines
      .filter((_) => _)
      .map((line) => line.split(':').map((part) => part.trim()))
      .map(([name, ...rest]) => [name, rest.join(' ')]),
  );

  const request = {
    method,
    path,
    httpVersion,
    headers,
    body: bodyContent.join(''),
  };
  console.log(`Request handled: ${inspect(request)}`);
  return request;
};

const requestHandler = (socket: Socket, data: Buffer) => {
  const {path, method, body} = parseMessage(data);
  if (!path.startsWith('/users')) {
    socket.write('HTTP/1.1 404 Not Found\n\n');
    return socket.end();
  }

  switch (method) {
    case Methods.GET:
      getHandler(socket, path);
      break;
    case Methods.POST:
      postHandler(socket, body);
      break;
    case Methods.DELETE:
      deleteHandler(socket, path);
      break;
    case Methods.PUT:
      putHandler(socket, body, path);
      break;
    default:
      socket.write('HTTP/1.1 404 Not Found\n\n');
      return socket.end();
  }
};

export const createServer = (): Server =>
  net.createServer((socket) => {
    socket.on('data', (data: Buffer) => requestHandler(socket, data));
    socket.on('error', errorHandler);
  });
