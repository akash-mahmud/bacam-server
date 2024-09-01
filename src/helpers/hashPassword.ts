import bcrypt from 'bcryptjs'
const hashPassword = async (plainTextPassword:string) => {
  return await bcrypt.hash(plainTextPassword, 10);
};

export { hashPassword };