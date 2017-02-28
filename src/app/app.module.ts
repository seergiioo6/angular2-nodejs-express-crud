import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BackendComponent } from './backend/backend.component';
import { AboutComponent } from './about/about.component';
import { DataService } from './services/data.service';
import { AuthGuard } from './_guards/index';
import { AuthenticationService, UserService } from './services/index';
import { ToastComponent } from './shared/toast/toast.component';
import { LoginComponent } from './login/login.component';

const routing = RouterModule.forRoot([
    { path: 'login', component: LoginComponent },
    { path: 'about', component: AboutComponent },
    { path: '', component: BackendComponent, canActivate: [AuthGuard], data: { roles: ['admin']}} // role is not used
]);



@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ToastComponent,
    LoginComponent,
    BackendComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [
    DataService,
    ToastComponent,
    AuthGuard,
    AuthenticationService,
    UserService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
