import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { ContestComponent } from './contest/contest.component';



const routes: Routes = [
  { path: '',
    redirectTo:'signup',
    pathMatch: 'full' 
  },
  { 
    path: 'signup',
    component: SignupComponent 
  },
  { 
    path: 'contest',
    component: ContestComponent 
  }
];

@NgModule({
 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
