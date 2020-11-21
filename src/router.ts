import {Socket} from 'net';

const parseBody = (body: string): any => {
  try {
    body = JSON.parse(body);
  } catch (err: any) {
    console.log(`Error during JSON body parsing: ${err.message}`);
  }
};

export const postHandler = async (socket: Socket, bodyContent: string): Promise<void> => {
  const body = parseBody(bodyContent);
  if (!body) {
    socket.write('HTTP/1.1 400 Bad Request\n\n');
    return socket.end();
  }

  socket.write(`HTTP/1.1 200 OK\n\nhallo ${body.name}`);
  socket.end();

  console.log('POST Handler');
};

export const getHandler = async (socket: Socket, path: string): Promise<void> => {
  console.log('GET Handler');
  getAllHandler(socket);
  getOneHandler(socket);
};

const getAllHandler = async (socket: Socket): Promise<void> => {
  console.log('GET ALL Handler');
};

const getOneHandler = async (socket: Socket): Promise<void> => {
  console.log('GET ONE Handler');
  socket.write(`HTTP/1.1 200 OK\n\All Users: ${[]}`);
  socket.end();
};

export const deleteHandler = async (socket: Socket, path: string): Promise<void> => {
  console.log('DELETE Handler');
};

export const putHandler = async (
  socket: Socket,
  bodyContent: string,
  path: string,
): Promise<void> => {
  const body = parseBody(bodyContent);
  if (!body) {
    socket.write('HTTP/1.1 400 Bad Request\n\n');
    return socket.end();
  }

  console.log('PUT Handler');
};
