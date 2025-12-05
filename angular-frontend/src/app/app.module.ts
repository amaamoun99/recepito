import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { CreateRecipeComponent } from './components/create-recipe/create-recipe.component';
import { ExploreComponent } from './components/explore/explore.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { MealPlanComponent } from './components/meal-plan/meal-plan.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'recipe/:id', component: RecipeDetailComponent },
      { path: 'create', component: CreateRecipeComponent },
      { path: 'explore', component: ExploreComponent },
      { path: 'profile/:id', component: UserProfileComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'meal-plan', component: MealPlanComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RecipeDetailComponent,
    CreateRecipeComponent,
    ExploreComponent,
    UserProfileComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    MainLayoutComponent,
    NavbarComponent,
    SidebarComponent,
    MealPlanComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

