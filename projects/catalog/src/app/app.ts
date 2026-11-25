import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { CartStore, Coffee } from 'shared-cart';

const COFFEES: Coffee[] = [
  { id: 1, name: 'Espresso', price: 8, emoji: '☕' },
  { id: 2, name: 'Americano', price: 10, emoji: '🫖' },
  { id: 3, name: 'Cappuccino', price: 14, emoji: '🥛' },
  { id: 4, name: 'Latte', price: 15, emoji: '🍼' },
  { id: 5, name: 'Flat White', price: 16, emoji: '✨' },
  { id: 6, name: 'Mocha', price: 18, emoji: '🍫' },
  { id: 7, name: 'Cold Brew', price: 17, emoji: '🧊' },
  { id: 8, name: 'Affogato', price: 20, emoji: '🍨' },
];

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe],
  template: `
    <section class="catalog">
      <h2>Menu</h2>
      <div class="filters">
        <input
          type="search"
          placeholder="Szukaj kawy..."
          [value]="search()"
          (input)="search.set($any($event.target).value)"
        />
        <label>
          Max cena: {{ maxPrice() | currency: 'PLN' : 'symbol' : '1.0-0' }}
          <input
            type="range"
            min="5"
            max="20"
            [value]="maxPrice()"
            (input)="maxPrice.set(+$any($event.target).value)"
          />
        </label>
      </div>

      <p class="info">Znaleziono: {{ filtered().length }} z {{ coffees.length }}</p>

      <div class="grid">
        @for (coffee of filtered(); track coffee.id) {
          <article class="card">
            <div class="emoji">{{ coffee.emoji }}</div>
            <h3>{{ coffee.name }}</h3>
            <p>{{ coffee.price | currency: 'PLN' : 'symbol' : '1.0-0' }}</p>
            <button (click)="cart.add(coffee)">Dodaj do koszyka</button>
          </article>
        } @empty {
          <p>Brak kaw spełniających kryteria 😢</p>
        }
      </div>
    </section>
  `,
  styles: `
    .filters { display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; }
    input[type='search'] { padding: 0.5rem; min-width: 220px; }
    .info { color: #666; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
    .card { border: 1px solid #ddd; border-radius: 12px; padding: 1rem; text-align: center; }
    .emoji { font-size: 2.5rem; }
    button { background: #6f4e37; color: #fff; border: 0; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; }
    button:hover { background: #8b6347; }
  `,
})
export class App {
  protected readonly cart = inject(CartStore);
  protected readonly coffees = COFFEES;

  protected readonly search = signal('');
  protected readonly maxPrice = signal(20);

  protected readonly filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.coffees.filter(
      (c) => c.price <= this.maxPrice() && c.name.toLowerCase().includes(query),
    );
  });
}
