import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 TEST BASIC - Rota acessada");
    
    // Tentar ler o corpo da requisição
    const body = await request.text();
    console.log("🔐 TEST BASIC - Body recebido:", body);
    
    return NextResponse.json({
      success: true,
      message: "Rota de teste funcionando",
      body: body
    });

  } catch (error) {
    console.error("🔐 TEST BASIC - Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "GET funcionando"
  });
}
