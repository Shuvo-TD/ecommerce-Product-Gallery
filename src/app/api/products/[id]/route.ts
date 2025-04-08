import { NextRequest, NextResponse } from 'next/server';
import productsData from '@/data/products.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await Promise.resolve(params);

  const product = productsData.find((product) => product.id === id);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
