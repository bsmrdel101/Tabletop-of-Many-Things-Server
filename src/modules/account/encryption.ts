import bcrypt from 'bcryptjs';


const SALT_WORK_FACTOR = 10;

export const encryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (candidatePassword: string, storedPassword: string) => {
  return bcrypt.compareSync(candidatePassword, storedPassword);
};
