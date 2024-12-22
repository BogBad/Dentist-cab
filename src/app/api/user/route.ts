import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import s3, { Bucket } from '../../../lib/s3';

export async function PUT(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const id = formData.get('id') as string;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const response = await s3.send(
      new PutObjectCommand({
        Bucket,
        Key: `avatars/${id}/${file.name}`,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
}
