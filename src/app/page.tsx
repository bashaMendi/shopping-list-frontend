import ShoppingListsView from "../features/shoppingLists/ShoppingListsView";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>טוען...</div>}>
        <ShoppingListsView />
      </Suspense>
    </main>
  );
}
