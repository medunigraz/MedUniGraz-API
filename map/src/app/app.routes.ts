// - Routes instead of RouteConfig
// - RouterModule instead of provideRoutes
import { Routes, RouterModule } from '@angular/router';

import { RouteCompComponent } from './route-comp/route-comp.component';

export const routes: Routes = [
  {
    path: '**',
    component: RouteCompComponent
  }
];
