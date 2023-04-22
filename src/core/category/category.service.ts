import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  getAllCategories() {
    return this.prisma.category.findMany();
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const categoryExists = await this.checkIfCategoryExists(
      createCategoryDto.name,
    );

    if (categoryExists) {
      throw new BadRequestException('Category already exists');
    }

    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
      },
    });
  }

  private checkIfCategoryExists(name: string) {
    return this.prisma.category.findFirst({
      where: {
        name: {
          mode: 'insensitive',
          equals: name,
        },
      },
    });
  }
}
