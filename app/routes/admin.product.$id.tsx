import { useState } from 'react';
import { useLoaderData, useNavigate, Form, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from 'react-router';
import { Button } from '~/components/ui/button/button';
import { Input } from '~/components/ui/input/input';
import { Label } from '~/components/ui/label/label';
import { Textarea } from '~/components/ui/textarea/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card/card';
import { getProductById, createProduct, updateProduct } from '~/services/products.service';
import { requireAdminUser } from '~/utils/session.server';
import { hasPermission } from '~/types/admin';
import { ArrowLeft, Plus, X } from 'lucide-react';
import styles from './admin.product.$id.module.css';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const adminSession = await requireAdminUser(request);
  
  // Only super_admin and manager can access product management
  if (!hasPermission(adminSession.role, 'can_manage_products')) {
    throw redirect('/admin');
  }
  
  const { id } = params;
  
  if (id === 'new') {
    return { product: null, isNew: true };
  }
  
  const product = await getProductById(id!);
  return { product, isNew: false };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const adminSession = await requireAdminUser(request);
  
  // Only super_admin and manager can modify products
  if (!hasPermission(adminSession.role, 'can_manage_products')) {
    throw redirect('/admin');
  }
  
  const formData = await request.formData();
  const { id } = params;
  
  // Get all image URLs from the form
  const imageUrls: string[] = [];
  let imageIndex = 0;
  while (formData.has(`image-${imageIndex}`)) {
    const url = formData.get(`image-${imageIndex}`) as string;
    if (url.trim()) {
      imageUrls.push(url.trim());
    }
    imageIndex++;
  }
  
  // Ensure at least one image
  if (imageUrls.length === 0) {
    throw new Error('At least one image is required');
  }
  
  const productData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    discount_price: formData.get('discountPrice') ? parseFloat(formData.get('discountPrice') as string) : null,
    category: formData.get('category') as string,
    images: imageUrls,
    stock: parseInt(formData.get('stock') as string) || 0,
    is_active: true,
  };
  
  if (id === 'new') {
    await createProduct(productData);
  } else {
    await updateProduct(id!, productData);
  }
  
  return redirect('/admin');
}

export default function AdminProductEdit() {
  const navigate = useNavigate();
  const { product, isNew } = useLoaderData<typeof loader>();
  
  // Initialize with existing images or one empty field
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images && product.images.length > 0 ? product.images : ['']
  );

  const handleAddImage = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImage = (index: number) => {
    if (imageUrls.length > 1) {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  return (
    <div className={styles.container}>
      <Button variant="outline" onClick={() => navigate('/admin')} className={styles.backBtn}>
        <ArrowLeft />
        Back to Admin
      </Button>

      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>{isNew ? 'Add New Product' : 'Edit Product'}</CardTitle>
          <CardDescription>
            {isNew ? 'Create a new product listing' : 'Update product information'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={product?.name || ''}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={product?.category || ''}
                  placeholder="e.g., Accessories, Bags, Watches"
                  required
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={product?.price || ''}
                  placeholder="Enter price"
                  required
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                <Input
                  id="discountPrice"
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  defaultValue={product?.discount_price || ''}
                  placeholder="Enter discount price (optional)"
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  defaultValue={product?.stock || ''}
                  placeholder="Enter stock quantity"
                />
              </div>
            </div>

            <div className={styles.field}>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={product?.description || ''}
                placeholder="Enter product description"
                rows={4}
                required
              />
            </div>

            <div className={styles.imagesSection}>
              <div className={styles.imagesSectionHeader}>
                <Label>Product Images</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddImage}
                  className={styles.addImageBtn}
                >
                  <Plus size={16} />
                  Add Image
                </Button>
              </div>
              <p className={styles.imagesHint}>
                Add multiple images. Supports JPG, PNG, GIF, and WebP formats.
              </p>
              
              <div className={styles.imageInputs}>
                {imageUrls.map((url, index) => (
                  <div key={index} className={styles.imageInputRow}>
                    <Input
                      name={`image-${index}`}
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Enter image URL"
                      required
                    />
                    {imageUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        className={styles.removeImageBtn}
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {imageUrls.some(url => url.trim()) && (
              <div className={styles.imagePreviewSection}>
                <Label>Image Previews</Label>
                <div className={styles.imagePreviews}>
                  {imageUrls.filter(url => url.trim()).map((url, index) => (
                    <div key={index} className={styles.imagePreviewItem}>
                      <img 
                        src={url} 
                        alt={`Preview ${index + 1}`} 
                        className={styles.previewImage}
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/400x400/e5e5e5/999999?text=Invalid+URL';
                        }}
                      />
                      <span className={styles.previewLabel}>Image {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
                Cancel
              </Button>
              <Button type="submit">{isNew ? 'Create Product' : 'Update Product'}</Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
