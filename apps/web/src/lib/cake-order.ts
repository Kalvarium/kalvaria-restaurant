/**
 * Bridge between a cake card's "Order" button and the cake-order Form dialog.
 * The button dispatches this event with the chosen cake; the dialog listens,
 * opens, and pre-selects that cake in its `cakes` dropdown. Client-side only.
 */
export const CAKE_ORDER_EVENT = "kalvaria:order-cake";

export interface CakeOrderDetail {
  /** Cake name to pre-select (matches a Cake option's value). */
  cake?: string;
}

/** Open the cake-order dialog, optionally pre-selecting a cake by name. */
export function openCakeOrder(cake?: string) {
  window.dispatchEvent(new CustomEvent<CakeOrderDetail>(CAKE_ORDER_EVENT, { detail: { cake } }));
}
