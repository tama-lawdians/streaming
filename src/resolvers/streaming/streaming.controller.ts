import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('streaming')
export class StreamingController {
  @Get(':id')
  getFile(@Res() res: Response, @Param('id') id: string) {
    // const file = createReadStream(join(process.cwd(), 'package.json'));
    // console.log(file);
    // console.log(id);
    return true;
  }
}
