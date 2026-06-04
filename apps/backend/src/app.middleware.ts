import { Injectable, NestMiddleware } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class RequestLogger implements NestMiddleware {
  use(
    req: FastifyRequest['raw'],
    reply: FastifyReply['raw'],
    next: () => void,
  ) {
    console.log(req);
    next();
  }
}
