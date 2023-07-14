import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { ReturnCEPExternalDto } from './dtos/returnCepExternal.dto';
import { CityService } from '../city/city.service';
import { ReturnCepDto } from './dtos/returnCep.dto';
import { CityEntity } from '../city/entities/city.entity';
import { Client } from 'nestjs-soap';
import { ResponsePriceCorreiosDto } from './dtos/responsePriceCorreios.dto';
import { cdFomartEnum } from './enums/cdFormat.enum';
import { SizeProductDTO } from './dtos/sizeProduct.dto';

@Injectable()
export class CorreiosService {
  CEP_URL = process.env.URL_CEP_CORREIOS;
  CEP_COMPANY = process.env.CEP_COMPANY;
  constructor(
    @Inject('SOAP_CORREIOS')
    private readonly soapCorreios: Client,
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
  ) {}

  async findAddressByCep(cep: string): Promise<ReturnCepDto> {
    const returnCep = await this.httpService.axiosRef
      .get<ReturnCEPExternalDto>(this.CEP_URL.replace('{CEP}', cep))
      .then((res) => res.data)
      .catch((e: AxiosError) => {
        throw new BadRequestException(
          `Error in conection request. ${e.message}`,
        );
      });

    const city: CityEntity | undefined = await this.cityService
      .findCityByName(returnCep.localidade, returnCep.uf)
      .catch(() => undefined);

    return new ReturnCepDto(returnCep, city?.id, city?.state?.id);
  }

  async priceDelivery(
    cdService: string,
    cep: string,
    sizeProduct: SizeProductDTO,
  ): Promise<ResponsePriceCorreiosDto> {
    return new Promise((resolve) => {
      this.soapCorreios.CalcPrecoPrazo(
        {
          nCdServico: cdService,
          sCepOrigem: this.CEP_COMPANY,
          nCdFormato: cdFomartEnum.BOX,
          sCepDestino: cep,
          nVlPeso: sizeProduct.weight,
          nVlComprimento: sizeProduct.pLength,
          nVlAltura: sizeProduct.height,
          nVlLargura: sizeProduct.width,
          nVlDiametro: sizeProduct.diameter,
          nCdEmpresa: '',
          sDsSenha: '',
          sCdMaoPropria: 'N',
          nVlValorDeclarado:
            sizeProduct.productValue < 25 ? 0 : sizeProduct.productValue,
          sCdAvisoRecebimento: 'N',
        },
        (_, res: ResponsePriceCorreiosDto) => {
          if (res) {
            resolve(res);
          } else {
            throw new BadRequestException('Error correios SOAP.');
          }
        },
      );
    });
  }
}
