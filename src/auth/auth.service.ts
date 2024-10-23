import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  validateToken(token: string): boolean {
    try {
      const decoded = this.jwtService.verify(token);
      return !!decoded;
    } catch (error) {
      return false;
    }
  }
}