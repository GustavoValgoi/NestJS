import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { productMock } from '../__mocks__/product.mock';
import { ReturnProductDto } from '../dtos/returnProduct.dto';
import { createProductMock } from '../__mocks__/createProduct.mock';
import { updateProductMock } from '../__mocks__/updateProduct.mock';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAllProducts: jest
              .fn()
              .mockResolvedValue([new ReturnProductDto(productMock)]),
            createProduct: jest.fn().mockResolvedValue(productMock),
            deleteProduct: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProduct: jest.fn().mockResolvedValue(productMock),
            findProductById: jest
              .fn()
              .mockResolvedValue(new ReturnProductDto(productMock)),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('should return all products', async () => {
    const products = await controller.findAllProducts();
    expect(products).toEqual([new ReturnProductDto(productMock)]);
  });

  it('should return product after create', async () => {
    const product = await controller.createProduct(createProductMock);
    expect(product).toEqual(productMock);
  });

  it('should return DeleteResult after delete a product', async () => {
    const deleted = await controller.deleteProduct(productMock.id);
    expect(deleted).toEqual(returnDeleteMock);
  });

  it('should return updated product', async () => {
    const updatedProduct = await controller.updateProduct(
      productMock.id,
      updateProductMock,
    );
    expect(updatedProduct).toEqual(productMock);
  });

  it('should return product in find by id', async () => {
    const updatedProduct = await controller.findProductById(productMock.id);
    expect(updatedProduct).toEqual(new ReturnProductDto(productMock));
  });
});
