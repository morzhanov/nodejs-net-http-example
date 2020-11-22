import {Socket} from 'net';
import {inspect} from 'util';

import {add, findAll, findOne, remove, update} from './db';

const parseBody = (body: string): any => {
  try {
    return JSON.parse(body);
  } catch (err: any) {
    console.log(`Error during JSON body parsing: ${err.message}`);
  }
};

const handleError = (err: any, socket: Socket): void => {
  console.log(`An error occurred: ${inspect(err)}`);
  socket.write(`HTTP/1.1 400 Bad Request\n\n${err.message}`);
  socket.end();
};

export const postHandler = async (socket: Socket, bodyContent: string): Promise<void> => {
  const body = parseBody(bodyContent);
  if (!body) {
    socket.write('HTTP/1.1 400 Bad Request\n\nEmpty or not valid body');
    return socket.end();
  }

  try {
    await add(body);
  } catch (err: any) {
    return handleError(err, socket);
  }

  socket.write(`HTTP/1.1 201 Created\n\nRecord successfully created`);
  socket.end();
};

export const getHandler = async (socket: Socket, path: string): Promise<void> => {
  if (path === '/users') {
    getAllHandler(socket);
  } else {
    getOneHandler(socket, path);
  }
};

const getAllHandler = async (socket: Socket): Promise<void> => {
  try {
    const res = await findAll();
    const json = JSON.stringify(res);
    socket.write(`HTTP/1.1 200 OK\n\n${json}`);
    socket.end();
  } catch (err: any) {
    return handleError(err, socket);
  }
};

const getOneHandler = async (socket: Socket, path: string): Promise<void> => {
  try {
    const id = path.substr(7);
    const res = await findOne(id);
    const json = JSON.stringify(res);
    socket.write(`HTTP/1.1 200 OK\n\n${json}`);
    socket.end();
  } catch (err: any) {
    return handleError(err, socket);
  }
};

export const deleteHandler = async (socket: Socket, path: string): Promise<void> => {
  try {
    const id = path.substr(7);
    await remove(id);
    socket.write(`HTTP/1.1 200 OK\n\nRecord successfully deleted`);
    socket.end();
  } catch (err: any) {
    return handleError(err, socket);
  }
};

export const putHandler = async (
  socket: Socket,
  bodyContent: string,
  path: string,
): Promise<void> => {
  const body = parseBody(bodyContent);
  if (!body) {
    socket.write('HTTP/1.1 400 Bad Request\n\nEmpty or not valid body');
    return socket.end();
  }

  try {
    const id = path.substr(7);
    await update(id, body);
    socket.write(`HTTP/1.1 200 OK\n\nRecord successfully updated`);
    socket.end();
  } catch (err: any) {
    return handleError(err, socket);
  }
};
