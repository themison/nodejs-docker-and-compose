import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWhishlistDto } from './dto/create-whishlist.dto';
import { UpdateWhishlistDto } from './dto/update-whishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { Errors } from 'src/shared/utils/error-messages.enum';
import { User } from 'src/users/entity/user.entity';
import { Wishlist } from './entity/wishlist.entity';

@Injectable()
export class WhishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    createWhishlistDto: CreateWhishlistDto,
    owner: User,
  ): Promise<Wishlist> {
    const { image, name } = createWhishlistDto;

    const wishes = [];

    for (const itemId of createWhishlistDto.itemsId) {
      const wish = await this.wishesService.findOne(itemId);

      wishes.push(wish);
    }

    return this.wishlistRepository.save({
      image,
      name,
      owner,
      items: wishes,
    });
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async updateOne(
    id: number,
    updateWhishlistDto: UpdateWhishlistDto,
    user: User,
  ) {
    const wishlist = await this.findOne(id);

    let items;
    if (updateWhishlistDto.itemsId) {
      items = await this.wishesService.findManyById(
        updateWhishlistDto.itemsId as number[],
      );
    }
    if (user.id !== wishlist?.owner?.id) {
      throw new BadRequestException(Errors.WRONG_DATA);
    }

    wishlist.items = items;
    return this.wishlistRepository.save(wishlist);
  }

  async removeOne(id: number, userId: number) {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(Errors.WISHLIST_DELETE_FOREIGN);
    }

    return this.wishlistRepository.delete({ id });
  }
}
