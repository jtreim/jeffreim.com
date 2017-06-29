#pragma once
#include <SDL.h>
#include <vector>

class flower
{
private:
	SDL_Rect stalk, center;
	std::vector<SDL_Rect> petals, leaves;
	double s;
public:
	int x, y;
	enum state {GROW, WILT, DEAD, CRUSHED};
	state flowerState;
	double size;

	flower(int x_pos, int y_pos, double size);
	void sizeFlower(double size);
	void update(int x_diff, int y_diff, double size);
	void grow();
	void wilt();
	void draw(SDL_Renderer *renderer);
	~flower();
};

