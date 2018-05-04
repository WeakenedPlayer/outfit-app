import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { ApplicationFormComponent } from 'app-views';

export const routes: Routes = [
    { path: '', component: ApplicationFormComponent },
    { path: 'application', component: ApplicationFormComponent }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
