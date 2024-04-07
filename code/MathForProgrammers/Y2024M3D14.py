from Chapter_03.draw3d import *

draw3d(
    Points3D((2,2,2), (-1,3,1))
)
# 第3章

def add(*vectors):
    """三维向量相加"""
    by_coordinate = zip(*vectors)

    coordinate_sums = [sum(coords) for coords in by_coordinate]

    return tuple(coordinate_sums)