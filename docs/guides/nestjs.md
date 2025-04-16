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
npm install narodb
```

## Integrating NaroDB with Nest.js

### Create a Database Module

Create a module to provide NaroDB as a service:

```typescript
// src/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
```

### Create a Database Service

```typescript
// src/database/database.service.ts
import { Injectable } from '@nestjs/common';
import { Naro } from '@narodb/naro';

@Injectable()
export class DatabaseService {
  private db: Naro;

  constructor() {
    this.db = new Naro('nestjsDatabase');
  }

  getDb(): Naro {
    return this.db;
  }
}
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
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly collection = 'users';
  
  constructor(private databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const db = this.databaseService.getDb();
    return db.add(this.collection, createUserDto);
  }

  async findAll(): Promise<User[]> {
    const db = this.databaseService.getDb();
    return db.getAll(this.collection);
  }

  async findOne(id: string): Promise<User> {
    const db = this.databaseService.getDb();
    return db.get(`${this.collection}/${id}`);
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    const db = this.databaseService.getDb();
    return db.update(`${this.collection}/${id}`, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    const db = this.databaseService.getDb();
    await db.delete(`${this.collection}/${id}`);
  }
}
```

## Complete Example

Here's a complete example of a controller using the service:

```typescript
// src/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
```

## Official Documentation

For more information, refer to the official Nest.js documentation: [Nest.js](https://nestjs.com/)
