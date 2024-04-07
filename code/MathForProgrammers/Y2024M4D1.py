
from abc import ABCMeta, abstractmethod

class Vector(metchlass=ABCMeta):
    @abstractmethod
    def scale(self,scalar):
        pass

    @abstractmethod
    def add(self,other):
        pass
class Vec2(Vector):
    def __init__(self,x,y):
        self.x = x
        self.y = y

    def add(self, v2):
        """向量加法"""
        return Vec2(self.x + v2.x, self.y + v2.y)
    
    def scale(self, scalar):
        """标量乘法"""
        return Vec2(self.x * scalar, self.y * scalar)
    
    def __eq__(self,other):
        """向量相等"""
        return self.x == other.x and self.y == other.y
    
    def __repr__(self):
        return "Vec2({self.x},{self.y})".format(self.x, self.y)


class Vec3(Vector):
    def __init__(self,x,y,z):
        self.x = x
        self.y = y
        self.z = z

    def add(self, v3):
        """向量加法"""
        return Vec2(self.x + v3.x, self.y + v3.y, self.z + v3.z)
    
    def scale(self, scalar):
        """标量乘法"""
        return Vec2(self.x * scalar, self.y * scalar, self.z * scalar)
    
    def __eq__(self,other):
        """向量相等"""
        return self.x == other.x and self.y == other.y and self.z == other.z
    
    def __repr__(self):
        return "Vec2({self.x},{self.y},{self.z})".format(self.x, self.y, self.z)
    
