import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { ProductService } from '../product/product.service';
import { ReturnCategoryDto } from './dtos/returnCategory.dto';
import { CountProduct } from '../product/dtos/countProduct.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  findAmountCategoryInProducts(
    category: CategoryEntity,
    countList: CountProduct[],
  ): number {
    const count = countList.find(
      (itemCount: CountProduct) => itemCount.category_id === category.id,
    );

    if (count) {
      return count.total;
    }

    return 0;
  }

  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    const categories = await this.categoryRepository.find();

    const count = await this.productService.countProductsByCategoryId();

    if (!categories || !categories.length) {
      throw new NotFoundException('Category not registered.');
    }

    return categories.map(
      (category) =>
        new ReturnCategoryDto(
          category,
          this.findAmountCategoryInProducts(category, count),
        ),
    );
  }

  async findCategoryById(
    id: number,
    isRelations?: boolean,
  ): Promise<CategoryEntity> {
    const relations = isRelations
      ? {
          products: true,
        }
      : undefined;

    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      relations,
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return category;
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

  async deleteCategory(categoryId: number): Promise<DeleteResult> {
    const category = await this.findCategoryById(categoryId, true);

    if (category.products?.length > 0) {
      throw new BadRequestException('Category with relations.');
    }

    return this.categoryRepository.delete({ id: categoryId });
  }

  async editCategory(
    categoryId: number,
    updateCategory: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findCategoryById(categoryId);

    const categoryNamed = await this.findCategoryByName(
      updateCategory.name,
    ).catch(() => undefined);

    if (categoryNamed) {
      throw new BadRequestException('Category already exists.');
    }

    return this.categoryRepository.save({
      ...category,
      ...updateCategory,
    });
  }
}
