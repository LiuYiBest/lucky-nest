import { AaaException } from './person/AaaException';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(AaaException)
export class AaaFilter<AaaException> implements ExceptionFilter {
  catch(exception: AaaException, host: ArgumentsHost) {
    console.log(exception);
  }
}
