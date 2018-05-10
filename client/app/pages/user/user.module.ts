import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user.route';
import { UserComponent } from './user.component';
import { AssetsComponent } from './assets/assets.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../../shared';
import { BlocksComponent } from './blocks/blocks.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AddressesComponent } from './addresses/addresses.component';
import { BlockInfoComponent } from './block-info/block-info.component';
import { AddressInfoComponent } from './address-info/address-info.component';

@NgModule({
  imports: [SharedModule, UserRoutingModule],
  exports: [],
  declarations: [
    UserComponent, AssetsComponent, HomeComponent,
    BlocksComponent, TransactionsComponent, AddressesComponent,
    BlockInfoComponent, AddressInfoComponent
  ],
  providers: [],
})
export class UserModule { }
