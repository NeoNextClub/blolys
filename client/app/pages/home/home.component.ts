import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { BlockService } from '../block/block.service';
import { AddressService } from '../address/address.service';
import { NotsearchService } from '../notsearch/notsearch.service';
import { AssetService } from '../asset/asset.service';
import { Subscription } from 'rxjs/Subscription';
import { GlobalService } from '../../core';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    total: any = [];
    queryCountTime: any;
    apiDo: string;
    netDo: string;
    searchVal: string = '';

    conditionSub: Subscription = null;
    nep5InfoSub: Subscription = null;
    addrAssetsSub: Subscription = null;
    blockByHeightSub: Subscription = null;
    allcountsSub: Subscription = null;

    ngOnInit() {
        this.checkLangNet();
        this.allcountsSub = this.blockService.Allcounts(this.apiDo).subscribe((res: any) => {
            if (res.result) {
                this.total = res.result;
            }
        });
        this.queryCountTime = setInterval(() => {
            this.allcountsSub = this.blockService.Allcounts(this.apiDo).subscribe((res: any) => {
                if (res.result) {
                    this.total = res.result;
                }
            });
        }, 20000);
    }
    ngOnDestroy() {
        window.clearInterval(this.queryCountTime);
        if (this.conditionSub) {
            this.conditionSub.unsubscribe();
        }
        if (this.nep5InfoSub) {
            this.nep5InfoSub.unsubscribe();
        }
        if (this.addrAssetsSub) {
            this.addrAssetsSub.unsubscribe();
        }
        if (this.blockByHeightSub) {
            this.blockByHeightSub.unsubscribe();
        }
        if (this.allcountsSub) {
            this.allcountsSub.unsubscribe();
        }
    }

    constructor(
        private router: Router,
        private blockService: BlockService,
        private addressService: AddressService,
        private notsearchService: NotsearchService,
        private assetService: AssetService,
        private global: GlobalService
    ) {}

    checkLangNet() {
        if (this.router.url.indexOf('/testnet') < 0) {
            this.apiDo = this.global.apiDomain;
            this.netDo = this.global.netDomain;
        } else {
            this.apiDo = this.global.apiDotest;
            this.netDo = this.global.netDotest;
        }
    }

    search() {
        let value = this.searchVal;
        let isHashPattern: any;
        let isAssetPattern: any;
        let isAddressPattern: any;
        value = value.trim(); // Remove whitespace
        if (value === '') {
            return;
        }
        isHashPattern = /^((0x)?)([0-9a-f]{64})$/;
        isAssetPattern = /^([0-9a-f]{40})$/;
        isAddressPattern = /^A([0-9a-zA-Z]{33})$/;
        if (isHashPattern.test(value)) {
            if (value.length === 64) {
                value = '0x' + value;
            }
            this.conditionSub = this.notsearchService.Condition(this.apiDo, value).subscribe((res: any) => {
                if (res.code === 200) {
                    if (res.result === '1') {
                        this.router.navigate([`${this.netDo}/transaction/${value}`]);
                    } else if (res.result === '0') {
                        this.router.navigate([`${this.netDo}/asset/${value}/rank-bala/1/recent-addr/1`]);
                    }
                } else {
                    this.router.navigate([`${this.netDo}/search/${value}`]);
                }
            });
        } else if (isAssetPattern.test(value)) {
            this.nep5InfoSub = this.assetService.Nep5Info(this.apiDo, value).subscribe((res: any) => {
                if (res.code === 200) {
                    if (typeof res.result === 'string') {
                        this.router.navigate([`${this.netDo}/transaction/${res.result}`]);
                    } else if (typeof res.result === 'object') {
                        this.router.navigate([`${this.netDo}/nep5/${value}/rank-bala/1/recent-addr/1`]);
                    }
                } else {
                    this.router.navigate([`${this.netDo}/search/${value}`]);
                }
            });
        } else if (isAddressPattern.test(value)) {
            this.addrAssetsSub = this.addressService.AddrAssets(this.apiDo, value).subscribe((res: any) => {
                if (res.code === 200) {
                    this.router.navigate([`${this.netDo}/address/${value}/page/1`]);
                } else {
                    this.router.navigate([`${this.netDo}/search/${value}`]);
                }
            });
        } else if (Number(value[0]) >= 0) {
            value = value.replace(/[,，]/g, '');
            let isNumberPattern: any;
            isNumberPattern = /^\d+$/;
            if (!isNaN(Number(value)) && isNumberPattern.test(value)) {
                if (Number.isInteger(Number(value)) && value <= this.total.blockCounts) {
                    this.router.navigate([`${this.netDo}/block/${value}/page/1`]);
                    return;
                }
            }
            this.router.navigate([`${this.netDo}/search/${value}`]);
        } else {
            this.router.navigate([`${this.netDo}/search/${value}`]);
        }
    }
}
