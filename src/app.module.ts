import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { WowzaModule } from './resolvers/wowza/wowza.module';
import { ChatGateway } from './resolvers/chat/chat.gateway';
import { UserModule } from './resolvers/user/user.module';
import { ChatModule } from './resolvers/chat/chat.module';
import { ChatService } from './resolvers/chat/chat.service';
import { PrismaService } from './services/prisma.service';

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
    AuthModule,
    WowzaModule,
    UserModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ChatService, PrismaService],
})
export class AppModule {}
