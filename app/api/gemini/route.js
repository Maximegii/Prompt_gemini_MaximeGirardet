import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { message } = await request.json();
    console.log("Message de l'utilisateur :", message);

    const messageControl = "Attention, répond uniquement aux question concernant les voitures (marque, prix, caractéristique etc...), sinon répondre je suis conçu pour répondre à vos questions automobile (Bien entendu si l'utilisateur te dit bonjour, répond lui poliment). Voici le message de l'utilisateur :"+message

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

    const result = await model.generateContent(messageControl);

    //console.log("Réponse de l'API :", JSON.stringify(result, null, 2));
    const reponse = JSON.stringify(result, null,2);
    // console.log("response", reponse)

    const candidates = result?.response?.candidates;

    if (!candidates || candidates.length === 0) {
      throw new Error("Aucun candidat trouvé dans la réponse de l'IA");
    }
    // console.log("candidates", candidates)

    // Extraire la réponse du premier candidat
    const aiResponse = candidates[0].content.parts;
    // console.log("reponseapi : ",aiResponse)
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Erreur lors de la génération de contenu :", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de contenu" },
      { status: 500 }
    );
  }
}
