import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/layout/Marquee";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { Editorial } from "@/components/home/Editorial";
import { NewArrivals } from "@/components/home/NewArrivals";
import { TrustStrip } from "@/components/home/TrustStrip";
import { getFeaturedProducts, getProductsByTag } from "@/lib/medusa/products";
import { listCategories } from "@/lib/medusa/categories";

export default async function HomePage() {
  const [featured, categories, newArrivals] = await Promise.all([
    getFeaturedProducts(6),
    listCategories(),
    getProductsByTag("new", 4),
  ]);

  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedProducts products={featured} />
      <CategoryTiles categories={categories} />
      <Editorial />
      <NewArrivals products={newArrivals} />
      <TrustStrip />
    </>
  );
}
