import { query } from "../../config/db";

export interface ErrorLog {
  id?: number;
  user_id: number;
  error_message: string;
  ai_explanation: string;
  created_at?: Date;
}

export const createErrorLog = async (log: ErrorLog) => {
  const result = await query(
    "INSERT INTO error_logs (user_id, error_message, ai_explanation) VALUES ($1, $2, $3) RETURNING *",
    [log.user_id, log.error_message, log.ai_explanation]
  );
  return result.rows[0];
};

export const getErrorHistory = async (userId: number, limit: number, offset: number, keyword?: string) => {
  let sql = "SELECT * FROM error_logs WHERE user_id = $1";
  const params: any[] = [userId];

  if (keyword) {
    sql += " AND error_message ILIKE $2";
    params.push(`%${keyword}%`);
  }

  sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result.rows;
};

export const getErrorById = async (userId: number, id: number) => {
  const result = await query(
    "SELECT * FROM error_logs WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
  return result.rows[0] || null;
};
