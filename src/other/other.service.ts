import { Injectable } from '@nestjs/common';

@Injectable()
export class OtherService {
  getHello() {
    return 'Hello OtherService';
  }
}
