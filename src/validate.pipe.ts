import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null) {
      throw new BadRequestException(`参数${metadata.data}不能为空`);
    }

    const parsedValue = parseInt(value);
    if (Number.isNaN(parsedValue)) {
      throw new BadRequestException(`参数${metadata.data}必须是数字`);
    }

    return typeof value === 'number' ? value * 10 : parsedValue * 10;
  }
}
