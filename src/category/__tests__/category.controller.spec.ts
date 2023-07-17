import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { categoryMock } from '../__mocks__/category.mock';
import { ReturnCategoryDto } from '../dtos/returnCategory.dto';
import { createCategoryMock } from '../__mocks__/createCategory.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { updateCategoryMock } from '../__mocks__/updateCategory.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAllCategories: jest
              .fn()
              .mockResolvedValue([new ReturnCategoryDto(categoryMock)]),
            createCategory: jest
              .fn()
              .mockResolvedValue(new ReturnCategoryDto(categoryMock)),
            deleteCategory: jest.fn().mockResolvedValue(returnDeleteMock),
            editCategory: jest.fn().mockResolvedValue(categoryMock),
            findCategoryById: jest
              .fn()
              .mockResolvedValue(new ReturnCategoryDto(categoryMock)),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('should return all categories', async () => {
    const categories = await controller.findAllCategories();

    expect(categories).toEqual([new ReturnCategoryDto(categoryMock)]);
  });

  it('should return category after create', async () => {
    const category = await controller.createCategory(createCategoryMock);

    expect(category).toEqual(new ReturnCategoryDto(categoryMock));
  });

  it('should return DeleteResult after delete category', async () => {
    const deleteResult = await controller.deleteCategory(categoryMock.id);

    expect(deleteResult).toEqual(returnDeleteMock);
  });

  it('should send category id to delete category', async () => {
    const spy = jest.spyOn(categoryService, 'deleteCategory');
    await controller.deleteCategory(categoryMock.id);

    expect(spy.mock.calls[0][0]).toEqual(categoryMock.id);
  });

  it('should return category updated', async () => {
    const category = await controller.editCategory(
      categoryMock.id,
      updateCategoryMock,
    );

    expect(category).toEqual(categoryMock);
  });

  it('should send category id and body', async () => {
    const spy = jest.spyOn(categoryService, 'editCategory');
    await controller.editCategory(categoryMock.id, updateCategoryMock);

    expect(spy.mock.calls[0][0]).toEqual(categoryMock.id);
    expect(spy.mock.calls[0][1]).toEqual(updateCategoryMock);
  });

  it('should return category in find category by id', async () => {
    const spy = jest.spyOn(categoryService, 'findCategoryById');
    const category = await controller.findCategoryById(categoryMock.id);

    expect(spy.mock.calls[0][0]).toEqual(categoryMock.id);
    expect(spy.mock.calls[0][1]).toEqual(true);
    expect(category).toEqual(new ReturnCategoryDto(categoryMock));
  });
});
