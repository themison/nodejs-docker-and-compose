import { Module } from '@nestjs/common';
import { WishesModule } from './wishes/wishes.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { UsersModule } from './users/users.module';
import { OffersModule } from './offers/offers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './offers/entity/offer.entity';
import { User } from './users/entity/user.entity';
import { Wish } from './wishes/entity/wish.entity';
import { Wishlist } from './wishlist/entity/wishlist.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'student',
      password: '123',
      database: 'kupipodariday',
      entities: [User, Offer, Wish, Wishlist],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    WishesModule,
    WishlistModule,
    UsersModule,
    OffersModule,
    AuthModule,
  ],
})
export class AppModule {}
