import { orderMock } from '../../order/__mocks__/order.mock';
import { ReturnGroupOrderDto } from '../dtos/returnGroupOrder.dto';

export const returnGroupOrderMock: ReturnGroupOrderDto = {
  order_id: orderMock.id,
  total: '2',
};
