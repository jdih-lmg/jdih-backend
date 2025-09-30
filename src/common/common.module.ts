import { Global, Module } from '@nestjs/common';
import { ValidationService } from './validation.service';

@Global()
@Module({})
export class CommonModule {
  static forRoot() {
    return {
      module: CommonModule,
      providers: [ValidationService],
      exports: [ValidationService],
    };
  }
}
