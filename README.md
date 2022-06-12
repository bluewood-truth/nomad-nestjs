<h1 align="center">NestJS로 API 만들기</h1>

Nomad Coders의 강좌 [NestJS로 API 만들기](https://nomadcoders.co/nestjs-fundamentals)를 공부하며 정리한 Repo입니다.

## 개념 정리

### NestJS?

- Node.js, Express는 자유도가 너무 높음 -> 모든 프로젝트 구조를 개발자가 고민해야 함

- NestJS는 Java의 Spring, Python의 Django처럼 안정적인 프로젝트를 위해 따라야 할 규칙과 구조를 제공함

### 프로젝트 생성

- 새 NestJS 프로젝트를 생성하기 위해 `@nestjs/cli`를 설치해야 함

  ```shell
  $ npm install -g add @nestjs/cli
  ```

  (보통은 `yarn`을 대신 써도 무방하지만 `@nestjs/cli`를 설치할 때는 문제가 좀 있어 가급적 `npm` 사용)

- `nest new` 명령어로 새 프로젝트 생성

### NestJS의 아키텍처

- NestJS는 기본적으로 **데코레이터(decorator)**와 함께 사용함

- NestJS는 main.ts에서 시작함

- main.ts에서는 `AppModule`로부터 애플리케이션을 생성함

- NestJS는 여러 개의 **모듈**로 구성되며, `AppModule`은 전체 애플리케이션의 루트 모듈임

- 모듈은 기본적으로 controller와 service로 나뉨

  - **controller**: url을 가져와서 그에 맞는 함수를 실행함
    - Express의 라우터와 같은 역할
    - `@Get` 데코레이터를 통해 url을 명시하고 이에 대해 실행할 함수를 작성할 수 있음 (Express의 `app.get()`)
    - 물론 `@Get`만이 아니라 다른 HTTP Method에 대한 데코레이터도 존재

  - **service**: 모듈에서 동작하는 비즈니스 로직을 담당함
    - NestJS는 모듈을 url을 함수와 연결하는 controller와 비즈니스 로직을 담당하는 service로 분리함
    - controller는 url을 받아 함수를 리턴하는 역할을 하며, service에서는 실제 로직을 처리하며 필요에 따라 DB와 연결하는 등의 역할을 함

### REST API 개발

- NestJS CLI를 통해 다양한 명령을 수행할 수 있음
- `nest generate controller [컨트롤러명]`: 새 컨트롤러를 생성하고 AppModule에 추가해줌
  - 약어는 `nest g co [컨트롤러명]`

- `@Controller('[컨트롤러명]')` 데코레이터를 통해 지정한 컨트롤러 이름은 url의 엔트리 포인트를 결정함

  - 예를 들어 `@Controller('movies')`라면 해당 컨트롤러의 모든 url은 `/movies/~`가 됨

- 컨트롤러의 메서드에서 url 파라미터를 사용하려면 `@Param('[파라미터명]')` 데코레이터를 사용해야 함

  ```typescript
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
  }
  ```

- 마찬가지로 요청의 Body를 가져오고 싶으면 `@Body()` 데코레이터를, 쿼리를 가져오고 싶으면 `@Query('[쿼리 키]')` 데코레이터를 사용해야 함

- 요청 중에 주고받는 데이터에 타입을 부여하기 위해 **DTO(Data Transfer Object)**를 작성함

  - 타입이 부여됨으로써 어떤 데이터가 오가야 하는지 명확해짐

  - NestJS의 `ValidationPipe`를 통해 데이터의 타입에 대해 유효성 검사를 할 수 있게 해줌

  - `class-validator`, `class-transformer` 라이브러리를 우선 설치해야 함

  - 옵션을 통해 추가적인 처리를 자동으로 할 수 있음

    ```typescript
    import { ValidationPipe } from '@nestjs/common';
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    
    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true, // decorator가 없는 property를 제외함
          forbidNonWhitelisted: true, // property를 제외하는 대신 예외를 던짐
          transform: true, // 요청 데이터의 타입을 자동으로 변환함
        }),
      );
      await app.listen(3000);
    }
    bootstrap();
    ```

  - `@nestjs/mapped-types`의 `PartialType`을 통해 기존 DTO 타입으로부터 부분적인 프로퍼티만 갖는 새로운 타입을 만들 수 있음

    ```typescript
    // create-movie.dto.ts
    
    import { IsNumber, IsOptional, IsString } from 'class-validator';
    
    export class CreateMovieDto {
      @IsString()
      readonly title: string;
    
      @IsNumber()
      readonly year: number;
    
      @IsString({ each: true })
      @IsOptional()
      readonly genres: string[];
    }
    ```

    ```typescript
    // update-movie.dto.ts
    
    import { PartialType } from '@nestjs/mapped-types';
    import { CreateMovieDto } from './create-movie.dto';
    
    // CreateMovieDto의 모든 property를 선택적으로 갖는 클래스
    export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
    ```

### 유닛 테스트

- 테스트는 두 종류가 있음
  - **유닛 테스트**: 시스템을 구성하는 각각의 유닛(함수)를 하나씩 테스트
  - **E2E(end-to-end) 테스트**: 사용자 입장에서 시나리오에 따라 전체 시스템을 테스트

- **Jest**: JavaScript를 위한 테스트 프레임워크
- NestJS에서는 Jest가 .spec.ts 파일을 찾아볼 수 있도록 설정되어 있음
  - `test:cov`
  - `test:watch`

- .spec.ts 파일의 기본적인 구조는 다음과 같음

  ```typescript
  describe('MoviesService', () => {
    let service: MoviesService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [MoviesService],
      }).compile();
  
      service = module.get<MoviesService>(MoviesService);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
      
    describe('getAll', () => {
      it('should return an array', () => {
        const result = service.getAll();
        expect(result).toBeInstanceOf(Array);
      });
    });
      
    //...
  });
  ```

  - `describe()`: 연관된 테스트 여러개를 묶어 하나의 테스트 블록을 생성
  - `it()`: `test()`의 alias. 하나의 단위 테스트를 수행함. 첫 번째 인수로 오는 테스트 이름과 합쳐 문장 형태가 되도록 하여 가독성을 높이기 위함
  - `beforeEach()`, `afterEach()`: 각 유닛 테스트 전, 후에 공통처리할 코드를 추가할 수 있음
  - `beforeAll()`, `afterAll()`: 전체 테스트 전, 후에 처리할 코드를 추가할 수 있음 (DB연결, DB 초기화 등 무거운 작업)

### E2E 테스트

- 보통 개발할 때는 평소 사용하는 DB, 테스트용 DB를 따로 둠
- NestJS에서 E2E 테스트는 `test/app.e2e-spec.ts`에서 수행함
- 테스트 환경의 `app`도 실제 `app`과 동일한 설정(파이프 등)을 해줘야 함
- 
