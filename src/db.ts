import fs from 'fs';
import {User} from './interface';

const dbName = 'db.json';

const readData = async (): Promise<User[] | null> => {
  const buff = await fs.promises.readFile(dbName);
  const json = buff.toString();
  try {
    return JSON.parse(json);
  } catch (err) {
    console.log('database is broken, reinitizlizing...');
    createDb();
    return null;
  }
};

const writeData = async (data: User[]): Promise<void> => {
  const str = JSON.stringify(data);
  const buff = Buffer.from(str);
  await fs.promises.writeFile(dbName, buff);
};
export const createDb = (): void => {
  fs.appendFile(dbName, '', (err) => {
    if (err) throw err;
    console.log('DB initialized');
  });
};

export const reinitizlizeDb = (): void => {
  fs.unlink(dbName, (err) => {
    if (err) throw err;
    console.log('DB reinitialized');
  });
};

export const findAll = async (): Promise<User[]> => {
  const res = await readData();
  if (!res) {
    throw new Error('Users not found');
  }
  return res;
};

export const findOne = async (id: string): Promise<User> => {
  const all = await readData();
  const res = all?.find((el) => el.id === id);

  if (!res) {
    throw new Error('User not found');
  }

  return res;
};

export const remove = async (id: string): Promise<void> => {
  await findOne(id);
  const all = await readData();
  const res = all?.filter((el) => el.id !== id);
  await writeData(res ?? []);
};

export const update = async (id: string, data: User): Promise<void> => {
  await findOne(id);
  const all = await readData();
  const res = all?.filter((el) => el.id !== id);
  res?.push(data);
  await writeData(res ?? []);
};

export const add = async (data: User): Promise<void> => {
  const all = await readData();
  const item = all?.find((el) => el.id === data.id);
  if (item) {
    throw new Error('User already exists');
  }

  const res = await readData();
  res?.push(data);
  await writeData(res ?? []);
};
