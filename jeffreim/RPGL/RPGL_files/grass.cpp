#include "grass.h"
#include <stdlib.h>
#include <time.h>


grass::grass(int width, int height, int depth, int size, int amount)
{
	w = width;
	h = height;
	d = depth;
	s = size;
	grass::newGrass(amount);
	srand(time(NULL));
}

void grass::newGrass(int amount)
{
	for (int n = 0; n < amount; n++)
	{
		SDL_Rect newBlade;
		newBlade.x = rand() % (w - GRASS_BLADE_WIDTH);
		newBlade.y = (rand() % d) + h - GRASS_BLADE_HEIGHT/2;
		float ratio = ((float)newBlade.y - (float)h)/(float)d;
		newBlade.w = GRASS_BLADE_WIDTH * s * ratio;
		newBlade.h = GRASS_BLADE_HEIGHT * s * ratio;

		int c = rand() % 2;
		color bladeColor;
		switch (c)
		{
		case 0: bladeColor = LIGHT; break;
		case 1: bladeColor = DARK; break;
		default: bladeColor = LIGHT; break;
		}
		grassBlades.push_back(std::pair<SDL_Rect, color>(newBlade, bladeColor));
	}
}

void grass::drawGrass(SDL_Renderer *renderer)
{
	SDL_Rect background_grass;
	background_grass.x = 0;
	background_grass.y = h;
	background_grass.w = w;
	background_grass.h = d;
	SDL_SetRenderDrawColor(renderer, 152, 229, 79, 255);
	SDL_RenderFillRect(renderer, &background_grass);
	
	for each (std::pair<SDL_Rect, color> blade in grassBlades)
	{
		switch (blade.second)
		{
			case LIGHT: SDL_SetRenderDrawColor(renderer, 185, 240, 132, 255); break;
			case DARK: SDL_SetRenderDrawColor(renderer, 112, 206, 23, 255); break;
		}
		SDL_RenderFillRect(renderer, &blade.first);
	}
}

void grass::moveView(int speed_x, int speed_y)
{
	for (int n = 0; n < grassBlades.size(); n++)
	{
		SDL_Rect newBlade = grassBlades[n].first;
		color sameColor = grassBlades[n].second;
		float ratio = ((float)grassBlades[n].first.y - (float)h) / (float)d;
		newBlade.x += speed_x * ratio;
		newBlade.y += speed_y * ratio;
		newBlade.h = GRASS_BLADE_HEIGHT * s * ratio;
		newBlade.w = GRASS_BLADE_WIDTH * s * ratio;
		if (newBlade.x < 0)
		{
			newBlade.x = w;
			newBlade.y = (rand() % d) + h;
		}
		else if (newBlade.x > w)
		{
			newBlade.x = 0;
			newBlade.y = (rand() % d) + h;
		}
		grassBlades.emplace(grassBlades.begin() + n, std::pair<SDL_Rect, color>(newBlade, sameColor));
		grassBlades.erase(grassBlades.begin() + (n + 1));

		if (newBlade.y > h + d)
		{
			newBlade.y = h + d / s + GRASS_BLADE_HEIGHT;
			newBlade.w = GRASS_BLADE_WIDTH;
			newBlade.h = GRASS_BLADE_HEIGHT;
		}
		if (newBlade.w == 0)
		{
			newBlade.y = h + d;
			newBlade.h = GRASS_BLADE_HEIGHT * s;
			newBlade.w = GRASS_BLADE_WIDTH * s;
			newBlade.x = (rand() % (w - GRASS_BLADE_WIDTH * s));
		}
		grassBlades.emplace(grassBlades.begin() + n, std::pair<SDL_Rect, color>(newBlade, sameColor));
		grassBlades.erase(grassBlades.begin() + (n + 1));
	}
}

grass::~grass()
{}
