
from PIL import Image
from Y2024M4D1 import Vector


class Matrix5_by_3(Vector):
    rows = 5
    columns = 3
    def __init__(self, matrix):
        self.matrix = matrix
    
    def add(self, other):
        return Matrix5_by_3(tuple(
            tuple(a + b for a, b in zip(row1, row2))
            for row1, row2 in zip(self.matrix, other.matrix)
        ))
    
    def scale(self, scalar):
        return Matrix5_by_3(tuple(
            tuple(a * scalar for a in row)
            for row in self.matrix
        ))
    
    @classmethod
    def zero(cls):
        return Matrix5_by_3(
            tuple(
                tuple(0 for j in range(0, cls.columns))
                for i in range(0, cls.rows)
            ))
    
class ImageVector(Vector):
    size = (300, 300)

    def __init__(self, input):
        try:
            img = Image.open(input).resize(ImageVector.size)
            # 用getdata()方法提取其所有像素。每个像素都是由红绿蓝三色构成的元组
            self.pixels = img.getdata()
        except:
            # 构造函数也可以直接接收像素列表
            self.pixels = input

    def image(self):
        # 返回底层的PIL图像，通过类上的size属性指定大小
        img = Image.new('RGB', ImageVector.size)

        img.putdata([(int(r), int(g), int(b))
                     for r, g, b in self.pixels])
        return img
    def add(self, img2):
        # 图片向量的加法是对每个像素的红绿蓝值求和实现的
        return ImageVector(tuple(
            tuple(int(r1) + int(r2) for r1, r2 in zip(p1, p2))
            for p1, p2 in zip(self.pixels, img2.pixels)
        ))
    
    def scale(self, scalar):
        # 将每个像素的红、绿、蓝乘以给定标量
        return ImageVector(tuple(
            tuple(int(r * scalar) for r in p)
            for p in self.pixels
        ))
    
    @classmethod
    def zero(cls):
        total_pixels = cls.size[0] * cls.size[1]
        return ImageVector([(0, 0, 0) for _ in range(0, total_pixels)])
    
    def _repr_png_(self):
        # Jupyter Notebook用来显示图片
        return self.image()._repr_png_()