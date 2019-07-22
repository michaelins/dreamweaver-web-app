import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClockinPage } from './clockin.page';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'record',
                loadChildren: './clockin-record/clockin-record.module#ClockinRecordPageModule'
            },
            {
                path: 'calendar',
                loadChildren: './clockin-calendar/clockin-calendar.module#ClockinCalendarPageModule'
            },
            {
                path: 'bodydata',
                loadChildren: './clockin-bodydata/clockin-bodydata.module#ClockinBodydataPageModule'
            },
            {
                path: 'rank',
                loadChildren: './clockin-rank/clockin-rank.module#ClockinRankPageModule'
            },
            {
                path: '',
                component: ClockinPage
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClockinRoutingModule { }
