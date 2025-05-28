import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractSection(text, sectionTitle) {
  const pattern = new RegExp(`(?<=^|\\n)#+\\s*${sectionTitle}:?\\s*([\\s\\S]*?)(?=\\n#+\\s|$)`, 'i');
  const match = text.match(pattern);
  return match ? match[1].trim() : "";
}

function cleanText(text) {
  return text
  .replace(/#+\s*/g, '')
  .replace(/\*\*/g, '')
  .replace(/\*/g, '')
  .trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const {
    age,
    gender,
    chiefComplaint,
    symptoms,
    medicalHistory,
    medications,
    lifestyle,
    familyHistory,
    environment,
    otherFactors,
    bloodPressure,
    heartRate,
    respiratoryRate,
    temperature,
    oxygenSaturation,
    additionalNotes
  } = req.body;

  const prompt = `
  You are a clinical decision-support AI trained to assist physicians in making informed evaluations. Based on the following patient profile, provide a clearly structured medical report.

  ## Patient Intake
  - Age: ${age}
  - Gender: ${gender}
  - Chief Complaint: ${chiefComplaint}
  - Symptoms: ${symptoms}
  - Medical History: ${medicalHistory}
  - Medications: ${medications}
  - Lifestyle: ${lifestyle}
  - Family History: ${familyHistory}
  - Environment: ${environment}
  - Other Factors: ${otherFactors}

  ## Physical Exam
  - Blood Pressure: ${bloodPressure}
  - Heart Rate: ${heartRate}
  - Respiratory Rate: ${respiratoryRate}
  - Temperature: ${temperature}
  - O₂ Saturation: ${oxygenSaturation}
  - Additional Notes: ${additionalNotes}

  ## Instructions:
  Weight your analysis most heavily on:
  - Chief Complaint
  - Symptoms
  - Medical History

  Use vital signs only as supportive context.

  ## Respond in the following structure:

  ### Diagnosis Section:
  1. Further diagnostic tools and assessments necessary  
  2. Body systems impacted  
  3. Most likely diagnosis(es)

  ### Treatments and Interventions:
  1. Medications, prescriptions, and/or procedures based on the diagnosis  
  2. Type(s) of healthcare professionals or specialists likely needed

  ### General Advice:
  Give advice related to ongoing health, recovery, or risk reduction

  ### Additional Considerations:
  Flag anything important not already addressed, such as comorbidity risks, need for close monitoring, or family predispositions


  Only return content using the section titles and order above. No markdown formatting like hashtags or bold styling.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", //"gpt-3.5-turbo", 
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    
    const result = completion.choices[0].message.content;

    const sections = {
      diagnosis: cleanText(extractSection(result, "Diagnosis Section")),
      treatments: cleanText(extractSection(result, "Treatments and Interventions")),
      advice: extractSection(result, "General Advice"),
      other: extractSection(result, "Additional Considerations"),
    };
    
    res.status(200).json(sections);
    




  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
}


