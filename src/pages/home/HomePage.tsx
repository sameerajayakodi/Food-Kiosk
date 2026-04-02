import { Link } from 'react-router-dom';
import { ShoppingCart, BarChart3, Users, Camera, Clock, Zap, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🍽️</div>
          <div className="absolute bottom-10 right-10 text-9xl">🍕</div>
          <div className="absolute top-1/3 right-1/4 text-8xl">✨</div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                <Zap className="w-4 h-4" />
                Modern Food Kiosk System
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Welcome to<br />
                <span className="text-emerald-100">FoodKiosk</span>
              </h1>
              <p className="text-emerald-50/80 text-lg mt-4 max-w-md">
                A complete restaurant management system. Fast ordering, easy administration, and real-time insights.
              </p>
              <div className="flex gap-4 mt-8 flex-wrap">
                <Link
                  to="/pos"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Start Ordering
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white border border-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  <BarChart3 className="w-5 h-5" />
                  Go to Admin
                </Link>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                <p className="text-white font-medium mb-4">Scan to start ordering</p>
                <div className="bg-white p-5 rounded-lg inline-block shadow-2xl">
                  <QRCodeSVG
                    value={`${window.location.origin}/pos`}
                    size={160}
                    fgColor="#059669"
                    bgColor="#FFFFFF"
                  />
                </div>
                <p className="text-emerald-100/60 text-xs mt-4">or use the order button above</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900">Powerful Features</h2>
          <p className="text-slate-600 text-lg mt-2">Everything you need to run your restaurant efficiently</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow"
              >
                <div className={`w-14 h-14 rounded-lg mb-4 flex items-center justify-center ${feature.bgColor}`}>
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meals Section */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">Our Menu Categories</h2>
            <p className="text-slate-600 text-lg mt-2">Fresh meals served all day</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {mealCategories.map((meal) => (
              <div key={meal.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-32 ${meal.bgColor} flex items-center justify-center`}>
                  <span className="text-6xl">{meal.emoji}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900">{meal.name}</h3>
                  <p className="text-slate-600 text-sm mt-2">{meal.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {meal.items.map((item) => (
                      <span
                        key={item}
                        className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-emerald-50 text-lg mb-8">Start making orders with our fast and easy POS system</p>
          <Link
            to="/pos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <ShoppingCart className="w-5 h-5" />
            Go to POS Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    id: 1,
    icon: ShoppingCart,
    title: 'Fast POS System',
    description: 'Quick-add items, fast checkout, and multiple payment options.',
    bgColor: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: 2,
    icon: BarChart3,
    title: 'Dashboard',
    description: 'Real-time sales metrics, popular items, and performance insights.',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 3,
    icon: Users,
    title: 'Staff Management',
    description: 'Employee profiles, positions, and payroll tracking.',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 4,
    icon: Clock,
    title: 'Order Tracking',
    description: 'Real-time order status updates and kitchen display system.',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    id: 5,
    icon: Camera,
    title: 'Product Images',
    description: 'Beautiful product photos that make ordering irresistible.',
    bgColor: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
  {
    id: 6,
    icon: Zap,
    title: 'Fast & Reliable',
    description: 'Lightning-fast performance built for busy restaurants.',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
];

const mealCategories = [
  {
    id: 1,
    name: 'Breakfast',
    emoji: '🥞',
    bgColor: 'bg-amber-100',
    description: 'Start your day right',
    items: ['Pancakes', 'Eggs', 'Toast'],
  },
  {
    id: 2,
    name: 'Lunch',
    emoji: '🍔',
    bgColor: 'bg-orange-100',
    description: 'Midday favorites',
    items: ['Burgers', 'Salads', 'Tacos'],
  },
  {
    id: 3,
    name: 'Dinner',
    emoji: '🍽️',
    bgColor: 'bg-red-100',
    description: 'Evening delights',
    items: ['Salmon', 'Steak', 'Pasta'],
  },
  {
    id: 4,
    name: 'Sides',
    emoji: '🍟',
    bgColor: 'bg-yellow-100',
    description: 'Perfect accompaniments',
    items: ['Fries', 'Salad', 'Veggies'],
  },
];

