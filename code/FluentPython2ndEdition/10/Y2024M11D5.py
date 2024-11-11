from abc import ABC, abstractmethod
from collections.abc import Sequence
from decimal import Decimal
from typing import NamedTuple, Optional

class Customer(NamedTuple):
   name: str
   fidelity: int
    
class LineItem(NamedTuple):
    product: str
    quantity: int
    price: Decimal
    def total(self) -> Decimal:
        return self.price * self.quantity

class Order(NamedTuple):
    customer: Customer
    cart: Sequence[LineItem]
    promotion: Optional['Promotion'] = None

    def total(self) -> Decimal:
        totals = (item.total() for item in self.cart)
        return sum(totals, start = Decimal(0))
    
    def due(self) -> Decimal:
        if self.promotion is None:
            discount = Decimal(0)
        else:
            discount = self.promotion.discount(self)
        return self.total() - discount
    
    def __repr__(self) -> str:
        return f'<Order total: {self.total():.2f} due: {self.due():.2f}>'

# 策略：抽象基类
class Promotion(ABC):
    @abstractmethod
    def discount(self, order: Order) -> Decimal:
        """返回折扣金额"""

# 第一个具体策略
class FidelityPromo(Promotion):
    """"为积分为1000或以上的顾客提供5%的折扣"""
    def discount(self, order: Order) -> Decimal:
        rate = Decimal('0.05')
        if order.customer.fidelity >= 1000:
            return order.total() * rate
        return Decimal(0)

# 第二个具体策略
class BulkItemPromo(Promotion):
    """单个物品超过数量超过20个或以上时提供10%的折扣"""
    def discount(self, order: Order) -> Decimal:
        discount = Decimal(0)
        for item in order.cart:
            if item.quantity >= 20:
                discount += item.total() * Decimal('0.1')
        return discount
    
# 第三个具体策略
class LargeOrderPromo(Promotion):
    """订单中的不同商品达到10个或以上时提供7%的折扣"""
    def discount(self, order: Order) -> Decimal:
        distinct_items = {item.product for item in order.cart}
        if len(distinct_items) >= 10:
            return order.total() * Decimal('0.07'))
        return Decimal(0)
