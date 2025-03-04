import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  describeAPI(): string {
    return `<h1 style="font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;padding: 20px">💊&nbsp;&nbsp;REST API for WorkspaceR</h1>`;
  }
}
