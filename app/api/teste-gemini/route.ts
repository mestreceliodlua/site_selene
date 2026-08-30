import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        sucesso: false,
        erro: 'GEMINI_API_KEY não está configurada no servidor',
        instrucao: 'Adicione a variável de ambiente no dashboard do Render'
      }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Diga apenas: OK');
    const response = await result.response;
    const texto = response.text();

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Conexão com Gemini OK',
      resposta: texto,
      modelo: 'gemini-1.5-flash'
    });

  } catch (error: any) {
    console.error('[TESTE GEMINI] Erro:', error);
    
    return NextResponse.json({
      sucesso: false,
      erro: error?.message || 'Erro desconhecido',
      status: error?.status,
      instrucao: error?.message?.includes('API_KEY')
        ? 'A chave da API é inválida. Verifique no Google AI Studio.'
        : error?.message?.includes('model')
        ? 'O modelo não existe. Use gemini-1.5-flash ou gemini-pro.'
        : 'Verifique os logs do servidor para mais detalhes.'
    }, { status: 500 });
  }
}
