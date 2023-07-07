import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dtos/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find();

    if (!categories || !categories.length) {
      throw new NotFoundException('Category not registered.');
    }

    return categories;
  }

  async findCategoryByName(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return category;
  }

  async createCategory(
    categoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findCategoryByName(categoryDto.name).catch(
      () => undefined,
    );

    if (category) {
      throw new BadRequestException('Category already exists.');
    }

    return this.categoryRepository.save(categoryDto);
  }
}
