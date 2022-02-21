import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './adapters/socket-io.adapters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // websocket setting
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(3000);
}
bootstrap();
