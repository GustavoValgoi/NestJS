import { Test, TestingModule } from '@nestjs/testing';
import { CorreiosService } from '../correios.service';
import { HttpService } from '@nestjs/axios';
import { CityService } from '../../city/city.service';

describe('CorreiosService', () => {
  let service: CorreiosService;
  let httpService: HttpService;
  let cityService: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: CityService,
          useValue: {
            findCityByName: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: 'SOAP_CORREIOS',
          useValue: {
            CalcPrecoPrazo: jest.fn().mockResolvedValue({}),
          },
        },
        CorreiosService,
      ],
    }).compile();

    service = module.get<CorreiosService>(CorreiosService);
    httpService = module.get<HttpService>(HttpService);
    cityService = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
    expect(cityService).toBeDefined();
  });
});
