/**
 * Database Seeding Script
 * 
 * This script seeds the Supabase database with sample product data and optionally creates an admin user.
 * 
 * Usage:
 *   npx tsx app/scripts/seed-database.ts                  # Seed products only
 *   npx tsx app/scripts/seed-database.ts --with-admin     # Seed products + create admin user
 *   npx tsx app/scripts/seed-database.ts --force          # Force reseed (deletes existing data)
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin user configurations
const ADMIN_USERS = [
  { email: "superadmin@luxecraft.com", password: "super123", role: "super_admin" },
  { email: "manager@luxecraft.com", password: "manager123", role: "manager" },
  { email: "staff@luxecraft.com", password: "staff123", role: "staff" },
];

const sampleProducts = [
  {
    name: "Crystal Drop Earrings",
    description: "Elegant crystal drop earrings with silver-tone finish. Perfect for weddings and special occasions. Features high-quality cubic zirconia stones that sparkle beautifully.",
    price: 2499,
    discount_price: 1999,
    category: "earrings",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1596944924591-4282f1ffb1f5?w=800&q=80",
      "https://images.unsplash.com/photo-1535556116002-6281ff3e9f99?w=800&q=80"
    ],
    stock: 50,
    is_active: true,
  },
  {
    name: "Pearl Necklace Set",
    description: "Classic pearl necklace with matching earrings. Timeless elegance for any formal event. Made with premium faux pearls and durable gold-tone chain.",
    price: 4999,
    discount_price: 3999,
    category: "necklaces",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80"
    ],
    stock: 30,
    is_active: true,
  },
  {
    name: "Gold-Tone Ring",
    description: "Delicate gold-tone ring with intricate floral design. Adjustable size fits most fingers. Hypoallergenic and nickel-free.",
    price: 1499,
    discount_price: null,
    category: "rings",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80"
    ],
    stock: 100,
    is_active: true,
  },
  {
    name: "Statement Bracelet",
    description: "Bold statement bracelet with geometric design. Rose gold finish adds a modern touch to any outfit. Adjustable clasp for perfect fit.",
    price: 2999,
    discount_price: 2499,
    category: "bracelets",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
      "https://images.unsplash.com/photo-1588444650147-1d7e5ddba618?w=800&q=80"
    ],
    stock: 40,
    is_active: true,
  },
  {
    name: "Vintage Earrings",
    description: "Vintage-inspired dangle earrings with antique gold finish. Features intricate detailing and comfortable clip-on or pierced options.",
    price: 1999,
    discount_price: 1599,
    category: "earrings",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"
    ],
    stock: 60,
    is_active: true,
  },
  {
    name: "Layered Chain Necklace",
    description: "Trendy layered chain necklace with mixed metal finish. Three delicate chains create a sophisticated layered look. Perfect for everyday wear.",
    price: 3499,
    discount_price: null,
    category: "necklaces",
    images: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"
    ],
    stock: 45,
    is_active: true,
  },
  {
    name: "Sapphire Ring Set",
    description: "Stunning sapphire blue crystal ring set. Includes statement ring and complementary band. Sterling silver plated.",
    price: 3999,
    discount_price: 2999,
    category: "rings",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80"
    ],
    stock: 25,
    is_active: true,
  },
  {
    name: "Charm Bracelet",
    description: "Delicate charm bracelet with heart and star charms. Silver-tone chain with secure lobster clasp. Add more charms to personalize!",
    price: 2499,
    discount_price: null,
    category: "bracelets",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80"
    ],
    stock: 55,
    is_active: true,
  },
  {
    name: "Diamond Stud Earrings",
    description: "Classic diamond stud earrings with brilliant cut cubic zirconia. Timeless design suitable for daily wear or special occasions. Secure push-back closures.",
    price: 3499,
    discount_price: 2999,
    category: "earrings",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1596944924591-4282f1ffb1f5?w=800&q=80",
      "https://images.unsplash.com/photo-1535556116002-6281ff3e9f99?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
    ],
    stock: 75,
    is_active: true,
  },
  {
    name: "Infinity Pendant Necklace",
    description: "Elegant infinity symbol pendant necklace in rose gold. Represents eternal love and friendship. Chain length: 18 inches with 2-inch extender.",
    price: 2799,
    discount_price: null,
    category: "necklaces",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
    ],
    stock: 65,
    is_active: true,
  },
];

async function createAdminUsers() {
  console.log("👤 Creating admin users...\n");

  let createdCount = 0;
  let existingCount = 0;

  for (const admin of ADMIN_USERS) {
    try {
      // Check if admin user already exists
      const { data: existingAdmin } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", admin.email)
        .single();

      if (existingAdmin) {
        console.log(`⚠️  ${admin.role}: ${admin.email} already exists`);
        existingCount++;
        continue;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(admin.password, 10);

      // Insert admin user
      const { error: insertError } = await supabase
        .from("admin_users")
        .insert({
          email: admin.email,
          password_hash: hashedPassword,
          role: admin.role,
          is_active: true,
        });

      if (insertError) {
        throw insertError;
      }

      console.log(`✅ ${admin.role}: ${admin.email} created`);
      createdCount++;
    } catch (error) {
      console.error(`❌ Error creating ${admin.email}:`, error);
    }
  }

  console.log(`\n📊 Summary: ${createdCount} created, ${existingCount} already existed`);
  console.log(`\n📋 Admin Credentials:`);
  console.log(`   Super Admin - superadmin@luxecraft.com / super123`);
  console.log(`   Manager - manager@luxecraft.com / manager123`);
  console.log(`   Staff - staff@luxecraft.com / staff123`);
  console.log(`   ⚠️  IMPORTANT: Change these passwords in production!\n`);
}

async function seedDatabase() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from("products")
      .select("id")
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log("⚠️  Products already exist in the database.");
      console.log("Do you want to delete existing products and reseed? (This cannot be undone)");
      console.log("To proceed, run: npx tsx app/scripts/seed-database.ts --force\n");
      
      if (!process.argv.includes("--force")) {
        console.log("Seeding cancelled. Use --force flag to override.");
        process.exit(0);
      }

      console.log("🗑️  Deleting existing products...");
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

      if (deleteError) {
        throw deleteError;
      }
      console.log("✅ Existing products deleted\n");
    }

    // Insert sample products
    console.log(`📦 Inserting ${sampleProducts.length} sample products...`);
    const { data, error } = await supabase
      .from("products")
      .insert(sampleProducts)
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully inserted ${data?.length} products!\n`);
    
    console.log("Sample products:");
    data?.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} - ₹${product.price} (${product.images.length} images)`);
    });

    console.log("\n✨ Database seeding completed successfully!");

    // Create admin users if --with-admin flag is present
    if (process.argv.includes("--with-admin")) {
      console.log("");
      await createAdminUsers();
    }

    console.log("\n📝 Next steps:");
    if (!process.argv.includes("--with-admin")) {
      console.log("  1. Create an admin user:");
      console.log("     - Run: npx tsx app/scripts/seed-database.ts --with-admin");
      console.log("     - Or see: ADMIN_ACCESS_GUIDE.md for manual creation");
    }
    console.log("  2. Start your dev server: npm run dev");
    console.log("  3. Login to admin panel: http://localhost:5173/admin-login");
    console.log("  4. Visit your app to see the products\n");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
