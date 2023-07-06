import { StateEntity } from '../entities/state.entity';

export class ReturnStateDto {
  name: string;

  constructor(stateEntity: StateEntity) {
    this.name = stateEntity.name;
  }
}
