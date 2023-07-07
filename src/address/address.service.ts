import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AddressEntity } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddressDTO } from './dtos/createAddress.dto';
import { UserService } from '../user/user.service';
import { CityService } from '../city/city.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly userService: UserService,
    private readonly cityService: CityService,
  ) {}

  async createAddress(
    createAddressDTO: CreateAddressDTO,
    userId: number,
  ): Promise<AddressEntity> {
    await this.userService.findUserById(userId);
    await this.cityService.findCityById(createAddressDTO.cityId);

    return this.addressRepository.save({
      ...createAddressDTO,
      userId,
    });
  }

  async findAddressesByUserId(userId: number): Promise<AddressEntity[]> {
    const addresses = await this.addressRepository.find({
      where: { userId },
      relations: {
        city: {
          state: true,
        },
      },
    });

    if (!addresses || !addresses.length) {
      throw new NotFoundException(`Address not found for userid: ${userId}.`);
    }

    return addresses;
  }
}
