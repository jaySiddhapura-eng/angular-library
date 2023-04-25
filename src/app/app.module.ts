import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SampleLibModule } from 'sample-lib';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SampleLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
