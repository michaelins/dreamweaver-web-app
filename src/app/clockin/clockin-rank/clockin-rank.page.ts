import { Component, OnInit } from '@angular/core';
import { Rank, CollectionOfRank, ClockinRankService } from './clockin-rank.service';

@Component({
  selector: 'app-clockin-rank',
  templateUrl: './clockin-rank.page.html',
  styleUrls: ['./clockin-rank.page.scss'],
})
export class ClockinRankPage implements OnInit {

  ranks: Rank[];
  collectionOfRank: CollectionOfRank = {};
  recordsPageSize = 10;
  equalObjs = [{ eqObj: 0, field: 'status' }];
  sortObjs = [{ direction: 0, field: 'count' }];

  constructor(
    private rankService: ClockinRankService
  ) { }

  ngOnInit() {
    this.rankService.getRanks(1, this.recordsPageSize, this.equalObjs, this.sortObjs).subscribe(resp => {
      console.log(resp);
      this.ranks = resp.content;
      this.collectionOfRank = resp;
    }, error => {
      console.log(error);
    });
  }

  loadData(event) {
    if (this.collectionOfRank.last) {
      event.target.complete();
      event.target.disabled = true;
    } else if (this.collectionOfRank.number + 2 <= this.collectionOfRank.totalPages) {
      this.rankService.getRanks(
        this.collectionOfRank.number + 2,
        this.recordsPageSize,
        this.equalObjs,
        this.sortObjs
      ).subscribe(resp => {
        console.log(resp);
        this.ranks.push(...resp.content);
        this.collectionOfRank = resp;
        event.target.complete();
      }, error => {
        console.log(error);
      });
    }
  }

  doRefresh(event?) {
    this.rankService.getRanks(1, this.recordsPageSize, this.equalObjs, this.sortObjs).subscribe(resp => {
      console.log(resp);
      this.ranks = resp.content;
      this.collectionOfRank = resp;
    }, error => {
      console.log(error);
    }, () => {
      if (event) {
        event.target.complete();
      }
    });
  }
}
