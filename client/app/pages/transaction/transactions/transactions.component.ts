import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../transaction.service';
import { Subscription } from 'rxjs/Subscription';
import { GlobalService } from '../../../core';

@Component({
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {
    transactions: any = [];
    transfer: any = [];
    transferNep5: any = [];
    show: any = [];
    transType: string = 'all';
    pageSize: any = 16;
    pageLength: number;
    pageIndex = 1;
    isProgress: boolean = true;
    apiDo: string;
    netDo: string;

    transSub: Subscription = null;
    transferByTxidSub: Subscription = null;
    nep5TransferByTxidSub: Subscription = null;

    constructor(
        private transactionService: TransactionService,
        private global: GlobalService,
        private router: Router,
        private aRouter: ActivatedRoute
    ) {}

    ngOnInit() {
        this.checkLangNet();
        this.aRouter.params.subscribe(params => {
            const page = Number(params.page);
            this.pageIndex = page;
            this.initShow();
            this.getTrans(page, this.pageSize);
        });
    }
    ngOnDestroy() {
        if (this.transSub) {
            this.transSub.unsubscribe();
        }
        if (this.transferByTxidSub) {
            this.transferByTxidSub.unsubscribe();
        }
        if (this.nep5TransferByTxidSub) {
            this.nep5TransferByTxidSub.unsubscribe();
        }
    }
    checkLangNet() {
        if (this.router.url.indexOf('/testnet') < 0) {
            this.apiDo = this.global.apiDomain;
            this.netDo = this.global.netDomain;
        } else {
            this.apiDo = this.global.apiDotest;
            this.netDo = this.global.netDotest;
        }
    }
    initShow() {
        for (let i = 0; i < this.pageSize; i++) {
            this.show[i] = false;
            this.transfer[i] = 0;
            this.transferNep5[i] = 0;
        }
    }
    getTrans(pageIndex, pageSize) {
        this.transactions = [];
        this.isProgress = true;
        this.transSub = this.transactionService.Trans(this.apiDo, pageIndex, pageSize, this.transType).subscribe((res: any) => {
            if (res.code === 200) {
                if (res.result.total > 0) {
                    this.transactions = res.result.data;
                    this.pageLength = Math.ceil(res.result.total / this.pageSize);
                    this.isProgress = false;
                }
            }
        });
    }
    getTransferByTxid(index, txid) {
        this.transferByTxidSub = this.transactionService.TransferByTxid(this.apiDo, txid).subscribe((res: any) => {
            if (res.code === 200) {
                if (res.result.TxUTXO != null || res.result.TxVouts != null) {
                    this.transfer[index] = res.result;
                }
            }
        });
    }
    getNep5TransferByTxid(index, txid) {
        this.nep5TransferByTxidSub = this.transactionService.Nep5TransferByTxid(this.apiDo, txid).subscribe((res: any) => {
            if (res.code === 200) {
                if (res.result.length > 0) {
                    this.transferNep5[index] = res.result;
                }
            }
        });
    }
    showInfo(index, txid) {
        this.show[index] = !this.show[index];
        if (this.show[index] && this.transfer[index] === 0 && this.transferNep5[index] === 0) {
            this.transfer[index] = '';
            this.transferNep5[index] = '';
            this.getTransferByTxid(index, txid);
            this.getNep5TransferByTxid(index, txid);
        }
    }
    changeTransType(type: string) {
        this.transType = type;
        this.pageIndex += 1;
        this.initShow();
        this.pageIndex = 1;
        this.initShow();
        this.getTrans(1, this.pageSize);
    }
    onpageGo(num: number) {
        const oldUrl = this.router.url;
        const preEndUrl = oldUrl.lastIndexOf(String(this.pageIndex));
        const newUrl = oldUrl.slice(0, preEndUrl) + num;
        this.router.navigateByUrl(newUrl);
    }
}
