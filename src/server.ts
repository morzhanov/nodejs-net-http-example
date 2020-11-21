// http://tnickel.de/2020/03/29/2020-03-nodejs-http-server-using-the-net-module/
// https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module

import net, {Server, Socket} from 'net';
import {inspect} from 'util';

import {errorHandler} from './utils';
import {Methods} from './interface';
import {deleteHandler, getHandler, postHandler, putHandler} from './router';

const requestHandler = (socket: Socket, data: Buffer) => {
  console.log(data.toString());
  const [requestHeader, ...bodyContent] = data.toString().split('\r\n\r\n');

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
  };
  console.log(`Request handled: ${inspect(request)}`);

  if (!path.startsWith('/users')) {
    socket.write('HTTP/1.1 404 Not Found\n\n');
    return socket.end();
  }

  switch (method) {
    case Methods.GET:
      getHandler(socket, path);
      break;
    case Methods.POST:
      postHandler(socket, bodyContent.join(''));
      break;
    case Methods.DELETE:
      deleteHandler(socket, path);
      break;
    case Methods.PUT:
      putHandler(socket, bodyContent.join(''), path);
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
