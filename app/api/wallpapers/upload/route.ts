import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('User email:', session.user.email);

  const data = await req.formData();
  const file = data.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const base64 = buffer.toString('base64');
  const uploadStr = `data:${file.type};base64,${base64}`;

  const existingUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { wallpapers: true },
  });

  if (!existingUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (existingUser?.wallpapers.length >= 5) {
    return NextResponse.json(
      { error: 'Max 5 wallpapers allowed' },
      { status: 403 },
    );
  }

  const upload = await cloudinary.uploader.upload(uploadStr, {
    folder: 'startpage/wallpapers',
  });

  const saved = await prisma.wallpaper.create({
    data: {
      url: upload.secure_url,
      publicId: upload.public_id,
      user: { connect: { id: existingUser!.id } },
    },
  });

  return NextResponse.json(saved);
}
