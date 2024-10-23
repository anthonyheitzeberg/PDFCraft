import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  exports: [UserService], // Export UserService to make it available in other modules
})
export class UserModule {}