import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: userWhereUniqueInput,
      });
      
      if (!user) {
        throw new NotFoundException('用户不存在');
      }
      
      return user;
    } catch (error) {
      this.logger.error(`查找用户失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (error) {
      this.logger.error(`获取用户列表失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch (error) {
      this.logger.error(`创建用户失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateUser(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<User> {
    try {
      const { where, data } = params;
      const user = await this.prisma.user.update({
        data,
        where,
      });
      
      if (!user) {
        throw new NotFoundException('用户不存在');
      }
      
      return user;
    } catch (error) {
      this.logger.error(`更新用户失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        where,
      });
      
      if (!user) {
        throw new NotFoundException('用户不存在');
      }
      
      return user;
    } catch (error) {
      this.logger.error(`删除用户失败: ${error.message}`, error.stack);
      throw error;
    }
  }
}
