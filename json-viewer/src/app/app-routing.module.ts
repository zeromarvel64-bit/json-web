import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketComponent } from './pages/ticket/ticket.component';

const routes: Routes = [
  { path: 'escenario_tae_exitosa',    component: TicketComponent, data: { scenario: 'tae_exitosa' } },
  { path: 'escenario_tae_no_exitosa', component: TicketComponent, data: { scenario: 'tae_no_exitosa' } },
  { path: 'escenario_pds_exitoso',    component: TicketComponent, data: { scenario: 'pds_exitoso' } },
  { path: 'escenario_pds_no_exitoso', component: TicketComponent, data: { scenario: 'pds_no_exitoso' } },
  { path: '', redirectTo: 'escenario_tae_exitosa', pathMatch: 'full' },
  { path: '**', redirectTo: 'escenario_tae_exitosa' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
