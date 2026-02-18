import dbConnect from "@/lib/dbConnect";
import Application from "@/models/Application";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const data = await Application.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const data = await Application.create(body);
        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}