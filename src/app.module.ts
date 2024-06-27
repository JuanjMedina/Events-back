import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

const Enviroment = process.env.NODE_ENV.trim();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${Enviroment}.env`,
    }),
    MongooseModule.forRoot(`mongodb://${process.env.URL}/events`),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (err) => ({
        message: err.message,
        status: err.extensions.code,
      }),
    }),
    UserModule,
    EventModule,
    AuthModule,
  ],
})
export class AppModule {}
