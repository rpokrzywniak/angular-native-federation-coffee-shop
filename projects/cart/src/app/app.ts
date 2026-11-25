import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CartStore } from 'shared-cart';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe],
  template: `
    <section>
      <h2>Koszyk</h2>
      @if (cart.items().length === 0) {
        <p>Koszyk jest pusty. Wybierz coś z menu ☕</p>
      } @else {
        <table>
          @for (item of cart.items(); track item.coffee.id) {
            <tr>
              <td>{{ item.coffee.emoji }} {{ item.coffee.name }}</td>
              <td>
                <button (click)="cart.setQuantity(item.coffee.id, item.quantity - 1)">−</button>
                {{ item.quantity }}
                <button (click)="cart.setQuantity(item.coffee.id, item.quantity + 1)">+</button>
              </td>
              <td>{{ item.coffee.price * item.quantity | currency: 'PLN' : 'symbol' : '1.0-0' }}</td>
              <td><button (click)="cart.remove(item.coffee.id)">🗑️</button></td>
            </tr>
          }
        </table>
        <h3>Razem: {{ cart.total() | currency: 'PLN' : 'symbol' : '1.0-0' }}</h3>
        <button class="clear" (click)="cart.clear()">Wyczyść koszyk</button>
      }
    </section>
  `,
  styles: `
    table { border-collapse: collapse; min-width: 420px; }
    td { padding: 0.5rem 1rem; border-bottom: 1px solid #eee; }
    button { cursor: pointer; border: 1px solid #ccc; border-radius: 6px; background: #fff; padding: 0.2rem 0.6rem; }
    .clear { margin-top: 0.5rem; }
  `,
})
export class App {
  protected readonly cart = inject(CartStore);
}
