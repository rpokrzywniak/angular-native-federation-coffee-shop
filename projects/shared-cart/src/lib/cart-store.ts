import { Injectable, computed, effect, signal } from '@angular/core';

export interface Coffee {
  id: number;
  name: string;
  price: number;
  emoji: string;
}

export interface CartItem {
  coffee: Coffee;
  quantity: number;
}

const STORAGE_KEY = 'coffee-shop-cart';

/**
 * Wspólny stan koszyka oparty na signalach.
 * Biblioteka jest współdzielona (singleton) przez shell, catalog i cart,
 * dzięki czemu wszystkie trzy aplikacje widzą tę samą instancję.
 */
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<CartItem[]>(this.load());

  /** Tylko do odczytu na zewnątrz - zmiany tylko przez metody store'a. */
  readonly items = this._items.asReadonly();

  /** Suma sztuk w koszyku (licznik w nagłówku). */
  readonly count = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));

  /** Wartość koszyka. */
  readonly total = computed(() =>
    this._items().reduce((sum, i) => sum + i.coffee.price * i.quantity, 0),
  );

  constructor() {
    // effect: każda zmiana koszyka ląduje w localStorage
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
    });
  }

  add(coffee: Coffee): void {
    this._items.update((items) => {
      const existing = items.find((i) => i.coffee.id === coffee.id);
      return existing
        ? items.map((i) => (i === existing ? { ...i, quantity: i.quantity + 1 } : i))
        : [...items, { coffee, quantity: 1 }];
    });
  }

  setQuantity(id: number, quantity: number): void {
    if (quantity <= 0) {
      this.remove(id);
      return;
    }
    this._items.update((items) =>
      items.map((i) => (i.coffee.id === id ? { ...i, quantity } : i)),
    );
  }

  remove(id: number): void {
    this._items.update((items) => items.filter((i) => i.coffee.id !== id));
  }

  clear(): void {
    this._items.set([]);
  }

  private load(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
