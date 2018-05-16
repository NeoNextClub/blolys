import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { GlobalService } from '../../../core';

@Component({
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  displayedColumns = ['name', 'type', 'amount', 'addresses', 'transactions', 'admin', 'assetId'];
  dataSource: MatTableDataSource<any>;
  pageIndex: Number = 0;
  pageSize: any = 16;
  pageLength: number;
  assetType: String = 'Assets'; // 0 => assets, 1 => nep5Assets
  showSortTran: Boolean = false;
  showSortAddr: Boolean = false;

  constructor(
    private http: HttpClient,
    private global: GlobalService
  ) { }

  ngOnInit() {
    this.getAssets(1, this.pageSize);
  }
  sortTrans() {
    this.showSortTran = !this.showSortTran;
  }
  sortAddr() {
    this.showSortAddr = !this.showSortAddr;
  }
  getAssets (pageIndex, pageSize) {
    pageIndex = Number(pageIndex);
    this.http.post(`${this.global.apiDomain}/api/asset`,
      { 'method': 'getassets', 'params': [pageIndex, pageSize] }).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.result.data);
      this.pageLength = Math.ceil(res.result.total / this.pageSize);
    }, (err) => {
      console.log(err);
    });
  }
  getNep5Assets (pageIndex, pageSize) {
    pageIndex = Number(pageIndex);
    this.http.post(`${this.global.apiDomain}/api/asset`,
      { 'method': 'getnep5assets', 'params': [pageIndex, pageSize] }).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.result.data);
      this.pageLength = Math.ceil(res.result.total / this.pageSize);
    }, (err) => {
      console.log(err);
    });
  }
  changeAssetType (type) {
    if (Number(type) === 0) {
      this.assetType = 'Assets';
    } else {
      this.assetType = 'Nep5';
    }
    this.pageIndex = 1;
    this.onpageGo(1);
  }
  onpageGo(num: number) {
    if (this.assetType === 'Assets') {
      this.getAssets(num, this.pageSize);
    } else {
      this.getNep5Assets(num, this.pageSize);
    }
  }
}
