
# 第2章
from vector_drawing import *

dino_vectors = [(0,0), (2,-2), (6.5,-2), (4.5,0)]

draw(Points(*dino_vectors), Arrow((2,-2), (0,0), black))


# 练习2.5

draw(
    Points(*[(x, x**2) for x in range(-10, 11)]),
    grid=(1,10),
    nice_aspect_ratio=False
)