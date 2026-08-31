import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JsonViewComponent } from './pages/json-view/json-view.component';
import { TicketComponent } from './pages/ticket/ticket.component';

@NgModule({
  declarations: [
    AppComponent,
    JsonViewComponent,
    TicketComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
