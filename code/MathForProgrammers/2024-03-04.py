
# 第2章
from vector_drawing import *

dino_vectors = [(0,0), (2,-2), (6.5,-2), (4.5,0)]

# draw(Points(*dino_vectors), Arrow((2,-2), (0,0), black))


# 练习2.5

# draw(
#     Points(*[(x, x**2) for x in range(-10, 11)]),
#     grid=(1,10),
#     nice_aspect_ratio=False
# )


# 绘制点v=(-1,3)和w=(2,2)，并绘制从v到w的线段

# draw(
#     Points((2,2), (-1,3)),
#     Segment((2,2), (-1,3), color=red)
# )

# 练习2.6：对于向量u=(-2,0)、向量v=(1.5,1.5)和向量w=(4,1),u + v、 v + w和u + w的和是什么？u + v + w的和是什么？

# u + v = (-0.5,1.5) v + w = (5.5,2.5) u + w = (2,1) u + v + w = (3.5,2.5)


def add(points):
    # x, y = 0, 0
    # for i,o in enumerate(points.vectors):
    #     x += o[0]
    #     y += o[1]
    # return (x,y)
    return (sum(x[0] for x in points.vectors),sum(y[1] for y in points.vectors))

#print (add(Points((2,2), (-1,3), (-1,3), (-1,3))))


# 练习2.7：实现函数translate(translation, vectors)，接收一个平移向量和一个向量列表，返回一个根据平移向量平移后的向量列表。例如，对于translate ((1,1), [(0,0), (0,1,), (-3,-3)]) ，它应该返回[(1,1),(1,2), (-2, -2)]。

def translate(translation, vectors):
    # i, j = translation[0], translation[1]
    # return ((d[0] + i, d[1] + j) for d in vectors)
    return [add(Points(translation,v)) for v in vectors]

res = translate ((1,1), [(0,0), (0,1), (-3,-3)])

for r in res:
    print(r) 



# 练习2.9