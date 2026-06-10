import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { leadCreateSchema } from "@/lib/validators/lead";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = leadCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          issues: result.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const lead = await prisma.bootcampLead.create({
      data: result.data,
      select: {
        id: true,
        fullName: true,
        phone: true,
        ageRange: true,
        skillLevel: true,
        status: true,
        createdAt: true
      }
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "DUPLICATE_PHONE" }, { status: 409 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
