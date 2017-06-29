#pragma once
#include <SDL.h>
#include <utility>
#include <vector>
class grass
{
private:
	const int GRASS_BLADE_WIDTH = 2;
	const int GRASS_BLADE_HEIGHT = 8;
	enum color{LIGHT, DARK};
	std::vector<std::pair <SDL_Rect, color>> grassBlades;
	int s;

public:
	enum shiftView{ SHIFT_X, SHIFT_Y };
	int w, h, d;
	grass(int width, int height, int depth, int size, int amount);
	void newGrass(int amount);
	void drawGrass(SDL_Renderer *renderer);
	void moveView(int speed_x, int speed_y);
	~grass();
};

