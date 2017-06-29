#include <SDL.h>
#include "grass.h"
#include "flower.h"
#include <SDL_ttf.h>
#include <iostream>
#include <ctime>
#include <utility>

int const MAX_SPEED = 16;
int const SCREEN_X = 1366;
int const SCREEN_Y = 768;
int const MESSAGE_DURATION_MAX = 3;
int const BEGINNING_FLOWER_SIZE = 2;

void draw(SDL_Renderer *renderer, grass &grass, flower &flower)
{
	// Draw grass
	grass.drawGrass(renderer);

	// Draw flower
	if ((flower.x >= 0 && flower.x <= SCREEN_X) && (flower.y >= 0 && flower.y <= SCREEN_Y))
	{
		flower.draw(renderer);
	}

	// Show what was drawn
	SDL_RenderPresent(renderer);
}

int main(int argc, char* argv[])
{
	bool moving = false;

	grass grass(SCREEN_X, SCREEN_Y * 2 / 3, SCREEN_Y/3, 8, 50);
	flower flower((SCREEN_X / 2 - 2), (SCREEN_Y * 2 / 3), BEGINNING_FLOWER_SIZE);

	SDL_Renderer *renderer = NULL;
	SDL_Rect centerBox, smallRange, midRange, bigRange;
	SDL_Rect textRect = { SCREEN_X / 2 - 200, SCREEN_Y / 2 - 50, 400, 100 };
	SDL_Event event;
	SDL_Window *window = NULL;
	SDL_Surface *textSurface = NULL;
	SDL_Surface *windowSurface;
	TTF_Font *Sans = NULL;
	SDL_Texture *text = NULL;
	SDL_Color white = { 255, 255, 255 };
	
	bool running = true;

	if (SDL_Init(SDL_INIT_VIDEO) < 0)
	{
		std::cout << "Window initialization error: " << SDL_GetError() << std::endl;
		running = false;
	}
	else
	{
		window = SDL_CreateWindow("RPGL", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, SCREEN_X, SCREEN_Y, SDL_WINDOW_SHOWN | SDL_WINDOW_FULLSCREEN_DESKTOP);
		if (window == NULL)
		{
			std::cout << "Window creation error: " << SDL_GetError() << std::endl;
			running = false;
		}
		else
		{
  			windowSurface = SDL_GetWindowSurface(window);
			renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
		}
	}
	if (TTF_Init() < 0)
	{
		std::cout << "Error: " << TTF_GetError() << std::endl;
		running = false;
	}

	centerBox.x = (SCREEN_X/2) - 25;
	centerBox.y = (SCREEN_Y/2) - 25;
	centerBox.w = 50;
	centerBox.h = 50;

	smallRange.x = 0;
	smallRange.y = SCREEN_Y * 2 / 3;
	smallRange.h = SCREEN_Y * 2 / 27;
	smallRange.w = SCREEN_X;

	midRange.x = 0;
	midRange.w = SCREEN_X;
	midRange.y = SCREEN_Y * 2 / 27 + SCREEN_Y * 2 / 3;
	midRange.h = SCREEN_Y / 9;

	bigRange.x = 0;
	bigRange.w = SCREEN_X;
	bigRange.y = SCREEN_Y * 5 / 27 + SCREEN_Y * 2 / 3;
	bigRange.h = SCREEN_Y * 4 / 27;
	
	// Main game loop
	while (running == true)
	{
		// Process events
		while (SDL_PollEvent(&event));
		{
			if (event.type == SDL_QUIT)
			{
				running = false;
			}
			else if (event.type == SDL_KEYDOWN)
			{
				if (event.key.keysym.sym == SDLK_ESCAPE)
				{
					running = false;
				}
			}

		}
			// Clear screen
			SDL_SetRenderDrawColor(renderer, 196, 210, 241, 255);
			SDL_RenderClear(renderer);

			int mouse_x, mouse_y;
			moving = false;

			SDL_GetMouseState(&mouse_x, &mouse_y);
			double flower_size = 0;
			double x_speed, y_speed;
			x_speed = 0;
			y_speed = 0;
			if (mouse_x <= centerBox.x)
			{
				double x_diff = centerBox.x - mouse_x;
				x_speed = x_diff / ((centerBox.x + centerBox.w) / 2) * MAX_SPEED;
				if (flower.y >= smallRange.y && flower.y <= smallRange.y + smallRange.h)
				{
					flower_size = BEGINNING_FLOWER_SIZE;
				}
				else if (flower.y >= midRange.y && flower.y <= midRange.y + midRange.h)
				{
					flower_size = BEGINNING_FLOWER_SIZE * 2;
				}
				else if (flower.y >= bigRange.y && flower.y <= bigRange.y + bigRange.h)
				{
					flower_size = BEGINNING_FLOWER_SIZE * 4;
				}
				moving = true;
			}
			else if (mouse_x >= (centerBox.x + centerBox.w))
			{
				double x_diff = centerBox.x + centerBox.w - mouse_x;
				x_speed = x_diff / ((centerBox.x + centerBox.w) / 2) * MAX_SPEED;
				if (flower.y >= smallRange.y && flower.y <= smallRange.y + smallRange.h)
				{
					flower_size = BEGINNING_FLOWER_SIZE;
				}
				else if (flower.y >= midRange.y && flower.y <= midRange.y + midRange.h)
				{
					flower_size = BEGINNING_FLOWER_SIZE * 2;
				}
				else if (flower.y >= bigRange.y && flower.y <= bigRange.y + bigRange.h)
				{
					flower_size = BEGINNING_FLOWER_SIZE * 4;
				}
				moving = true;
			}

			if (mouse_y <= centerBox.y)
			{
				double y_diff = centerBox.y - mouse_y;
				y_speed = y_diff / ((centerBox.y + centerBox.h) / 2) * MAX_SPEED;
				if (flower.y >= smallRange.y && flower.y <= smallRange.y + smallRange.h)
				{
					flower_size = BEGINNING_FLOWER_SIZE;
				}
				else if (flower.y >= midRange.y && flower.y <= midRange.y + midRange.h)
				{
					flower_size = BEGINNING_FLOWER_SIZE * 2;
				}
				else if (flower.y >= bigRange.y && flower.y <= bigRange.y + bigRange.h)
				{
					flower_size = BEGINNING_FLOWER_SIZE * 4;
				}
				moving = true;
			}
			else if (mouse_y >= centerBox.y + centerBox.h)
			{
				double y_diff = centerBox.y + centerBox.h - mouse_y;
				y_speed = y_diff / ((centerBox.y + centerBox.h) / 2) * MAX_SPEED;
				if (flower.y >= smallRange.y && flower.y <= smallRange.y + smallRange.h)
				{
					flower_size = BEGINNING_FLOWER_SIZE;
				}
				else if (flower.y >= midRange.y && flower.y <= midRange.y + midRange.h)
				{
					flower_size = BEGINNING_FLOWER_SIZE * 2;
				}
				else if (flower.y >= bigRange.y && flower.y <= bigRange.y + bigRange.h)
				{
					flower_size = BEGINNING_FLOWER_SIZE * 4;
				}
				moving = true;
			}
			if (moving)
			{
				Sans = TTF_OpenFont("OpenSans-Regular.ttf", 24);
				textSurface = TTF_RenderText_Solid(Sans, "Roll for damage.", white);
				text = SDL_CreateTextureFromSurface(renderer, textSurface);
				
				SDL_SetRenderDrawColor(renderer, 50, 50, 50, 255);
				SDL_RenderFillRect(renderer, &textRect);
				SDL_RenderCopy(renderer, text, NULL, &textRect);
				grass.moveView(x_speed, y_speed);
				flower.update(x_speed, y_speed, flower_size);
			}
			else
			{
				SDL_FreeSurface(textSurface);
				Sans = NULL;
				textSurface = NULL;
				SDL_DestroyTexture(text);
				text = NULL;
			}
			draw(renderer, grass, flower);

	}
	// Clear out all objects
		SDL_DestroyWindow(window);
		SDL_DestroyTexture(text);
		SDL_DestroyRenderer(renderer);
		renderer = NULL;
		window = NULL;
		SDL_Quit();

	return 0;
}