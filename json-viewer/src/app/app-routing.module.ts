import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JsonViewComponent } from './pages/json-view/json-view.component';
import { TicketViewComponent } from './pages/ticket-view/ticket-view.component';

const routes: Routes = [
  { path: 'view/:id', component: JsonViewComponent },
  { path: 'ticket/:id', component: TicketViewComponent },
  { path: 'ticket', redirectTo: 'ticket/demo', pathMatch: 'full' },
  { path: '', redirectTo: 'view/demo', pathMatch: 'full' },
  { path: '**', redirectTo: 'view/demo' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
