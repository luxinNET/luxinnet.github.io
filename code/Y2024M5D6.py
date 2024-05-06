class Solution:
    def cherryPickup(self, grid: list[list[int]]) -> int:
        n, m = len(grid), len(grid[0])
        for n in range(len(grid)):
            for m in range