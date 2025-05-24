import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly logger = new Logger(FileSizeValidationPipe.name);
  private readonly maxSize: number;
  private readonly allowedMimeTypes: string[];

  constructor(maxSize: number = 10 * 1024, allowedMimeTypes: string[] = []) {
    this.maxSize = maxSize;
    this.allowedMimeTypes = allowedMimeTypes;
  }

  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value) {
      throw new HttpException('未提供文件', HttpStatus.BAD_REQUEST);
    }

    try {
      // 验证文件大小
      if (value.size > this.maxSize) {
        const maxSizeMB = (this.maxSize / (1024 * 1024)).toFixed(2);
        throw new HttpException(
          `文件大小超过限制 (最大 ${maxSizeMB}MB)`,
          HttpStatus.BAD_REQUEST
        );
      }

      // 验证文件类型
      if (this.allowedMimeTypes.length > 0 && !this.allowedMimeTypes.includes(value.mimetype)) {
        throw new HttpException(
          `不支持的文件类型: ${value.mimetype}`,
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.debug(
        `文件验证通过: ${value.originalname}`,
        {
          filename: value.originalname,
          size: value.size,
          mimetype: value.mimetype,
        }
      );

      return value;
    } catch (error) {
      this.logger.error(
        `文件验证失败: ${error.message}`,
        {
          filename: value.originalname,
          size: value.size,
          mimetype: value.mimetype,
          error: error.message,
        }
      );
      throw error;
    }
  }
}
