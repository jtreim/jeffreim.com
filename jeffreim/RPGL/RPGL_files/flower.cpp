#include "flower.h"


flower::flower(int x_pos, int y_pos, double size)
{
	x = x_pos;
	y = y_pos;
	s = size;

	// Main stalk
	stalk.x = x;
	stalk.w = size * 2;
	stalk.h = size * 12;
	stalk.y = y - stalk.h;

	// Flower center
	center.y = stalk.y + stalk.h / 6;
	center.h = stalk.w * 3/2;
	center.w = stalk.w * 3/2;
	center.x = x - center.w / 8;

	SDL_Rect rect;
	double rect_center_x, rect_center_y;
	// Leaves
	rect.w = stalk.h * 3 / 8;
	rect.h = stalk.w * 5 / 8;
	rect.x = stalk.x - rect.w * 3/10;
	rect.y = stalk.y + stalk.h * 3 / 4;
	leaves.push_back(rect);

	rect.x += rect.w - stalk.w * 3 / 8;
	rect.y -= stalk.w / 4;
	rect.w = stalk.w * 3 / 4;
	rect.h = stalk.w * 3 / 4;
	leaves.push_back(rect);

	rect.x = rect.x - leaves[0].w;
	leaves.push_back(rect);

	rect.x = rect.x - rect.w * 3 / 16;
	rect.y = rect.y - rect.w * 3 / 16;
	rect.w = rect.w / 2;
	rect.h = rect.w;
	leaves.push_back(rect);

	rect.x += leaves[0].w + stalk.w / 2;
	leaves.push_back(rect);

	// Petals
	rect.h = stalk.w * 4;
	rect.y = center.y - (rect.h - center.h)/2;
	rect.w = stalk.w * 2;
	rect.x = center.x - (rect.w - center.w) / 2;
	petals.push_back(rect);

	rect.h = rect.h * 9 / 8;
	rect.w = rect.w * 3 / 4;
	rect.y = center.y - (rect.h - center.h) / 2;
	rect.x = center.x - (rect.w - center.w) / 2;
	petals.push_back(rect);

	rect.h = stalk.w * 2;
	rect.y = center.y - (rect.h - center.h) / 2;
	rect.w = stalk.w * 4;
	rect.x = center.x - (rect.w - center.w) / 2;
	petals.push_back(rect);

	rect.h = rect.h * 3 / 4;
	rect.w = rect.w * 9 / 8;
	rect.y = center.y - (rect.h - center.h) / 2;
	rect.x = center.x - (rect.w - center.w) / 2;
	petals.push_back(rect);

	flowerState = GROW;
}

void flower::sizeFlower(double size)
{
	// Main stalk
	stalk.x = x;
	stalk.w = size * 2;
	stalk.h = size * 12;
	stalk.y = y - stalk.h;

	// Flower center
	center.y = stalk.y + stalk.h / 6;
	center.h = stalk.w * 3 / 2;
	center.w = stalk.w * 3 / 2;
	center.x = x - center.w / 8;

	SDL_Rect rect;
	double rect_center_x, rect_center_y;
	// Leaves
	rect.w = stalk.h * 3 / 8;
	rect.h = stalk.w * 5 / 8;
	rect.x = stalk.x - rect.w * 3 / 10;
	rect.y = stalk.y + stalk.h * 3 / 4;
	leaves.emplace(leaves.begin(), rect);
	leaves.erase(leaves.begin() + 1);

	rect.x += rect.w - stalk.w * 3 / 8;
	rect.y -= stalk.w / 4;
	rect.w = stalk.w * 3 / 4;
	rect.h = stalk.w * 3 / 4;
	leaves.emplace(leaves.begin() + 1, rect);
	leaves.erase(leaves.begin() + 2);

	rect.x = rect.x - leaves[0].w;
	leaves.emplace(leaves.begin() + 2, rect);
	leaves.erase(leaves.begin() + 3);

	rect.x = rect.x - rect.w * 3 / 16;
	rect.y = rect.y - rect.w * 3 / 16;
	rect.w = rect.w / 2;
	rect.h = rect.w;
	leaves.emplace(leaves.begin() + 3, rect);
	leaves.erase(leaves.begin() + 4);

	rect.x += leaves[0].w + stalk.w / 2;
	leaves.emplace(leaves.begin() + 4, rect);
	leaves.erase(leaves.begin() + 5);

	// Petals
	rect.h = stalk.w * 4;
	rect.y = center.y - (rect.h - center.h) / 2;
	rect.w = stalk.w * 2;
	rect.x = center.x - (rect.w - center.w) / 2;
	petals.emplace(petals.begin(), rect);
	petals.erase(petals.begin() + 1);

	rect.h = rect.h * 9 / 8;
	rect.w = rect.w * 3 / 4;
	rect.y = center.y - (rect.h - center.h) / 2;
	rect.x = center.x - (rect.w - center.w) / 2;
	petals.emplace(petals.begin() + 1, rect);
	petals.erase(petals.begin() + 2);

	rect.h = stalk.w * 2;
	rect.y = center.y - (rect.h - center.h) / 2;
	rect.w = stalk.w * 4;
	rect.x = center.x - (rect.w - center.w) / 2;
	petals.emplace(petals.begin() + 2, rect);
	petals.erase(petals.begin() + 3);

	rect.h = rect.h * 3 / 4;
	rect.w = rect.w * 9 / 8;
	rect.y = center.y - (rect.h - center.h) / 2;
	rect.x = center.x - (rect.w - center.w) / 2;
	petals.emplace(petals.begin() + 3, rect);
	petals.erase(petals.begin() + 4);
	s = size;
}

void flower::update(int x_diff, int y_diff, double size)
{
	x += x_diff;
	if (x >= 360 + 1366)
	{
		x = 0;
	}
	else if (x <= -360)
	{
		x = 1366;
	}
	y += y_diff;
	sizeFlower(size);
}

void flower::grow()
{

}

void flower::wilt()
{

}

void flower::draw(SDL_Renderer *renderer)
{
	// Draws the stalk first with darkest green
	SDL_SetRenderDrawColor(renderer, 67, 132, 6, 255);
	SDL_RenderFillRect(renderer, &stalk);

	// Draws the leaves next with same green
	for each(SDL_Rect rect in leaves)
	{
		SDL_RenderFillRect(renderer, &rect);
	}

	// Draws the petals next with darker yellow
	SDL_SetRenderDrawColor(renderer, 229, 191, 26, 255);
	for each (SDL_Rect rect in petals)
	{
		SDL_RenderFillRect(renderer, &rect);
	}

	// Draws the center last with mid yellow
	SDL_SetRenderDrawColor(renderer, 255, 224, 88, 255);
	SDL_RenderFillRect(renderer, &center);
}

flower::~flower(){}
