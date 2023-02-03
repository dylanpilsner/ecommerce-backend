import { User } from "models/user";

type newData = {
  name?: string;
  address?: string;
  phoneNumber?: string;
};

export async function pullProfileData(id: string) {
  const user = new User(id);
  await user.pull();
  return user.data;
}

export async function updateProfileData(id: string, newData: newData) {
  const user = new User(id);
  await user.pull();
  user.data = Object.assign({}, user.data, { ...newData });
  await user.push();

  return user.data;
}

export async function updateSingleData(
  id: string,
  keyToChange: string,
  newValue: string | number
) {
  const user = new User(id);
  await user.pull();
  user.data[keyToChange] = newValue;
  await user.push();

  return user.data;
}
