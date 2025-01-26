import { defineEventHandler } from "h3";
import { useLogger } from "~/composables/useLogger";
import { usePg } from "~/composables/pg";

export default defineEventHandler(async (event) => {
  const { logError } = useLogger();
  try {
    // Import and configure PostgreSQL client
    let { query } = usePg();

    // Execute the query to fetch all products
    const sql = `
            SELECT 
                id,
                creation_time,
                name,
                category,
                description,
                sku,
                stock,
                price,
                main_img_path,
                second_img_path,
                third_img_path,
                content0,
                content1,
                content2,
                content3,
                content4,
                content5,
                content6,
                content7,
                content8,
                content9
            FROM products 
            WHERE is_active=true`;

    const result = await query<ProductItem & { stock: number }>({
      sqlQuery: sql,
      meta: { operation: "fetch", entity: "products" },
    });

    // Transform result rows to match the ProductItem interface
    const products: ProductItem[] = result.rows.map((row) => ({
      id: row.id,
      creation_time: row.creation_time,
      name: row.name,
      category: row.category,
      description: row.description,
      sku: row.sku,
      in_stock: row.stock > 0,
      price: row.price,
      main_img_path: row.main_img_path,
      second_img_path: row.second_img_path || undefined,
      third_img_path: row.third_img_path || undefined,
      content0: row.content0 || undefined,
      content1: row.content1 || undefined,
      content2: row.content2 || undefined,
      content3: row.content3 || undefined,
      content4: row.content4 || undefined,
      content5: row.content5 || undefined,
      content6: row.content6 || undefined,
      content7: row.content7 || undefined,
      content8: row.content8 || undefined,
      content9: row.content9 || undefined,
    }));

    return products;
  } catch (error) {
    logError("Failed to fetch all products", error);

    // Log and handle any database errors
    return { statusCode: 200, error, message: "Internal Server Error" };
    // return { statusCode: 500, message: "Internal Server Error" };
  }
});