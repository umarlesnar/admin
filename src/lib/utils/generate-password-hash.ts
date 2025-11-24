import Bcrypt from "bcryptjs";

const SALT_FACTOR = 10;

export const generatePasswordHash = function (password: string) {
  let salt = Bcrypt.genSaltSync(SALT_FACTOR);
  let hash = Bcrypt.hashSync(password, salt);
  return hash;
};
