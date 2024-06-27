import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [AuthService, AuthResolver],
  imports: [UserModule],
})
export class AuthModule {}
