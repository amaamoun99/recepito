import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private mockPosts = [
    {
      _id: '1',
      title: 'Chocolate Chip Cookies',
      description: 'Classic homemade chocolate chip cookies that are soft and chewy.',
      ingredients: [
        { name: 'Flour', quantity: '2 cups' },
        { name: 'Sugar', quantity: '1 cup' },
        { name: 'Chocolate Chips', quantity: '1 cup' },
        { name: 'Butter', quantity: '1/2 cup' },
        { name: 'Eggs', quantity: '2' }
      ],
      instructions: [
        { step: 'Preheat oven to 375°F' },
        { step: 'Mix dry ingredients in a bowl' },
        { step: 'Cream butter and sugar together' },
        { step: 'Add eggs and mix well' },
        { step: 'Combine wet and dry ingredients' },
        { step: 'Fold in chocolate chips' },
        { step: 'Drop spoonfuls onto baking sheet' },
        { step: 'Bake for 10-12 minutes' }
      ],
      cookingTime: 25,
      servings: 24,
      difficulty: 'Easy',
      cuisine: 'American',
      author: {
        _id: 'user1',
        username: 'baker123',
        profilePicture: '/img/users/user-1.jpeg'
      },
      imageUrl: '/place-holder.jpg',
      comments: [
        {
          _id: 'c1',
          content: 'These turned out amazing!',
          author: { username: 'foodie99' },
          createdAt: new Date().toISOString()
        }
      ],
      likes: ['user1', 'user2'],
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'Spaghetti Carbonara',
      description: 'Creamy Italian pasta dish with bacon and parmesan.',
      ingredients: [
        { name: 'Spaghetti', quantity: '400g' },
        { name: 'Bacon', quantity: '200g' },
        { name: 'Eggs', quantity: '3' },
        { name: 'Parmesan Cheese', quantity: '100g' },
        { name: 'Black Pepper', quantity: 'To taste' }
      ],
      instructions: [
        { step: 'Cook spaghetti according to package directions' },
        { step: 'Fry bacon until crispy' },
        { step: 'Beat eggs with grated parmesan' },
        { step: 'Drain pasta and mix with bacon' },
        { step: 'Add egg mixture off heat, stirring quickly' },
        { step: 'Season with black pepper and serve' }
      ],
      cookingTime: 20,
      servings: 4,
      difficulty: 'Medium',
      cuisine: 'Italian',
      author: {
        _id: 'user2',
        username: 'chef_mario',
        profilePicture: '/img/users/user-2.jpeg'
      },
      imageUrl: '/place-holder.jpg',
      comments: [],
      likes: ['user1', 'user3'],
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      title: 'Vegetable Stir Fry',
      description: 'Quick and healthy vegetable stir fry with soy sauce.',
      ingredients: [
        { name: 'Mixed Vegetables', quantity: '500g' },
        { name: 'Soy Sauce', quantity: '3 tbsp' },
        { name: 'Garlic', quantity: '3 cloves' },
        { name: 'Ginger', quantity: '1 inch' },
        { name: 'Vegetable Oil', quantity: '2 tbsp' }
      ],
      instructions: [
        { step: 'Heat oil in a large wok or pan' },
        { step: 'Add minced garlic and ginger' },
        { step: 'Stir fry vegetables for 5 minutes' },
        { step: 'Add soy sauce and continue cooking' },
        { step: 'Serve hot over rice' }
      ],
      cookingTime: 15,
      servings: 3,
      difficulty: 'Easy',
      cuisine: 'Asian',
      author: {
        _id: 'user3',
        username: 'veggie_lover',
        profilePicture: '/img/users/user-3.jpeg'
      },
      imageUrl: '/place-holder.jpg',
      comments: [],
      likes: ['user2'],
      createdAt: new Date().toISOString()
    }
  ];

  private mockUsers = [
    {
      _id: 'user1',
      username: 'baker123',
      email: 'baker@example.com',
      profilePicture: '/img/users/user-1.jpeg',
      bio: 'Passionate baker sharing sweet recipes',
      location: 'New York, USA',
      recipes: [this.mockPosts[0]]
    },
    {
      _id: 'user2',
      username: 'chef_mario',
      email: 'mario@example.com',
      profilePicture: '/img/users/user-2.jpeg',
      bio: 'Italian chef with 20 years of experience',
      location: 'Rome, Italy',
      recipes: [this.mockPosts[1]]
    },
    {
      _id: 'user3',
      username: 'veggie_lover',
      email: 'veggie@example.com',
      profilePicture: '/img/users/user-3.jpeg',
      bio: 'Plant-based cooking enthusiast',
      location: 'San Francisco, USA',
      recipes: [this.mockPosts[2]]
    }
  ];

  getMockPosts() {
    return of({
      status: 'success',
      data: {
        posts: this.mockPosts
      }
    }).pipe(delay(500));
  }

  getMockPost(id: string) {
    const post = this.mockPosts.find(p => p._id === id);
    return of({
      status: 'success',
      data: {
        post: post || this.mockPosts[0]
      }
    }).pipe(delay(500));
  }

  getMockUsers() {
    return of({
      status: 'success',
      data: {
        data: this.mockUsers
      }
    }).pipe(delay(500));
  }

  getMockUser(id: string) {
    const user = this.mockUsers.find(u => u._id === id);
    return of({
      status: 'success',
      data: {
        user: user || this.mockUsers[0]
      }
    }).pipe(delay(500));
  }

  getMockUserRecipes(userId: string) {
    const user = this.mockUsers.find(u => u._id === userId);
    return of({
      status: 'success',
      data: {
        recipes: user?.recipes || []
      }
    }).pipe(delay(500));
  }

  checkMockLikes(postIds: string[]) {
    const likesMap: any = {};
    postIds.forEach(id => {
      const post = this.mockPosts.find(p => p._id === id);
      likesMap[id] = {
        isLiked: post?.likes.includes('user1') || false,
        likesCount: post?.likes.length || 0
      };
    });
    return of({
      status: 'success',
      data: {
        likes: likesMap
      }
    }).pipe(delay(300));
  }
}

