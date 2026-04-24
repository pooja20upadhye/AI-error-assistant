import { query } from "../../config/db";

export type User = {
  id?: number;
  email: string;
  password?: string;
};

export const createUser = async (user: User) => {
  const result = await query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
    [user.email, user.password]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
};