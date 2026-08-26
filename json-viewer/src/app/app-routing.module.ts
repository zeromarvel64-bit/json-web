import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JsonViewComponent } from './pages/json-view/json-view.component';

const routes: Routes = [
  { path: 'view/:id', component: JsonViewComponent },
  { path: '', redirectTo: 'view/demo', pathMatch: 'full' },
  { path: '**', redirectTo: 'view/demo' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
