import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  // dependency injection: MoviesService -> MoviesController
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
