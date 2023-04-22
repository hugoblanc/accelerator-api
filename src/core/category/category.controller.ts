import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.service.createCategory(createCategoryDto);
  }

  @Get()
  getAllCategories(@Query('name') name?: string) {
    return this.service.getCategories(name);
  }
}
