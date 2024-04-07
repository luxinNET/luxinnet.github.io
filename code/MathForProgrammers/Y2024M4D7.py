from datetime import datetime

from Y2024M4D1 import Vector

class CarForSale(Vector):
    # 于2018年11月30日12点抓取
    retrieved_date = datetime(2018,11,30,12)

    def __init__(self, model_year, mileage, price, posted_datetime, model = "(virtual)", source = "(virtual)", location = "(virtual)", description = "(virtual)") :
        self.model_year = model_year
        self.mileage = mileage
        self.price = price
        self.posted_datetime = posted_datetime
        self.model = model
        self.source = source
        self.location = location
        self.description = description

    def add(self, other):
        def add_dates(date1, date2):
            """通过叠加时间跨度来实现日期相加"""
            age1 = CarForSale.retrieved_date - date1
            age2 = CarForSale.retrieved_date - date2
            sum_age = age1 + age2
            return CarForSale.retrieved_date - sum_age
        # 通过对属性求和来实现新的CarForSale实例
        return CarForSale(
            self.model_year + other.model_year,
            self.mileage + other.mileage,
            self.price + other.price,
            add_dates(self.posted_datetime, other.posted_datetime),
        )
    
    def scale(self, scalar):
        """根据传入的数值来缩放时间跨度"""
        def scale_date(date):
            """通过缩放时间跨度来实现日期缩放"""
            age = CarForSale.retrieved_date - date
            scaled_age = age * scalar
            return CarForSale.retrieved_date - scaled_age
        return CarForSale(
            self.model_year * scalar,
            self.mileage * scalar,
            self.price * scalar,
            scale_date(self.posted_datetime),
        )
    @classmethod
    def zero(cls):
        return CarForSale(0,0,0,CarForSale.retrieved_date)