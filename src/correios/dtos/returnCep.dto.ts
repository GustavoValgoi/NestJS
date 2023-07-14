import { ReturnCEPExternalDto } from './returnCepExternal.dto';

export class ReturnCepDto {
  cep: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
  ddd: string;
  cityId?: number;
  stateId?: number;

  constructor(
    returnCep: ReturnCEPExternalDto,
    cityId?: number,
    stateId?: number,
  ) {
    this.cep = returnCep.cep;
    this.street = returnCep.logradouro;
    this.complement = returnCep.complemento;
    this.neighborhood = returnCep.bairro;
    this.city = returnCep.localidade;
    this.uf = returnCep.uf;
    this.ddd = returnCep.ddd;
    this.cityId = cityId ? cityId : undefined;
    this.stateId = stateId ? stateId : undefined;
  }
}
