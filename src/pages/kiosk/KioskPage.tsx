import {
  CreditCard,
  Search,
  ShoppingCart,
  Sparkles,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useStore } from "../../store/useStore";
import type { Category } from "../../types";
import { formatCurrency } from "../../utils/helpers";

const categories: Category[] = ["Breakfast", "Lunch", "Dinner", "Side Dishes"];

const categoryEmojis: Record<Category, string> = {
  Breakfast: "🥞",
  Lunch: "🍔",
  Dinner: "🍽️",
  "Side Dishes": "🍟",
};

export default function KioskPage() {
  const { products, cart, addToCart, removeFromCart, clearCart, placeOrder } =
    useStore();

  const [activeCategory, setActiveCategory] = useState<Category>("Breakfast");
  const [searchQuery, setSearchQuery] = useState("");

  const mainCategories: Category[] = ["Breakfast", "Lunch", "Dinner"];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const availableProducts = useMemo(
    () => products.filter((p) => p.available),
    [products],
  );

  const filteredProducts = useMemo(
    () =>
      availableProducts.filter(
        (p) =>
          p.category === activeCategory &&
          p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [availableProducts, activeCategory, searchQuery],
  );

  const filteredSideDishes = useMemo(
    () =>
      availableProducts.filter(
        (p) =>
          p.category === "Side Dishes" &&
          p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [availableProducts, searchQuery],
  );

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const tax = cartSubtotal * 0.1;
  const total = cartSubtotal + tax;

  const handlePlaceOrder = () => {
    placeOrder();
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] min-h-screen w-full">
        <section className="flex flex-col">
          <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">Welcome! Select Your Dish</h1>
                <p className="text-xs text-slate-500">
                  Browse meals, customize your cart, and checkout fast.
                </p>
              </div>
            </div>
            <div className="hidden md:block">
               <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">
                  {getGreeting()} ☀️
               </span>
            </div>
          </div>

          <div className="bg-white border text-left border-emerald-100 shadow-sm p-4 md:p-5">
            {/* Two Column Layout */}
            <div className="flex gap-6">
              {/* Left Column: Main Menu */}
              <div className="flex-[2]">
                {/* Main Menu Title + Category Tabs */}
                <div className="flex gap-3 items-center pb-3 mb-4">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xl">🍴</span>
                    <h2 className="text-lg font-bold text-slate-900">Main Menu</h2>
                  </div>
                  {mainCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                        ${
                          activeCategory === cat
                            ? "bg-emerald-600 text-white shadow"
                            : "bg-slate-100 text-slate-700 hover:bg-emerald-50 border border-slate-200"
                        }`}
                    >
                      <span>{categoryEmojis[cat]}</span>
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Main Menu Cards - 3 per row */}
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-lg transition-all text-left group"
                    >
                      <div className="h-28 overflow-hidden relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.popular && (
                          <span className="absolute top-2 left-2 text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-[11px] text-slate-500 mb-1">
                          {product.category}
                        </p>
                        <h3 className="font-semibold text-sm text-slate-900 truncate">
                          {product.name}
                        </h3>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="text-emerald-600 font-bold text-sm">
                            {formatCurrency(product.price)}
                          </p>
                          <span className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors">
                            + Add
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-2">🔍</p>
                    <p className="text-slate-600">No menu items found.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Side Dishes */}
              <div className="flex-1 border-l border-slate-200 pl-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xl">{categoryEmojis["Side Dishes"]}</span>
                  <h2 className="text-lg font-bold text-slate-900">Side Dishes</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredSideDishes.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-lg transition-all text-left group"
                    >
                      <div className="h-28 overflow-hidden relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm text-slate-900 truncate">
                          {product.name}
                        </h3>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="text-emerald-600 font-bold text-sm">
                            {formatCurrency(product.price)}
                          </p>
                          <span className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors">
                            Add
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {filteredSideDishes.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-slate-400 text-sm">No side dishes found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <aside className="bg-white border-l border-emerald-100 shadow-sm flex flex-col overflow-hidden xl:sticky xl:top-0 xl:h-screen">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
              {cartItemsCount > 0 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="h-full min-h-52 flex flex-col items-center justify-center text-center px-6">
                <UtensilsCrossed className="w-10 h-10 text-slate-300 mb-3" />
                <p className="font-semibold text-slate-700">
                  Your cart is empty
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Tap any meal card to start your order.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={item.product.id} className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-slate-400 shrink-0 min-w-[16px] text-right">
                      {index + 1}.
                    </span>
                    <div className="bg-white flex-1 relative rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex overflow-hidden">
                      <span className="absolute top-0 right-0 text-xs font-bold text-white bg-emerald-600 px-2 py-1 rounded-bl-xl z-10">
                        x{item.quantity}
                      </span>
                      
                      <div className="w-24 relative shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3 min-w-0 flex flex-col justify-center">
                        <h4 className="font-semibold text-sm text-slate-900 mb-0.5 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-slate-500 mb-1">
                          {formatCurrency(item.product.price)} each
                        </p>
                        <p className="text-sm font-bold text-emerald-600">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-12 flex items-center justify-center bg-transparent hover:bg-red-50 text-red-600 transition-colors shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-slate-200 p-5 bg-slate-50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (10%)</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(tax)}
                </span>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-emerald-600">
                  {formatCurrency(total)}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
              >
                Print Bill
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
