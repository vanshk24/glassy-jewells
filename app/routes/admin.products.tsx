import { useLoaderData, useNavigate, Form, type LoaderFunctionArgs, type ActionFunctionArgs } from 'react-router';
import { Button } from '~/components/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card/card';
import { getAllProducts, deleteProduct } from '~/services/products.service';
import { requireAdminUser } from '~/utils/session.server';
import { PackagePlus, Edit, Trash2 } from 'lucide-react';
import { hasPermission } from '~/types/admin';
import { PriceDisplay } from '~/components/price-display';
import styles from './admin.products.module.css';

export async function loader({ request }: LoaderFunctionArgs) {
  const adminSession = await requireAdminUser(request);
  const products = await getAllProducts();
  return { products, adminSession };
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdminUser(request);

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'deleteProduct') {
    const productId = formData.get('productId') as string;
    await deleteProduct(productId);
    return { success: true };
  }

  return null;
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const { products, adminSession } = useLoaderData<typeof loader>();

  const handleAddProduct = () => {
    navigate('/admin/product/new');
  };

  const handleEditProduct = (id: string) => {
    navigate(`/admin/product/${id}`);
  };

  return (
    <div className={styles.container}>
      <Card>
        <CardHeader>
          <div className={styles.cardHeaderContent}>
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </div>
            {hasPermission(adminSession.role, 'can_manage_products') && (
              <Button onClick={handleAddProduct}>
                <PackagePlus />
                Add Product
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <img src={product.images[0]} alt={product.name} className={styles.productImage} />
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <PriceDisplay price={product.price} discountPrice={product.discount_price} />
                  <p className={styles.productCategory}>{product.category}</p>
                  <p className={styles.productStock}>Stock: {product.stock}</p>
                </div>
                {hasPermission(adminSession.role, 'can_manage_products') && (
                  <div className={styles.productActions}>
                    <Button size="sm" variant="outline" onClick={() => handleEditProduct(product.id)}>
                      <Edit />
                      Edit
                    </Button>
                    <Form method="post" style={{ display: 'inline' }}>
                      <input type="hidden" name="intent" value="deleteProduct" />
                      <input type="hidden" name="productId" value={product.id} />
                      <Button
                        size="sm"
                        variant="outline"
                        type="submit"
                        className={styles.deleteBtn}
                        onClick={(e) => {
                          if (!confirm('Are you sure you want to delete this product?')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <Trash2 />
                        Delete
                      </Button>
                    </Form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
