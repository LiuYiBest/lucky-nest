import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { OtherService } from 'src/other/other.service';
import { Inject } from '@nestjs/common';

@Injectable()
export class PersonService {
  create(createPersonDto: CreatePersonDto) {
    return `createPersonDto: ${JSON.stringify(createPersonDto)}`;
  }

  findAll() {
    return `This action returns all person`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }

  @Inject(OtherService)
  private readonly otherService: OtherService;

  getHello() {
    return 'Hello World!' + this.otherService.getHello();
  }
}
