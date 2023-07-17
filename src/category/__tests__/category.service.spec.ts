import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { CategoryEntity } from '../entities/category.entity';
import { categoryMock } from '../__mocks__/category.mock';
import { createCategoryMock } from '../__mocks__/createCategory.mock';
import { ProductService } from '../../product/product.service';
import { countProductMock } from '../../product/__mocks__/countProduct.mock';
import { ReturnCategoryDto } from '../dtos/returnCategory.dto';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { updateCategoryMock } from '../__mocks__/updateCategory.mock';
import { productMock } from '../../product/__mocks__/product.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let productService: ProductService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            find: jest
              .fn()
              .mockResolvedValue([new ReturnCategoryDto(categoryMock)]),
            findOne: jest.fn().mockResolvedValue(categoryMock),
            save: jest.fn().mockResolvedValue(categoryMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
        {
          provide: ProductService,
          useValue: {
            countProductsByCategoryId: jest
              .fn()
              .mockResolvedValue([countProductMock]),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    productService = module.get<ProductService>(ProductService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productService).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  it('should return list of categories and amount products', async () => {
    const categories = await service.findAllCategories();

    expect(categories).toEqual([
      new ReturnCategoryDto(categoryMock, countProductMock.total),
    ]);
  });

  it('should return error in list category empty', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);

    expect(service.findAllCategories()).rejects.toThrowError();
  });

  it('should return error in list category exception', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllCategories()).rejects.toThrowError();
  });

  it('should return error if exist category name', async () => {
    expect(service.createCategory(createCategoryMock)).rejects.toThrowError();
  });

  it('should return category after save', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    const category = await service.createCategory(createCategoryMock);

    expect(category).toEqual(categoryMock);
  });

  it('should return error in exception', async () => {
    jest.spyOn(categoryRepository, 'save').mockRejectedValue(new Error());

    expect(service.createCategory(createCategoryMock)).rejects.toThrowError();
  });

  it('should return category in find by name', async () => {
    const category = await service.findCategoryByName(categoryMock.name);

    expect(category).toEqual(categoryMock);
  });

  it('should return error if category find by name empty', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.findCategoryByName(categoryMock.name),
    ).rejects.toThrowError();
  });

  it('should return category in find by id', async () => {
    const category = await service.findCategoryById(categoryMock.id);

    expect(category).toEqual(categoryMock);
  });

  it('should return error if category find by id empty', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findCategoryById(categoryMock.id)).rejects.toThrowError();
  });

  it('should return success DeleteResult category', async () => {
    const deleteResult = await service.deleteCategory(categoryMock.id);

    expect(deleteResult).toEqual(returnDeleteMock);
  });

  it('should send relations in request findOne', async () => {
    const spy = jest.spyOn(categoryRepository, 'findOne');
    await service.deleteCategory(categoryMock.id);

    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: categoryMock.id,
      },
      relations: {
        products: true,
      },
    });
  });

  it('should return error in relations products lentgh', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue({
      ...categoryMock,
      products: [productMock],
    });

    expect(service.deleteCategory(categoryMock.id)).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('should return error in exception category not found in Delete Category', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.deleteCategory(categoryMock.id)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should return update category in success', async () => {
    jest.spyOn(service, 'findCategoryById').mockResolvedValue(categoryMock);
    jest.spyOn(service, 'findCategoryByName').mockResolvedValue(undefined);

    const category = await service.editCategory(
      categoryMock.id,
      updateCategoryMock,
    );

    expect(category).toEqual(categoryMock);
  });

  it('should return send in request updated category ', async () => {
    jest.spyOn(service, 'findCategoryById').mockResolvedValue(categoryMock);
    jest.spyOn(service, 'findCategoryByName').mockResolvedValue(undefined);

    const spy = jest.spyOn(categoryRepository, 'save');

    await service.editCategory(categoryMock.id, updateCategoryMock);

    expect(spy.mock.calls[0][0]).toEqual({
      ...categoryMock,
      ...updateCategoryMock,
    });
  });

  it('should send category id and body', async () => {
    jest.spyOn(service, 'findCategoryById').mockResolvedValue(categoryMock);
    jest.spyOn(service, 'findCategoryByName').mockResolvedValue(undefined);

    await service.editCategory(categoryMock.id, updateCategoryMock);

    const spyFindById = jest.spyOn(service, 'findCategoryById');
    const spyFindByName = jest.spyOn(service, 'findCategoryByName');

    expect(spyFindById.mock.calls.length).toEqual(1);
    expect(spyFindByName.mock.calls.length).toEqual(1);
  });

  it('should return error in updated category', async () => {
    expect(
      service.editCategory(categoryMock.id, updateCategoryMock),
    ).rejects.toThrowError(BadRequestException);
  });
});
