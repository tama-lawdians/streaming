import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StreamingModule } from './resolvers/streaming/streaming.module';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync({
      useFactory: () => ({
        path: '/graphql',
        // 구독 endpoint 에러 해결
        installSubscriptionHandlers: true,
        debug: true,
        uploads: false,
        playground: true,
        autoSchemaFile: './src/schema.graphql',
        buildSchemaOptions: {
          numberScalarMode: 'float',
        },
        formatError: (error: GraphQLError) => {
          const graphQLFormattedError: GraphQLFormattedError = {
            message: Array.isArray(
              error.extensions?.exception?.response?.message,
            )
              ? error.extensions?.exception?.response?.message[0]
              : error.extensions?.exception?.response?.message ||
                error.extensions?.exception?.response?.error ||
                error.message,
          };

          return graphQLFormattedError;
        },
      }),
    }),
    StreamingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
