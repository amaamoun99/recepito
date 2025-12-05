import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent {
  recipeForm: FormGroup;
  imagePreview: string | null = null;
  isSubmitting: boolean = false;

  // Cuisine options
  cuisineOptions = [
    'Italian',
    'Mexican',
    'Chinese',
    'Indian',
    'Japanese',
    'French',
    'American',
    'Mediterranean',
    'Thai',
    'Korean',
    'Greek',
    'Spanish',
    'Middle Eastern',
    'Vietnamese',
    'Caribbean',
    'African',
    'International',
    'Other'
  ];

  // Difficulty options
  difficultyOptions = ['Easy', 'Medium', 'Hard'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      cuisine: ['', Validators.required], // Added cuisine field
      difficulty: ['', Validators.required], // Added difficulty field
      prepTime: ['', [Validators.required, Validators.min(0)]],
      cookTime: ['', [Validators.required, Validators.min(0)]],
      servings: ['', [Validators.required, Validators.min(1)]],
      ingredients: this.fb.array([
        this.fb.group({
          name: ['', Validators.required],
          amount: ['', Validators.required]
        })
      ]),
      instructions: this.fb.array([
        this.fb.control('', Validators.required)
      ]),
      tags: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.fb.group({
      name: ['', Validators.required],
      amount: ['', Validators.required]
    }));
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  addInstruction(): void {
    this.instructions.push(this.fb.control('', Validators.required));
  }

  removeInstruction(index: number): void {
    if (this.instructions.length > 1) {
      this.instructions.removeAt(index);
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.recipeForm.patchValue({ image: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      this.isSubmitting = true;
      const formValue = this.recipeForm.value;
      
      const formData = new FormData();
      formData.append('title', formValue.title);
      formData.append('description', formValue.description);
      formData.append('cuisine', formValue.cuisine); // Use selected cuisine
      formData.append('difficulty', formValue.difficulty); // Use selected difficulty
      formData.append('servings', formValue.servings);
      formData.append('cookingTime', (parseInt(formValue.prepTime) + parseInt(formValue.cookTime)).toString());
      formData.append('prepTime', formValue.prepTime);
      formData.append('diet', 'Regular');
      formData.append('image', formValue.image);
      
      formValue.ingredients.forEach((ingredient: any, index: number) => {
        formData.append(`ingredients[${index}][name]`, ingredient.name);
        formData.append(`ingredients[${index}][quantity]`, ingredient.amount);
      });
      
      formValue.instructions.forEach((instruction: string, index: number) => {
        formData.append(`instructions[${index}]`, instruction);
      });
      
      const tagsArray = formValue.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      formData.append('tags', JSON.stringify(tagsArray));

      this.apiService.createPost(formData).subscribe({
        next: () => {
          alert('Recipe created successfully!');
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          alert(error.error?.message || 'Failed to create recipe');
          this.isSubmitting = false;
        }
      });
    }
  }
}