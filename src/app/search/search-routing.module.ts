import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPage } from './search.page';

const routes: Routes = [
    {
        path: 'result',
        loadChildren: './search-result/search-result.module#SearchResultPageModule'
    },
    {
        path: '',
        component: SearchPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SearchRoutingModule { }
