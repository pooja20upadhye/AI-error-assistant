import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";
import { createUser, findUserByEmail } from "./auth.repository";

export const registerUser = async (email: string, password: string) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    email,
    password: hashedPassword
  };

  return await createUser(user);
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = generateToken({ id: user.id, email: user.email });

  return { token };
};