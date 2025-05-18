# Guide to Nest.js

## Installing Nest.js

1. Ensure you have **Node.js** and **npm** installed.
2. Install the Nest CLI globally:

```bash
npm i -g @nestjs/cli
```

3. Create a new Nest.js project:

```bash
nest new project-name
```

4. Install NaroDB:

```bash
cd project-name
npm install @narodb/naro
```

## Basic Integration

Here's how to integrate NaroDB with Nest.js:

### Database Configuration

Create a single file to initialize and export the Naro instance:

```typescript
// src/database/db.ts
import { Naro } from '@narodb/naro';
const db = new Naro('nestjsDatabase');
export default db;
```

### Create a Simple Module

Create a module to provide NaroDB as a service:

```typescript
// src/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import db from './db';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE',
      useValue: db,
    },
  ],
  exports: ['DATABASE'],
})
export class DatabaseModule {}
```

### Import the Database Module

Import the database module in your app module:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Use NaroDB in a Service

```typescript
// src/users/users.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Naro } from '@narodb/naro';

@Injectable()
export class UsersService {
  private readonly collection = 'users';

  constructor(@Inject('DATABASE') private db: Naro) {}

  async create(createUserDto: any): Promise<any> {
    return this.db.add(this.collection, createUserDto);
  }

  async findAll(): Promise<any[]> {
    return this.db.getAll(this.collection);
  }

  async findOne(id: string): Promise<any> {
    return this.db.get(`${this.collection}/${id}`);
  }
}
```

## Example Controller

Here's a simple controller using the service:

```typescript
// src/users/users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: any): Promise<any> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<any[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.usersService.findOne(id);
  }
}
```

## Official Documentation

For more information, refer to the official Nest.js documentation: [Nest.js](https://nestjs.com/)
