import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

@Controller('movies') // 컨트롤러의 이름은 url의 엔트리 포인트를 결정
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getAll(): Movie[] {
    return this.moviesService.getAll();
  }

  @Get(':id') // url 파라미터를 사용하려면 @Param 데코레이터 사용
  getOne(@Param('id') id: string): Movie {
    return this.moviesService.getOne(id);
  }

  @Post()
  create(@Body() movieData): Movie {
    return this.moviesService.create(movieData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.moviesService.deleteOne(id);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateData) {
    return {
      updated: id,
      ...updateData,
    };
  }
}
