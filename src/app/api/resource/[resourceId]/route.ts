import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
): Promise<NextResponse> {
  const resourceId = (await params).resourceId;
  
  // Generate ETag - in a real app this might depend on the resource data
  const etag = `"${crypto.createHash('md5').update(`${resourceId}-${Date.now()}`).digest('hex')}"`;
  
  return NextResponse.json(
    {
      id: resourceId,
      foo: "bar"
    },
    {
      headers: {
        'ETag': etag
      }
    }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
): Promise<NextResponse> {
  const resourceId = (await params).resourceId;
  
  // Extract the If-Match header
  const ifMatch = request.headers.get('if-match');
  
  // Check if If-Match header is present
  if (!ifMatch) {
    return NextResponse.json(
      { error: "Precondition Failed - If-Match header is required" },
      { status: 428 }
    );
  }
  
  // Generate a new ETag value that is guaranteed to be different from the If-Match value
  const newTimestamp = Date.now();
  const newEtag = `"${crypto.createHash('md5').update(`${resourceId}-${newTimestamp}`).digest('hex')}"`;
  
  return NextResponse.json(
    {
      id: resourceId,
      foo: "bar"
    },
    {
      headers: {
        'ETag': newEtag
      }
    }
  );
} 