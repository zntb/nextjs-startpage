import cloudinary from '@/lib/cloudinary';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email)
    return new Response('Unauthorized', { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { wallpapers: true },
  });

  return Response.json(user?.wallpapers || []);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return new Response('Unauthorized', { status: 401 });

  const data = await req.formData();
  const file = data.get('file') as File;

  if (!file) return new Response('No file uploaded', { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

  const uploadRes = await cloudinary.uploader.upload(base64, {
    folder: 'user_wallpapers',
  });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { wallpapers: true },
  });

  if (user && user.wallpapers.length >= 5) {
    return new Response('Limit reached', { status: 400 });
  }

  const wallpaper = await prisma.wallpaper.create({
    data: {
      url: uploadRes.secure_url,
      publicId: uploadRes.public_id,
      user: { connect: { email: session.user.email } },
    },
  });

  return Response.json(wallpaper);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return new Response('Unauthorized', { status: 401 });

  const { id } = await req.json();

  const wallpaper = await prisma.wallpaper.findUnique({ where: { id } });

  if (!wallpaper) return new Response('Not found', { status: 404 });

  await cloudinary.uploader.destroy(wallpaper.publicId);
  await prisma.wallpaper.delete({ where: { id } });

  return new Response(null, { status: 204 });
}
