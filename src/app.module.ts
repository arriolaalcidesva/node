import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from "cache-manager-redis-store";
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ProvidersModule } from './providers/providers.module';
import { ExcelModule } from './excel/excel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    TypeOrmModule.forRoot({...DataSourceConfig}),
    UsersModule,
    ProjectsModule,
    AuthModule,
    TasksModule,
    ProvidersModule,
    ExcelModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
