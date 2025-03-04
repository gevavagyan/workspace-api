import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Response } from 'express';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('api', () => {
    it('should set Content-Type header and return HTML', () => {
      const mockResponse: Partial<Response> = {
        setHeader: jest.fn(),
        send: jest.fn(),
      };

      appController.api(mockResponse as Response);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html');

      expect(mockResponse.send).toHaveBeenCalledWith('<h1 style="font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;">💊&nbsp;&nbsp;REST API for WorkspaceR</h1>');
    });
  });
});