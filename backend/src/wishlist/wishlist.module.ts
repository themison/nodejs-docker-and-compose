import { Module } from '@nestjs/common';
import { Wishlist } from './entity/wishlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhishlistsController } from './whishlists.controller';
import { WhishlistsService } from './whishlists.service';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), WishesModule],
  controllers: [WhishlistsController],
  providers: [WhishlistsService],
  exports: [WhishlistsService],
})
export class WishlistModule {}
