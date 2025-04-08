import { NextRequest, NextResponse } from 'next/server';
import productsData from '@/data/products.json';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  const id = segments[segments.length - 1];

  const product = productsData.find((product) => product.id === id);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
