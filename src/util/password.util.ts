// src/utils/password.util.ts
import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  // 哈希密码（加盐）
  static async hash(password: string): Promise<string> {
    const saltRounds = 10; // 哈希计算成本（值越高越安全但越慢）
    return bcrypt.hash(password, saltRounds);
  }

  // 验证密码
  static async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
