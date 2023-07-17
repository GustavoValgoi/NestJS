import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ReturnCategoryDto } from './dtos/returnCategory.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { DeleteResult } from 'typeorm';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import { CategoryEntity } from './entities/category.entity';

@Roles(UserType.Admin, UserType.Root, UserType.User)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    return this.categoryService.findAllCategories();
  }

  @Roles(UserType.Admin, UserType.Root)
  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategory: CreateCategoryDto,
  ): Promise<ReturnCategoryDto> {
    return new ReturnCategoryDto(
      await this.categoryService.createCategory(createCategory),
    );
  }

  @Roles(UserType.Admin, UserType.Root)
  @Delete('/:categoryId')
  async deleteCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<DeleteResult> {
    return this.categoryService.deleteCategory(categoryId);
  }

  @Roles(UserType.Admin, UserType.Root)
  @Put('/:categoryId')
  @UsePipes(ValidationPipe)
  async editCategory(
    @Param('categoryId') categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoryService.editCategory(categoryId, updateCategoryDto);
  }

  @Get('/:categoryId')
  async findCategoryById(
    @Param('categoryId') categoryId: number,
  ): Promise<ReturnCategoryDto> {
    return new ReturnCategoryDto(
      await this.categoryService.findCategoryById(categoryId, true),
    );
  }
}
