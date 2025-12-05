import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface Meal {
  day: string;
  breakfast?: any;
  lunch?: any;
  dinner?: any;
  snacks?: any[];
}

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.scss']
})
export class MealPlanComponent implements OnInit {
  weekStartDate: Date = new Date();
  meals: Meal[] = [];
  allRecipes: any[] = [];
  loading: boolean = false;
  currentUser: any = null;
  shoppingList: any = {};
  showShoppingList: boolean = false;

  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    // Set week start to Monday
    const day = this.weekStartDate.getDay();
    const diff = this.weekStartDate.getDate() - day + (day === 0 ? -6 : 1);
    this.weekStartDate = new Date(this.weekStartDate.setDate(diff));
    this.weekStartDate.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.initializeMeals();
        this.loadRecipes();
        this.loadMealPlan();
      }
    });
  }

  initializeMeals(): void {
    this.meals = this.daysOfWeek.map(day => ({
      day,
      breakfast: null,
      lunch: null,
      dinner: null,
      snacks: []
    }));
  }

  loadRecipes(): void {
    this.apiService.getPosts().subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.allRecipes = response.data?.posts || response.data || [];
        }
      },
      error: (err: any) => {
        console.error('Error loading recipes:', err);
      }
    });
  }

  loadMealPlan(): void {
    const weekStart = this.formatDate(this.weekStartDate);
    this.loading = true;

    this.apiService.getMealPlan(weekStart).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data.mealPlans?.length > 0) {
          const mealPlan = response.data.mealPlans[0];
          this.meals = mealPlan.meals || this.meals;
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading meal plan:', err);
        this.loading = false;
      }
    });
  }

  selectRecipe(day: string, mealType: string, recipe: any): void {
    const meal = this.meals.find(m => m.day === day);
    if (meal) {
      if (mealType === 'snacks') {
        if (!meal.snacks) meal.snacks = [];
        if (!meal.snacks.find((r: any) => r._id === recipe._id)) {
          meal.snacks.push(recipe);
        }
      } else {
        (meal as any)[mealType] = recipe;
      }
    }
  }

  removeRecipe(day: string, mealType: string, recipeId?: string): void {
    const meal = this.meals.find(m => m.day === day);
    if (meal) {
      if (mealType === 'snacks' && recipeId) {
        meal.snacks = meal.snacks?.filter((r: any) => r._id !== recipeId) || [];
      } else {
        (meal as any)[mealType] = null;
      }
    }
  }

  saveMealPlan(): void {
    const weekStart = this.formatDate(this.weekStartDate);
    this.loading = true;

    this.apiService.createOrUpdateMealPlan(weekStart, this.meals).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          alert('Meal plan saved successfully!');
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error saving meal plan:', err);
        alert('Failed to save meal plan');
        this.loading = false;
      }
    });
  }

  generateShoppingList(): void {
    const weekStart = this.formatDate(this.weekStartDate);
    this.loading = true;

    this.apiService.generateShoppingList(weekStart).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.shoppingList = response.data.shoppingList || {};
          this.showShoppingList = true;
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error generating shopping list:', err);
        alert('Failed to generate shopping list');
        this.loading = false;
      }
    });
  }

  previousWeek(): void {
    this.weekStartDate.setDate(this.weekStartDate.getDate() - 7);
    this.loadMealPlan();
  }

  nextWeek(): void {
    this.weekStartDate.setDate(this.weekStartDate.getDate() + 7);
    this.loadMealPlan();
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getWeekRange(): string {
    const endDate = new Date(this.weekStartDate);
    endDate.setDate(endDate.getDate() + 6);
    return `${this.weekStartDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  }

  onRecipeSelect(day: string, mealType: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const recipeId = target.value;
    if (recipeId) {
      const recipe = this.allRecipes.find(r => r._id === recipeId);
      if (recipe) {
        this.selectRecipe(day, mealType, recipe);
      }
    }
    // Reset select to empty
    target.value = '';
  }

  getShoppingListCategories(): string[] {
    return Object.keys(this.shoppingList);
  }
}

