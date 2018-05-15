import { Component, OnInit , ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { GlobalService } from '../../../core';

@Component({
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit {
  displayedColumns = ['index', 'txNum', 'time', 'size', 'nextConsensus'];
  dataSource: MatTableDataSource<any>;
  pageSize: any = 16;
  pageLength: number;

  constructor(
    private http: HttpClient,
    private global: GlobalService
  ) { }

  ngOnInit() {
    this.getIssues(1, this.pageSize);
  }
  getIssues(pageIndex, pageSize) {
    this.http.post(`${this.global.apiDomain}/api/block`,
      { 'method': 'getblocks', 'params': [pageIndex, pageSize] }).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.result.data);
      this.pageLength = Math.ceil(res.result.total / this.pageSize);
    }, (err) => {
      console.log(err);
    });
  }
  onpageGo(num: number) {
    this.getIssues(num, this.pageSize);
  }
}
