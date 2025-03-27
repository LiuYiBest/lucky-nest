import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  UseFilters,
  Session,
  Version,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFile,
  ParseFilePipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { LoginGuard } from 'src/login.guard';
import { TimeInterceptor } from 'src/time.interceptor';
import { ValidatePipe } from 'src/validate.pipe';
// import { TestFilter } from 'src/test.filter';
import { UserInfoDto } from './dto/user-info.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from 'src/file-size-validation-pipe.pipe';
import { Logger } from '@nestjs/common';
@Controller({
  path: 'person',
  version: '1',
})
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  private readonly logger = new Logger(PersonController.name);

  // 文件上传
  @Post('file')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads/',
    }),
  )
  body2(@Body() createPersonDto: CreatePersonDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return `received: ${JSON.stringify(createPersonDto)}`;
  }

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return `received: ${JSON.stringify(createPersonDto)}`;
  }

  // @Get()
  // // @UseGuards(LoginGuard)
  // @UseInterceptors(TimeInterceptor)
  // findAll() {
  //   console.log('LoginGuard');
  //   return this.personService.getHello();
  // }

  @Get()
  getHello(): string {
    this.logger.log('hello', PersonController.name);
    return this.personService.getHello();
  }

  @Get('number')
  // @UseFilters(TestFilter)
  number(@Query('num', new ValidatePipe()) numValue: number) {
    return numValue + 1;
  }

  @Get('find')
  query(@Query('name') name: string, @Query('age') age: number) {
    return `received: name=${name},age=${age}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Hello:id = ${id}`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }

  @Get('/session')
  session(@Session() session: any) {
    console.log(session);
    return session;
  }

  @Version('2')
  @Post('validator')
  validator(@Body(new ValidatePipe()) userInfoDto: UserInfoDto) {
    console.log(userInfoDto);
  }

  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads',
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        exceptionFactory: (err) => {
          console.log('err', err);
          return new HttpException('文件大小超过10k', HttpStatus.BAD_REQUEST);
        },
        validators: [new MaxFileSizeValidator({ maxSize: 1000 }), new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
    @Body() body,
  ) {
    console.log('body', body);
    console.log('file', file);
  }
}
