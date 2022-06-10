import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('movies') // 컨트롤러의 이름은 url의 엔트리 포인트를 결정
export class MoviesController {
  @Get()
  getAll() {
    return 'This will return all movies';
  }

  @Get('/:id') // url 파라미터를 사용하려면 @Param 데코레이터 사용
  getOne(@Param('id') id: string) {
    return `This will return one movie with the id: ${id}`;
  }

  @Post()
  create() {
    return 'This will create a movie';
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return `This will delete a movie with the id: ${id}`;
  }

  @Patch('/:id')
  patch(@Param('id') id: string) {
    return `This will patch a movie with the id: ${id}`;
  }
}
