import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { In, Repository } from 'typeorm';
import { productMock } from '../__mocks__/product.mock';
import { createProductMock } from '../__mocks__/createProduct.mock';
import { CategoryService } from '../../category/category.service';
import { categoryMock } from '../../category/__mocks__/category.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { updateProductMock } from '../__mocks__/updateProduct.mock';
import { ReturnProductDto } from '../dtos/returnProduct.dto';
import { CorreiosService } from '../../correios/correios.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryService: CategoryService;
  let correiosService: CorreiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest
              .fn()
              .mockResolvedValue([new ReturnProductDto(productMock)]),
            findOne: jest.fn().mockResolvedValue(productMock),
            save: jest.fn().mockResolvedValue(productMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            findCategoryById: jest.fn().mockResolvedValue(categoryMock),
          },
        },
        {
          provide: CorreiosService,
          useValue: {
            priceDelivery: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    categoryService = module.get<CategoryService>(CategoryService);
    correiosService = module.get<CorreiosService>(CorreiosService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(correiosService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should return all products', async () => {
    const products = await service.findAllProducts();
    expect(products).toEqual([new ReturnProductDto(productMock)]);
  });

  it('should return all products with relations', async () => {
    const spy = jest.spyOn(productRepository, 'find');
    const products = await service.findAllProducts([], true);
    expect(products).toEqual([new ReturnProductDto(productMock)]);
    expect(spy.mock.calls[0][0]).toEqual({
      relations: {
        category: true,
      },
    });
  });

  it('should return all products with relations and array of products id', async () => {
    const spy = jest.spyOn(productRepository, 'find');
    const products = await service.findAllProducts([1], true);
    expect(products).toEqual([new ReturnProductDto(productMock)]);
    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: In([1]),
      },
      relations: {
        category: true,
      },
    });
  });

  it('should return error if products empty', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValue([]);
    expect(service.findAllProducts()).rejects.toThrowError();
  });

  it('should return error if products exception', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValueOnce(new Error());
    expect(service.findAllProducts()).rejects.toThrowError();
  });

  it('should return product after insert in DB', async () => {
    const product = await service.createProduct(createProductMock);
    expect(product).toEqual(productMock);
  });

  it('should return error category id not found', async () => {
    jest
      .spyOn(categoryService, 'findCategoryById')
      .mockRejectedValueOnce(new Error());

    expect(service.createProduct(createProductMock)).rejects.toThrowError();
  });

  it('should return product in find by id', async () => {
    const product = await service.findProductById(productMock.id);
    expect(product).toEqual(productMock);
  });

  it('should return error in exception after find product by id NotFoundException', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findProductById(productMock.id)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should return error in exception after find product by id', async () => {
    jest.spyOn(productRepository, 'findOne').mockRejectedValueOnce(new Error());

    expect(service.findProductById(productMock.id)).rejects.toThrowError();
  });

  it('should return deleted true in delete product', async () => {
    const deleted = await service.deleteProduct(productMock.id);
    expect(deleted).toEqual(returnDeleteMock);
  });

  it('should return error in exception in delete product not found', async () => {
    jest.spyOn(productRepository, 'findOne').mockRejectedValueOnce(new Error());

    expect(service.deleteProduct(productMock.id)).rejects.toThrowError();
  });

  it('should return product after update', async () => {
    const product = await service.updateProduct(
      updateProductMock,
      productMock.id,
    );

    expect(product).toEqual(productMock);
  });

  it('should return error in update product', async () => {
    jest.spyOn(productRepository, 'save').mockRejectedValueOnce(new Error());

    expect(
      service.updateProduct(updateProductMock, productMock.id),
    ).rejects.toThrowError();
  });
});
