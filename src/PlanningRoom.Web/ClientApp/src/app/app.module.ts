import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';

import { StorageModule } from '@ngx-pwa/local-storage';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { envModules } from '../environments/environment';
import { AppComponent } from './app.component';
import {
  ControlPanelComponent,
  StoryDialogComponent,
  EntranceComponent,
  MembersListComponent,
  RoomDialogComponent,
  RoomComponent,
  StoriesComponent,
  StoriesListComponent,
  UserNameDialogComponent,
  VotingResultsComponent
} from './components';
import { SafePipe, TimerFormatPipe } from './pipes';
import { reducers } from './store';
import { effects } from './store/effects';


@NgModule({
  declarations: [
    // components
    AppComponent,
    ControlPanelComponent,
    StoryDialogComponent,
    EntranceComponent,
    MembersListComponent,
    RoomDialogComponent,
    RoomComponent,
    StoriesComponent,
    StoriesListComponent,
    UserNameDialogComponent,
    VotingResultsComponent,

    // pipes
    SafePipe,
    TimerFormatPipe
  ],
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,

    BrowserAnimationsModule,

    // Material modules
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatGridListModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatMenuModule,

    RouterModule.forRoot([
      { path: '', component: EntranceComponent },
      { path: 'room/:id', component: RoomComponent }
    ]),
    StorageModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),

    ...envModules
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
