import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { CategoryService } from './category.service';
import { ReturnCategoryDto } from './dtos/returnCategory.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { CreateCategoryDto } from './dtos/createCategory.dto';

@Roles(UserType.Admin, UserType.User)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    return (await this.categoryService.findAllCategories()).map(
      (category: CategoryEntity) => new ReturnCategoryDto(category),
    );
  }

  @Roles(UserType.Admin)
  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategory: CreateCategoryDto,
  ): Promise<ReturnCategoryDto> {
    return new ReturnCategoryDto(
      await this.categoryService.createCategory(createCategory),
    );
  }
}
