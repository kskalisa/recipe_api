import { useState, useEffect } from 'react';
import { Clock, Flame, Star, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/landing/Hero';
import RecipeGrid from '../components/landing/RecipeGrid';
import Button from '../components/common/Button';
import Footer from '../components/landing/Footer';
import { useGetRecipesQuery } from '../features/recipes/recipeApi';

const LandingPage = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const limit = 12;

  // Update search when URL params change
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
      setPage(1);
    }
  }, [searchParams]);

  const { data, isLoading, isError } = useGetRecipesQuery({
    page,
    limit,
    search,
    sortBy: 'name',
    order: 'asc',
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-white to-pink-50">
      <Hero />
      
      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-semibold mb-2 uppercase text-sm tracking-wider">TOP RECIPES</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Explore Our Categories</h2>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">Discover delicious recipes from around the world</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Breakfast', icon: '🍳', color: 'from-orange-100 to-orange-50' },
              { name: 'Lunch', icon: '🍲', color: 'from-pink-100 to-pink-50' },
              { name: 'Dinner', icon: '🍽️', color: 'from-amber-100 to-amber-50' },
              { name: 'Dessert', icon: '🍰', color: 'from-rose-100 to-rose-50' },
            ].map((category) => (
              <div
                key={category.name}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all cursor-pointer group border border-orange-100"
              >
                <div className={`w-24 h-24 bg-linear-to-br ${category.color} rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className="text-5xl">{category.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">Delicious options</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipes Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-semibold mb-2 uppercase text-sm tracking-wider">EXPLORE</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Popular Recipes</h2>
          </div>



          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-linear-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
              <div className="flex items-center">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Recipes</p>
                  <p className="text-3xl font-bold text-gray-900">{data?.total || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-linear-to-br from-pink-50 to-pink-100 p-6 rounded-2xl border border-pink-200">
              <div className="flex items-center">
                <div className="p-3 bg-pink-500 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Avg Prep Time</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {data?.recipes && data.recipes.length ? Math.round(data.recipes.reduce((acc, r) => acc + r.prepTimeMinutes, 0) / data.recipes.length) : 0} min
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-linear-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
              <div className="flex items-center">
                <div className="p-3 bg-amber-500 rounded-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {data?.recipes && data.recipes.length ? (data.recipes.reduce((acc, r) => acc + r.rating, 0) / data.recipes.length).toFixed(1) : '0.0'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recipes Grid */}
          <RecipeGrid recipes={data?.recipes || []} isLoading={isLoading} isError={isError} />

          {/* Pagination */}
          {data && !isLoading && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                Previous
              </Button>
              <span className="text-gray-700 font-medium px-6 py-2 bg-orange-100 rounded-lg border border-orange-200">
                Page {page} of {Math.ceil((data.total || 0) / limit)}
              </span>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={(page * limit) >= (data.total || 0)}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-orange-500 to-pink-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Order Delicious Food?</h2>
          <p className="text-xl text-white/90 mb-8">Join thousands of happy customers enjoying fresh, healthy meals</p>
          <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 font-bold text-lg inline-flex items-center gap-2">
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
