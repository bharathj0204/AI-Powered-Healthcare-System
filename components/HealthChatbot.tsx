import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Clock, 
  ThumbsUp, 
  ThumbsDown,
  Stethoscope,
  Heart,
  Brain,
  Activity,
  AlertCircle,
  Phone,
  Video,
  Calendar
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'emergency' | 'appointment';
  confidence?: number;
}

const healthcareKnowledgeBase = {
  symptoms: {
    headache: {
      response: "Headaches can have various causes including stress, dehydration, tension, or underlying conditions. **Treatment suggestions:**\n\n• **Mild headaches:** Paracetamol (500-1000mg) or Ibuprofen (400mg) every 6-8 hours\n• Rest in a quiet, dark room\n• Apply cold/warm compress\n• Stay hydrated (drink water)\n• **Tension headaches:** Try relaxation techniques\n\n⚠️ **See a doctor if:** Severe headache, fever, vision changes, neck stiffness, or headaches becoming more frequent.",
      confidence: 85,
      followUp: ["Have you tried any pain relievers?", "How long have you had this headache?", "Are you experiencing any other symptoms?"],
      medications: ["Paracetamol 500mg", "Ibuprofen 400mg", "Aspirin 325mg (if no allergies)"]
    },
    fever: {
      response: "Fever (>100.4°F/38°C) is your body's response to infection. **Treatment:**\n\n• **Medications:** Paracetamol (500-1000mg every 6 hours) or Ibuprofen (400mg every 8 hours)\n• Stay hydrated - drink plenty of water, ORS, coconut water\n• Rest and avoid strenuous activity\n• Light, comfortable clothing\n• Cool sponging if very high fever\n\n⚠️ **Emergency:** Fever >103°F (39.4°C), difficulty breathing, severe headache, or persistent fever >3 days",
      confidence: 90,
      followUp: ["What's your current temperature?", "Are you experiencing chills or sweating?", "Do you have any other symptoms?"],
      medications: ["Paracetamol 500mg", "Ibuprofen 400mg", "Oral Rehydration Salts (ORS)"]
    },
    chest_pain: {
      response: "⚠️ **IMPORTANT:** Chest pain can be serious. **Immediate action needed if:**\n• Severe pain, pressure, or tightness\n• Pain radiating to arm, jaw, or back\n• Shortness of breath\n• Nausea or sweating\n\n**For mild chest discomfort:**\n• Antacids for heartburn-related pain\n• Avoid trigger foods\n• Rest and avoid stress\n\n**🚨 CALL EMERGENCY SERVICES IMMEDIATELY for severe symptoms**",
      confidence: 95,
      type: 'emergency',
      followUp: ["Is the pain severe or mild?", "Does it radiate to other areas?", "Are you having trouble breathing?"],
      medications: ["Antacids (for heartburn)", "Aspirin 325mg (only if advised by doctor)"]
    },
    cough: {
      response: "Cough treatment depends on type:\n\n**Dry Cough:**\n• Dextromethorphan-based cough syrups\n• Honey (1-2 teaspoons)\n• Warm water with salt gargle\n• Stay hydrated\n\n**Productive Cough:**\n• Expectorants like Guaifenesin\n• Steam inhalation\n• Warm liquids\n\n**When to see doctor:** Cough >3 weeks, blood in sputum, fever, weight loss, or breathing difficulty",
      confidence: 82,
      followUp: ["Is your cough dry or producing mucus?", "How long have you had this cough?", "Are you experiencing fever or shortness of breath?"],
      medications: ["Dextromethorphan syrup", "Guaifenesin syrup", "Honey", "Lozenges with menthol"]
    },
    cold_flu: {
      response: "Common cold/flu symptoms include runny nose, cough, sore throat, body aches.\n\n**Treatment:**\n• **Pain & fever:** Paracetamol or Ibuprofen\n• **Nasal congestion:** Saline drops, decongestants\n• **Cough:** Cough syrups, honey\n• **Sore throat:** Antiseptic gargles, lozenges\n• Rest, fluids, and good nutrition\n\n**Recovery time:** 7-10 days typically",
      confidence: 88,
      medications: ["Paracetamol", "Phenylephrine nasal drops", "Cough syrup", "Antiseptic gargle", "Vitamin C tablets"]
    },
    stomach_pain: {
      response: "Stomach pain causes vary widely. **Common treatments:**\n\n**Acidity/Heartburn:**\n• Antacids (Eno, Gelusil)\n• Proton pump inhibitors (Omeprazole)\n• Avoid spicy/oily foods\n\n**Indigestion:**\n• Digestive enzymes\n• Light, easy-to-digest foods\n• Stay hydrated\n\n⚠️ **See doctor for:** Severe pain, blood in vomit/stool, persistent symptoms",
      confidence: 80,
      medications: ["Antacids", "Omeprazole 20mg", "Digestive enzymes", "ORS"]
    },
    diabetes: {
      response: "Diabetes management requires consistent medication and lifestyle changes.\n\n**Common medications:**\n• **Type 2:** Metformin, Glimepiride, Insulin\n• **Monitoring:** Regular blood sugar testing\n• **Diet:** Low carb, high fiber foods\n• **Exercise:** 30 minutes daily walking\n\n⚠️ **Always follow your doctor's prescription exactly**",
      confidence: 92,
      medications: ["Metformin 500mg", "Glimepiride 2mg", "Insulin (as prescribed)", "Glucose test strips"]
    },
    hypertension: {
      response: "High blood pressure management:\n\n**Common medications:**\n• ACE inhibitors (Lisinopril, Ramipril)\n• Calcium channel blockers (Amlodipine)\n• Diuretics (Hydrochlorothiazide)\n\n**Lifestyle:**\n• Low salt diet (<6g/day)\n• Regular exercise\n• Weight management\n• Stress reduction\n\n**Monitor BP regularly at home**",
      confidence: 89,
      medications: ["Amlodipine 5mg", "Ramipril 5mg", "Hydrochlorothiazide 25mg", "Low-dose Aspirin 75mg"]
    },
    // TROPICAL & INDIAN-SPECIFIC DISEASES
    dengue: {
      response: "**Dengue Fever** - Mosquito-borne viral infection common in India during monsoon.\n\n**Symptoms:** High fever, severe headache, pain behind eyes, joint/muscle pain, rash\n\n**Treatment:**\n• **No specific antiviral** - supportive care\n• Paracetamol for fever (NO Aspirin/Ibuprofen - increases bleeding risk)\n• Drink plenty of fluids - ORS, coconut water, fresh juices\n• Complete bed rest\n• Monitor platelet count daily\n\n⚠️ **Warning signs:** Severe abdominal pain, persistent vomiting, bleeding gums, blood in stool, difficulty breathing\n\n**🚨 IMMEDIATE HOSPITALIZATION if platelets <50,000 or warning signs present**",
      confidence: 92,
      followUp: ["Have you been tested for dengue?", "What's your current platelet count?", "Are you experiencing bleeding from anywhere?"],
      medications: ["Paracetamol only", "ORS", "Papaya leaf extract (traditional)", "IV fluids if needed"]
    },
    malaria: {
      response: "**Malaria** - Parasitic infection transmitted by mosquitoes, common in rural India.\n\n**Symptoms:** Cyclical fever with chills, sweating, headache, nausea, fatigue\n\n**Treatment:**\n• **Requires doctor diagnosis** (blood test mandatory)\n• Antimalarials: Chloroquine, Artemisinin-based combination therapy\n• Paracetamol for fever\n• Stay hydrated\n• Complete medication course (3-7 days)\n\n⚠️ **Complications:** Can become severe quickly - cerebral malaria is life-threatening\n\n**Prevention:** Mosquito nets, repellents, antimalarial prophylaxis in endemic areas",
      confidence: 90,
      type: 'urgent',
      followUp: ["Have you been to a malaria-endemic area?", "Did you get a blood test done?", "Are you experiencing confusion or seizures?"],
      medications: ["Chloroquine (as prescribed)", "Artemether-Lumefantrine", "Paracetamol", "Anti-nausea medication"]
    },
    typhoid: {
      response: "**Typhoid Fever** - Bacterial infection from contaminated food/water.\n\n**Symptoms:** Sustained high fever (103-104°F), weakness, stomach pain, headache, loss of appetite\n\n**Treatment:**\n• **Antibiotics mandatory:** Azithromycin, Ceftriaxone, or Ciprofloxacin (prescription only)\n• Paracetamol for fever\n• ORS and plenty of fluids\n• Light, easily digestible food\n• Complete bed rest\n• Treatment duration: 7-14 days\n\n⚠️ **Complications:** Intestinal bleeding, perforation - seek immediate help if severe abdominal pain\n\n**Prevention:** Vaccination available, safe food and water practices",
      confidence: 88,
      followUp: ["How long have you had the fever?", "Are you experiencing abdominal pain?", "Have you been tested (Widal test/blood culture)?"],
      medications: ["Azithromycin 500mg", "Ceftriaxone injection", "Paracetamol", "ORS", "Probiotics"]
    },
    jaundice: {
      response: "**Jaundice (Hepatitis)** - Yellowing of skin/eyes due to liver problems.\n\n**Causes:** Hepatitis A, B, C, E viruses, or liver disease\n\n**Symptoms:** Yellow skin/eyes, dark urine, pale stools, fatigue, loss of appetite\n\n**Treatment:**\n• **See doctor immediately** for diagnosis\n• Rest and adequate sleep\n• High-calorie, low-fat diet\n• Plenty of fluids - sugarcane juice, coconut water\n• Avoid alcohol completely\n• No self-medication\n\n**For Hepatitis A/E:** Usually self-limiting, supportive care\n**For Hepatitis B/C:** Antiviral therapy needed\n\n⚠️ **Urgent if:** Confusion, extreme drowsiness, bleeding tendency",
      confidence: 85,
      type: 'urgent',
      followUp: ["Have you been tested for hepatitis?", "Is your urine very dark?", "Any abdominal swelling?"],
      medications: ["No specific medication - supportive care", "Vitamin supplements", "Avoid all liver-toxic drugs"]
    },
    tuberculosis: {
      response: "**Tuberculosis (TB)** - Bacterial lung infection, still common in India.\n\n**Symptoms:** Persistent cough >3 weeks, blood in sputum, night sweats, weight loss, chest pain, fever\n\n**Diagnosis:** Sputum test, chest X-ray, Mantoux test\n\n**Treatment:**\n• **Free treatment under DOTS program** (Government of India)\n• Multi-drug therapy: 6-9 months\n• Rifampicin, Isoniazid, Pyrazinamide, Ethambutol\n• **Must complete full course** even if feeling better\n• Highly curable if treatment completed\n\n⚠️ **Important:** TB is contagious - follow doctor's isolation advice\n\n**Contact:** Local TB clinic, DOTS center, or call 1800-11-6666",
      confidence: 90,
      followUp: ["Have you been tested for TB?", "How long have you had the cough?", "Any family history of TB?"],
      medications: ["DOTS regimen (Government-provided)", "Vitamin B6", "Nutritious diet"]
    },
    chikungunya: {
      response: "**Chikungunya** - Mosquito-borne viral infection, common during monsoons.\n\n**Symptoms:** Sudden high fever, severe joint pain (can last months), headache, muscle pain, rash\n\n**Treatment:**\n• **No specific antiviral** - symptomatic treatment\n• Paracetamol for pain and fever (avoid NSAIDs initially)\n• Complete rest\n• Plenty of fluids\n• Joint pain may persist - physiotherapy may help\n\n**Recovery:** Usually 1-2 weeks for acute phase, joint pain may last longer\n\n**Prevention:** Mosquito control, use repellents, wear full-sleeve clothes",
      confidence: 88,
      followUp: ["How severe is your joint pain?", "Have you been tested for chikungunya?", "Are you able to move normally?"],
      medications: ["Paracetamol", "Topical pain relievers", "Physiotherapy later", "ORS"]
    },
    // GASTROINTESTINAL CONDITIONS
    diarrhea: {
      response: "**Diarrhea/Loose Motions** - Common in India due to food/water contamination.\n\n**Treatment:**\n• **ORS (Oral Rehydration Solution)** - most important!\n• Zinc supplements (especially for children)\n• Probiotics (Econorm, Vibact sachets)\n• Light food: Rice, banana, curd, toast\n• Avoid spicy, oily, dairy foods temporarily\n\n**Medications:**\n• Anti-diarrheals only if needed (Loperamide)\n• Antibiotics only if bacterial (consult doctor)\n\n⚠️ **See doctor if:** Blood in stool, high fever, severe dehydration, lasts >3 days\n\n**Prevention:** Wash hands, safe drinking water, properly cooked food",
      confidence: 86,
      followUp: ["Are you staying hydrated?", "Is there blood or mucus in stool?", "Do you have fever?"],
      medications: ["ORS packets", "Econorm sachet", "Zinc supplements", "Loperamide (if needed)"]
    },
    food_poisoning: {
      response: "**Food Poisoning** - Bacterial/viral contamination of food.\n\n**Symptoms:** Nausea, vomiting, diarrhea, abdominal cramps, fever (onset 1-6 hours after eating)\n\n**Treatment:**\n• Stop eating solid foods temporarily\n• Small sips of ORS every 15 minutes\n• Gradual return to bland foods\n• Rest\n• Activated charcoal tablets (optional)\n\n**Recovery:** Usually 24-48 hours\n\n⚠️ **Emergency if:** Severe dehydration, blood in vomit/stool, high fever >102°F, symptoms >3 days",
      confidence: 84,
      followUp: ["What did you eat recently?", "How many times have you vomited?", "Are you able to keep fluids down?"],
      medications: ["ORS", "Antiemetics (Ondansetron) if severe", "Probiotics", "Activated charcoal"]
    },
    constipation: {
      response: "**Constipation** - Difficulty passing stool or infrequent bowel movements.\n\n**Treatment:**\n• Increase fiber: Fruits (papaya, guava), vegetables, whole grains\n• Drink 8-10 glasses water daily\n• Exercise regularly (walking helps)\n• Isabgol (Psyllium husk) - 2 teaspoons with water\n• Avoid processed foods\n\n**Mild laxatives if needed:**\n• Lactulose syrup\n• Bisacodyl tablets\n• Glycerin suppositories\n\n⚠️ **See doctor if:** Severe pain, blood in stool, sudden change in bowel habits, unexplained weight loss",
      confidence: 83,
      followUp: ["How many days since last bowel movement?", "Are you drinking enough water?", "Any abdominal pain?"],
      medications: ["Isabgol (Psyllium)", "Lactulose syrup", "Bisacodyl", "Prune juice"]
    },
    // RESPIRATORY CONDITIONS
    asthma: {
      response: "**Asthma** - Chronic respiratory condition with airway inflammation.\n\n**Symptoms:** Wheezing, shortness of breath, chest tightness, coughing (worse at night)\n\n**Treatment:**\n• **Preventive:** Inhaled corticosteroids (Budeso nide)\n• **Relief:** Bronchodilator inhalers (Salbutamol/Albuterol)\n• Avoid triggers: Dust, smoke, pollution, cold air\n• Keep rescue inhaler always available\n• Regular check-ups\n\n**Emergency signs:** Severe breathlessness, blue lips, unable to speak - use inhaler and seek immediate help\n\n⚠️ **Important:** Never stop preventive medication without doctor's advice",
      confidence: 91,
      followUp: ["Do you have an inhaler?", "What triggers your asthma?", "How severe is your breathlessness now?"],
      medications: ["Salbutamol inhaler", "Budesonide inhaler", "Montelukast tablets", "Antihistamines"]
    },
    pneumonia: {
      response: "**Pneumonia** - Lung infection causing inflammation.\n\n**Symptoms:** High fever, cough with thick mucus, chest pain, difficulty breathing, fatigue\n\n**Treatment:**\n• **Antibiotics required** - Azithromycin, Amoxicillin (prescription only)\n• Cough expectorants\n• Paracetamol for fever\n• Steam inhalation\n• Plenty of rest and fluids\n• Chest physiotherapy may help\n\n⚠️ **Hospitalization if:** Severe breathing difficulty, low oxygen, elderly/children\n\n**Prevention:** Pneumonia vaccine available, especially for elderly",
      confidence: 89,
      type: 'urgent',
      followUp: ["Have you been diagnosed with pneumonia?", "Is breathing very difficult?", "Have you started antibiotics?"],
      medications: ["Azithromycin", "Amoxicillin-Clavulanate", "Paracetamol", "Expectorants", "Oxygen if needed"]
    },
    // SKIN CONDITIONS
    fungal_infection: {
      response: "**Fungal Skin Infection** - Common in humid climates, especially during monsoon.\n\n**Types:** Ringworm, athlete's foot, jock itch, nail fungus\n\n**Symptoms:** Itchy, red, circular rash; skin peeling; white patches\n\n**Treatment:**\n• **Antifungal creams:** Clotrimazole, Miconazole, Terbinafine\n• Apply twice daily for 2-4 weeks (continue 1 week after clearing)\n• Keep area clean and dry\n• Wear loose, cotton clothes\n• Antifungal powder for prevention\n• Oral antifungals if severe (Fluconazole, Griseofulvin)\n\n**Prevention:** Keep skin dry, avoid sharing towels, change socks daily",
      confidence: 86,
      followUp: ["How long have you had the infection?", "Is it spreading?", "Have you tried any creams?"],
      medications: ["Clotrimazole cream", "Terbinafine cream", "Fluconazole tablets (if severe)", "Antifungal powder"]
    },
    eczema: {
      response: "**Eczema (Atopic Dermatitis)** - Chronic skin condition causing itchy, inflamed skin.\n\n**Symptoms:** Dry, itchy, red patches; thickened skin; small bumps\n\n**Treatment:**\n• **Moisturizers:** Apply frequently (Cetaphil, Moisturex)\n• Mild steroid creams for flare-ups (Hydrocortisone)\n• Antihistamines for itching (Cetirizine)\n• Avoid triggers: Harsh soaps, wool clothes, stress\n• Use mild, fragrance-free products\n• Lukewarm baths (not hot)\n\n**For severe cases:** Stronger steroids or immunosuppressants (consult dermatologist)",
      confidence: 84,
      followUp: ["How severe is the itching?", "What triggers your eczema?", "Have you identified any allergens?"],
      medications: ["Hydrocortisone cream", "Cetirizine tablets", "Moisturizers", "Calamine lotion"]
    },
    // EYE CONDITIONS
    conjunctivitis: {
      response: "**Conjunctivitis (Pink Eye)** - Eye infection/inflammation, highly contagious.\n\n**Symptoms:** Red eyes, discharge, itching, tearing, crusting\n\n**Types:**\n• **Viral:** Most common, self-limiting\n• **Bacterial:** Yellow-green discharge\n• **Allergic:** Both eyes, itching\n\n**Treatment:**\n• **Viral:** Artificial tears, cold compress (resolves in 1-2 weeks)\n• **Bacterial:** Antibiotic eye drops (Moxifloxacin, Tobramycin)\n• **Allergic:** Antihistamine eye drops\n• Keep eyes clean\n• Avoid touching/rubbing eyes\n• Don't share towels\n\n⚠️ **See doctor if:** Vision changes, severe pain, light sensitivity",
      confidence: 87,
      followUp: ["What color is the discharge?", "Are both eyes affected?", "Any vision problems?"],
      medications: ["Antibiotic eye drops", "Artificial tears", "Antihistamine eye drops", "Cold compress"]
    },
    // SEASONAL/HEAT CONDITIONS
    heat_stroke: {
      response: "**Heat Stroke** - Life-threatening condition from overheating (common in Indian summers).\n\n**Symptoms:** Body temp >104°F, hot dry skin, confusion, rapid pulse, nausea, unconsciousness\n\n**EMERGENCY TREATMENT:**\n🚨 **Call 102/108 immediately**\n• Move to shade/AC room\n• Remove excess clothing\n• Cool person with wet cloths, ice packs\n• Fan continuously\n• Give cool water if conscious\n• DO NOT give fever medications\n\n**Prevention:**\n• Avoid midday sun (11 AM - 3 PM)\n• Wear light, loose cotton clothes\n• Stay hydrated - drink water every 30 min\n• Use ORS during hot days\n• Avoid alcohol and caffeine",
      confidence: 93,
      type: 'emergency',
      followUp: ["What's the body temperature?", "Is the person conscious?", "Have you called an ambulance?"],
      medications: ["ORS", "IV fluids (hospital)", "Cool water", "NO fever medications"]
    },
    dehydration: {
      response: "**Dehydration** - Loss of body fluids, common in hot climate/diarrhea.\n\n**Symptoms:** Dry mouth, decreased urination, dark urine, fatigue, dizziness, sunken eyes\n\n**Treatment:**\n• **ORS:** Most effective - 1 packet in 200ml water\n• Coconut water - excellent natural electrolyte\n• Fresh lime water with salt and sugar (homemade ORS)\n• Buttermilk\n• Fresh fruit juices\n• Avoid caffeine and alcohol\n\n**Severe dehydration:** May need IV fluids (hospital)\n\n⚠️ **Emergency if:** No urination >8 hours, extreme weakness, rapid heartbeat, confusion",
      confidence: 88,
      followUp: ["When did you last urinate?", "Are you able to keep fluids down?", "Do you have diarrhea or vomiting?"],
      medications: ["ORS packets", "Coconut water", "Electrolyte solutions", "IV fluids if severe"]
    },
    // VITAMIN DEFICIENCIES
    vitamin_d_deficiency: {
      response: "**Vitamin D Deficiency** - Very common in India despite sunshine!\n\n**Symptoms:** Bone pain, muscle weakness, fatigue, depression, frequent infections\n\n**Treatment:**\n• **Vitamin D3 supplements:** 60,000 IU weekly (prescription) or 1000-2000 IU daily\n• Sun exposure: 15-20 minutes daily (10 AM - 3 PM)\n• Diet: Eggs, fatty fish, fortified milk\n• Calcium supplements often needed\n\n**Duration:** Usually 8-12 weeks, then maintenance dose\n\n**Note:** Get blood test (25-OH Vitamin D) before starting high doses",
      confidence: 85,
      followUp: ["Have you had your vitamin D levels tested?", "Are you experiencing bone pain?", "Do you get regular sun exposure?"],
      medications: ["Vitamin D3 60,000 IU", "Daily Vitamin D3 1000-2000 IU", "Calcium supplements", "Vitamin K2"]
    },
    anemia: {
      response: "**Anemia (Iron Deficiency)** - Very common in India, especially in women.\n\n**Symptoms:** Fatigue, weakness, pale skin, shortness of breath, dizziness, cold hands/feet\n\n**Treatment:**\n• **Iron supplements:** Ferrous sulfate 200mg daily\n• Take with Vitamin C (orange juice) for better absorption\n• Avoid tea/coffee with meals (reduces iron absorption)\n• Iron-rich foods: Spinach, dates, pomegranate, jaggery, meat\n• May need Vitamin B12 and Folic acid too\n\n**Duration:** 3-6 months, recheck blood after 3 months\n\n⚠️ **Note:** Iron tablets may cause dark stools (normal), constipation",
      confidence: 87,
      followUp: ["What's your hemoglobin level?", "Are you pregnant or menstruating?", "Are you vegetarian?"],
      medications: ["Ferrous sulfate 200mg", "Folic acid 5mg", "Vitamin B12", "Vitamin C tablets"]
    },
    // WOMEN'S HEALTH
    pcos: {
      response: "**PCOS (Polycystic Ovary Syndrome)** - Hormonal disorder in women.\n\n**Symptoms:** Irregular periods, weight gain, acne, excess facial hair, difficulty conceiving\n\n**Treatment:**\n• **Birth control pills:** Regulate periods\n• **Metformin:** Improve insulin resistance\n• **Lifestyle changes:** Most important!\n  - Weight loss (5-10% helps significantly)\n  - Low-carb, high-protein diet\n  - Regular exercise (30 min daily)\n  - Stress management\n• For fertility: Clomiphene, Letrozole\n• For excess hair: Anti-androgens\n\n**Long-term:** Manage to prevent diabetes and heart disease",
      confidence: 86,
      followUp: ["Are your periods irregular?", "Have you been diagnosed with PCOS?", "Are you trying to conceive?"],
      medications: ["Birth control pills", "Metformin 500mg", "Myo-inositol", "Vitamin D"]
    },
    uti: {
      response: "**UTI (Urinary Tract Infection)** - More common in women.\n\n**Symptoms:** Burning during urination, frequent urination, cloudy/bloody urine, pelvic pain\n\n**Treatment:**\n• **Antibiotics required:** Nitrofurantoin, Cefixime (prescription, 3-7 days)\n• Drink lots of water (3-4 liters daily)\n• Cranberry juice (helps prevent recurrence)\n• Potassium citrate syrup (reduces burning)\n• Complete antibiotic course\n\n**Relief:**\n• Hot water bottle on lower abdomen\n• Urinate frequently (don't hold)\n\n⚠️ **See doctor if:** Fever, back pain (kidney infection), blood in urine",
      confidence: 88,
      followUp: ["Do you have fever?", "Any back pain?", "How long have you had symptoms?"],
      medications: ["Nitrofurantoin 100mg", "Cefixime 200mg", "Potassium citrate syrup", "Cranberry supplements"]
    },
    // LIFESTYLE CONDITIONS
    obesity: {
      response: "**Obesity Management** - Growing concern in urban India.\n\n**Health Risks:** Diabetes, heart disease, high BP, joint problems\n\n**Treatment Approach:**\n• **Diet:** Calorie deficit (consult nutritionist)\n  - Avoid refined carbs, sugar, fried foods\n  - Increase protein, fiber, vegetables\n  - Portion control\n• **Exercise:** 45-60 minutes daily\n  - Cardio + strength training\n  - Start slowly, increase gradually\n• **Behavioral changes:**\n  - Adequate sleep (7-8 hours)\n  - Stress management\n  - Mindful eating\n• **Medical:** Orlistat, Liraglutide (if prescribed)\n• **Surgery:** Last option for severe obesity (BMI >40)",
      confidence: 84,
      followUp: ["What's your current BMI?", "Have you tried diet and exercise?", "Any other health conditions?"],
      medications: ["Orlistat (if prescribed)", "Multivitamins", "Fiber supplements", "Nutritionist consultation"]
    },
    // MENTAL HEALTH
    anxiety: {
      response: "**Anxiety Disorders** - Mental health needs attention too!\n\n**Symptoms:** Excessive worry, restlessness, rapid heartbeat, sweating, difficulty concentrating\n\n**Treatment:**\n• **Therapy:** CBT (Cognitive Behavioral Therapy) - most effective\n• **Medications:** SSRIs (Escitalopram, Sertraline) if needed\n• **Self-help:**\n  - Regular exercise\n  - Deep breathing (4-7-8 technique)\n  - Meditation/Yoga\n  - Limit caffeine\n  - Adequate sleep\n• **Support:** Talk to someone, join support groups\n\n📞 **Helplines:**\n• Vandrevala Foundation: 1860-2662-345\n• iCall: 022-25521111\n• NIMHANS: 080-46110007",
      confidence: 85,
      followUp: ["How long have you been experiencing anxiety?", "Is it affecting daily life?", "Have you considered counseling?"],
      medications: ["Escitalopram (if prescribed)", "Propranolol (for physical symptoms)", "Melatonin (for sleep)", "Therapy most important"]
    }
  },
  medications: {
    general: "**IMPORTANT MEDICATION GUIDELINES:**\n\n✅ **Always:**\n• Follow doctor's instructions exactly\n• Take at prescribed times\n• Complete full course\n• Check expiry dates\n• Store properly\n\n❌ **Never:**\n• Share medications\n• Stop suddenly without consulting doctor\n• Take expired medicines\n• Mix with alcohol (unless advised)\n\n📝 Keep a medication list with you at all times.",
    interactions: "**Common Drug Interactions to Avoid:**\n• Aspirin + Blood thinners\n• Paracetamol + Alcohol (liver damage)\n• Antibiotics + Antacids (reduced absorption)\n• Blood pressure meds + NSAIDs\n\n**Always inform doctors about ALL medicines you're taking**",
    storage: "**Proper Medication Storage:**\n• Cool, dry place (unless refrigeration needed)\n• Away from sunlight\n• Child-proof containers\n• Original packaging with labels\n• Separate from food items"
  },
  emergency: {
    signs: "🚨 **CALL EMERGENCY SERVICES (102/108) IMMEDIATELY for:**\n\n• Severe chest pain or pressure\n• Difficulty breathing or choking\n• Sudden severe headache\n• Signs of stroke (F.A.S.T.)\n• Severe allergic reactions\n• Loss of consciousness\n• Heavy bleeding\n• Severe burns\n• Poisoning\n• High fever with stiff neck\n\n**Don't hesitate - immediate medical attention saves lives!**"
  },
  indian_medicines: {
    common: "**Popular Indian OTC Medicines:**\n\n**Pain/Fever:** Crocin, Combiflam, Brufen\n**Cough/Cold:** Benadryl, Ascoril, Cheston Cold\n**Acidity:** Eno, Pudin Hara, Digene\n**Diarrhea:** Econorm, Vibact, ORS packets\n**Allergies:** Cetrizine, Avil, Allegra\n\n*All medicines should be used as per instructions on package or doctor's advice*"
  }
};

const quickQuestions = [
  "What medications can I take for headache?",
  "How do I treat fever at home?",
  "What medicines are good for cough and cold?",
  "How to treat dengue fever?",
  "What to do for food poisoning?",
  "Emergency symptoms I should watch for?",
  "Best medicines for stomach pain and acidity?",
  "How to manage diabetes medications?",
  "What are symptoms of malaria?",
  "How to treat diarrhea/loose motions?",
  "Vitamin D deficiency treatment?",
  "Popular Indian OTC medicines?"
];

export function HealthChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Health Assistant. I can help answer general health questions, provide basic medical information, and guide you on when to seek professional care. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      confidence: 100
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeMessage = (message: string): { response: string; confidence: number; type?: string; followUp?: string[]; medications?: string[] } => {
    const lowerMessage = message.toLowerCase();
    
    // Check for emergency keywords
    const emergencyKeywords = ['chest pain', 'can\'t breathe', 'severe pain', 'bleeding heavily', 'unconscious', 'heart attack', 'stroke', 'suicide', 'overdose'];
    if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        response: "🚨 **EMERGENCY ALERT** 🚨\n\nBased on your symptoms, this could be a medical emergency. Please call emergency services (102/108 in India or 911) immediately or go to the nearest emergency room. Do not delay seeking immediate medical attention.\n\n**Indian Emergency Numbers:**\n• Medical Emergency: 102\n• Ambulance: 108\n• Police: 100",
        confidence: 99,
        type: 'emergency'
      };
    }

    // Specific symptom matching with enhanced medication suggestions
    if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
      return healthcareKnowledgeBase.symptoms.headache;
    }
    
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature') || lowerMessage.includes('pyrexia')) {
      return healthcareKnowledgeBase.symptoms.fever;
    }
    
    if (lowerMessage.includes('chest pain') || lowerMessage.includes('chest hurt')) {
      return healthcareKnowledgeBase.symptoms.chest_pain;
    }
    
    if (lowerMessage.includes('cough') || lowerMessage.includes('cold') || lowerMessage.includes('flu') || lowerMessage.includes('runny nose')) {
      if (lowerMessage.includes('cold') || lowerMessage.includes('flu')) {
        return healthcareKnowledgeBase.symptoms.cold_flu;
      }
      return healthcareKnowledgeBase.symptoms.cough;
    }

    if (lowerMessage.includes('stomach') || lowerMessage.includes('acidity') || lowerMessage.includes('heartburn') || lowerMessage.includes('indigestion')) {
      return healthcareKnowledgeBase.symptoms.stomach_pain;
    }

    if (lowerMessage.includes('diabetes') || lowerMessage.includes('blood sugar') || lowerMessage.includes('diabetic')) {
      return healthcareKnowledgeBase.symptoms.diabetes;
    }

    if (lowerMessage.includes('blood pressure') || lowerMessage.includes('hypertension') || lowerMessage.includes('bp')) {
      return healthcareKnowledgeBase.symptoms.hypertension;
    }

    // TROPICAL & INDIAN-SPECIFIC DISEASES
    if (lowerMessage.includes('dengue')) {
      return healthcareKnowledgeBase.symptoms.dengue;
    }

    if (lowerMessage.includes('malaria')) {
      return healthcareKnowledgeBase.symptoms.malaria;
    }

    if (lowerMessage.includes('typhoid')) {
      return healthcareKnowledgeBase.symptoms.typhoid;
    }

    if (lowerMessage.includes('jaundice') || lowerMessage.includes('hepatitis') || lowerMessage.includes('yellow eyes') || lowerMessage.includes('yellow skin')) {
      return healthcareKnowledgeBase.symptoms.jaundice;
    }

    if (lowerMessage.includes('tuberculosis') || lowerMessage.includes('tb') || lowerMessage.includes('blood in sputum')) {
      return healthcareKnowledgeBase.symptoms.tuberculosis;
    }

    if (lowerMessage.includes('chikungunya') || lowerMessage.includes('joint pain fever')) {
      return healthcareKnowledgeBase.symptoms.chikungunya;
    }

    // GASTROINTESTINAL
    if (lowerMessage.includes('diarrhea') || lowerMessage.includes('diarrhoea') || lowerMessage.includes('loose motion') || lowerMessage.includes('loose stool')) {
      return healthcareKnowledgeBase.symptoms.diarrhea;
    }

    if (lowerMessage.includes('food poisoning') || lowerMessage.includes('vomiting') || lowerMessage.includes('nausea')) {
      return healthcareKnowledgeBase.symptoms.food_poisoning;
    }

    if (lowerMessage.includes('constipation') || lowerMessage.includes('hard stool') || lowerMessage.includes('difficulty passing stool')) {
      return healthcareKnowledgeBase.symptoms.constipation;
    }

    // RESPIRATORY
    if (lowerMessage.includes('asthma') || lowerMessage.includes('wheezing') || lowerMessage.includes('inhaler')) {
      return healthcareKnowledgeBase.symptoms.asthma;
    }

    if (lowerMessage.includes('pneumonia') || lowerMessage.includes('lung infection')) {
      return healthcareKnowledgeBase.symptoms.pneumonia;
    }

    // SKIN CONDITIONS
    if (lowerMessage.includes('fungal infection') || lowerMessage.includes('ringworm') || lowerMessage.includes('jock itch') || lowerMessage.includes('athlete foot')) {
      return healthcareKnowledgeBase.symptoms.fungal_infection;
    }

    if (lowerMessage.includes('eczema') || lowerMessage.includes('atopic dermatitis') || lowerMessage.includes('itchy skin')) {
      return healthcareKnowledgeBase.symptoms.eczema;
    }

    // EYE
    if (lowerMessage.includes('conjunctivitis') || lowerMessage.includes('pink eye') || lowerMessage.includes('eye infection') || lowerMessage.includes('red eye')) {
      return healthcareKnowledgeBase.symptoms.conjunctivitis;
    }

    // HEAT/SEASONAL
    if (lowerMessage.includes('heat stroke') || lowerMessage.includes('heat exhaustion')) {
      return healthcareKnowledgeBase.symptoms.heat_stroke;
    }

    if (lowerMessage.includes('dehydration') || lowerMessage.includes('dehydrated')) {
      return healthcareKnowledgeBase.symptoms.dehydration;
    }

    // VITAMIN DEFICIENCIES
    if (lowerMessage.includes('vitamin d') || lowerMessage.includes('vitamin d deficiency')) {
      return healthcareKnowledgeBase.symptoms.vitamin_d_deficiency;
    }

    if (lowerMessage.includes('anemia') || lowerMessage.includes('anaemia') || lowerMessage.includes('iron deficiency') || lowerMessage.includes('low hemoglobin')) {
      return healthcareKnowledgeBase.symptoms.anemia;
    }

    // WOMEN'S HEALTH
    if (lowerMessage.includes('pcos') || lowerMessage.includes('pcod') || lowerMessage.includes('polycystic') || lowerMessage.includes('irregular periods')) {
      return healthcareKnowledgeBase.symptoms.pcos;
    }

    if (lowerMessage.includes('uti') || lowerMessage.includes('urinary tract infection') || lowerMessage.includes('burning urination') || lowerMessage.includes('painful urination')) {
      return healthcareKnowledgeBase.symptoms.uti;
    }

    // LIFESTYLE
    if (lowerMessage.includes('obesity') || lowerMessage.includes('weight loss') || lowerMessage.includes('overweight')) {
      return healthcareKnowledgeBase.symptoms.obesity;
    }

    // MENTAL HEALTH
    if (lowerMessage.includes('anxiety') || lowerMessage.includes('panic') || lowerMessage.includes('worried')) {
      return healthcareKnowledgeBase.symptoms.anxiety;
    }

    // Medication-specific queries
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine') || lowerMessage.includes('pills') || lowerMessage.includes('drugs')) {
      if (lowerMessage.includes('interaction') || lowerMessage.includes('mix')) {
        return {
          response: healthcareKnowledgeBase.medications.interactions,
          confidence: 90
        };
      }
      if (lowerMessage.includes('store') || lowerMessage.includes('storage')) {
        return {
          response: healthcareKnowledgeBase.medications.storage,
          confidence: 88
        };
      }
      return {
        response: healthcareKnowledgeBase.medications.general,
        confidence: 88
      };
    }

    // Indian medicines query
    if (lowerMessage.includes('indian medicine') || lowerMessage.includes('otc') || lowerMessage.includes('over the counter') || lowerMessage.includes('pharmacy')) {
      return {
        response: healthcareKnowledgeBase.indian_medicines.common,
        confidence: 85
      };
    }

    // Emergency questions
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('serious')) {
      return {
        response: healthcareKnowledgeBase.emergency.signs,
        confidence: 95
      };
    }

    // General health and wellness
    if (lowerMessage.includes('healthy') || lowerMessage.includes('wellness') || lowerMessage.includes('fitness')) {
      return {
        response: "**Maintaining Good Health - Key Guidelines:**\n\n🏃‍♂️ **Exercise:** 30 minutes daily (walking, yoga, swimming)\n🥗 **Diet:** Balanced nutrition with fruits, vegetables, whole grains\n💤 **Sleep:** 7-9 hours of quality sleep\n💧 **Hydration:** 8-10 glasses of water daily\n🧘‍♀️ **Stress Management:** Meditation, deep breathing\n🚭 **Avoid:** Smoking, excessive alcohol\n👨‍⚕️ **Regular Checkups:** Annual health screenings\n\n**Remember:** Prevention is better than cure!",
        confidence: 85
      };
    }

    // Nutrition and diet
    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('food')) {
      return {
        response: "**Healthy Diet Guidelines for Indians:**\n\n🌾 **Include:** Whole grains (brown rice, whole wheat)\n🥬 **Vegetables:** 5-6 servings daily (leafy greens, colorful veggies)\n🍎 **Fruits:** 2-3 servings daily\n🥛 **Protein:** Dal, paneer, eggs, fish, chicken\n🥜 **Healthy Fats:** Nuts, seeds, olive oil\n💧 **Hydration:** Water, buttermilk, coconut water\n\n**Limit:** Processed foods, excess sugar, fried items, high sodium",
        confidence: 82
      };
    }

    // Mental health
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('depression') || lowerMessage.includes('mental health')) {
      return {
        response: "**Mental Health Support:**\n\n🧘‍♀️ **Stress Management:**\n• Practice deep breathing exercises\n• Regular meditation (10-15 minutes daily)\n• Yoga and physical exercise\n• Adequate sleep routine\n\n**When to Seek Help:**\n• Persistent sadness or anxiety\n• Sleep disturbances\n• Loss of interest in activities\n• Difficulty concentrating\n\n📞 **Mental Health Helplines (India):**\n• Vandrevala Foundation: 1860 2662 345\n• iCall: 022-25521111\n\n**Remember:** Seeking help is a sign of strength, not weakness.",
        confidence: 87
      };
    }

    // Default enhanced response
    return {
      response: "I'm here to help with your health questions! I can provide information about:\n\n💊 **Medications** - Dosages, interactions, storage\n🤒 **Symptoms** - Common treatments and when to see a doctor\n🏥 **Healthcare** - General medical advice and emergency signs\n🇮🇳 **Indian Medicines** - Popular OTC options available in India\n\n**Popular queries:**\n• \"What medicine for headache?\"\n• \"How to treat fever?\"\n• \"Emergency symptoms to watch for?\"\n• \"Best Indian medicines for cold?\"\n\nPlease ask about specific symptoms or health concerns, and I'll provide detailed guidance!",
      confidence: 70
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const analysis = analyzeMessage(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: analysis.response,
        sender: 'bot',
        timestamp: new Date(),
        confidence: analysis.confidence,
        type: analysis.type
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Add follow-up questions if available
      if (analysis.followUp) {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: `Here are some follow-up questions that might help:\n${analysis.followUp!.map((q, i) => `${i + 1}. ${q}`).join('\n')}`,
            sender: 'bot',
            timestamp: new Date(),
            confidence: 90
          };
          setMessages(prev => [...prev, followUpMessage]);
        }, 1000);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">AI Health Assistant</h2>
        <p className="text-muted-foreground">
          Get instant answers to your health questions with our AI-powered chatbot
        </p>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="resources">Health Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start text-xs h-auto py-2"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Health Chat</span>
                </CardTitle>
                <CardDescription>
                  Ask questions about symptoms, medications, or general health advice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chat Messages */}
                <ScrollArea className="h-96 pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {message.sender === 'user' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`flex-1 space-y-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                          <div
                            className={`rounded-lg p-3 max-w-xs ${
                              message.sender === 'user'
                                ? 'bg-blue-500 text-white ml-auto'
                                : message.type === 'emergency'
                                ? 'bg-red-50 border border-red-200'
                                : 'bg-gray-100'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                            {message.confidence && message.sender === 'bot' && (
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {message.confidence}% confidence
                                </Badge>
                                {message.type === 'emergency' && (
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask about symptoms, medications, or health concerns..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This AI assistant provides general health information only. Always consult healthcare professionals for medical advice, diagnosis, or treatment.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <Phone className="h-5 w-5" />
                  <span>Emergency Contacts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Medical Emergency (India)</p>
                      <p className="text-sm text-muted-foreground">Immediate life-threatening emergencies</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      102
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Ambulance Service</p>
                      <p className="text-sm text-muted-foreground">Emergency ambulance</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      108
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Police Emergency</p>
                      <p className="text-sm text-muted-foreground">Police assistance</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      100
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Mental Health Helpline</p>
                      <p className="text-sm text-muted-foreground">Vandrevala Foundation</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      1860 2662 345
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Poison Control</p>
                      <p className="text-sm text-muted-foreground">AIIMS Poison Control</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      1066
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5" />
                  <span>Telehealth Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Virtual Urgent Care</p>
                    <p className="text-sm text-muted-foreground mb-2">Available 24/7 for non-emergency consultations</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Video className="h-4 w-4 mr-2" />
                      Start Video Call
                    </Button>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Schedule Appointment</p>
                    <p className="text-sm text-muted-foreground mb-2">Book with your primary care provider</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Heart Health (Indian Context)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Monitor BP regularly (target &lt;120/80)</li>
                  <li>• Daily 30-min walk or yoga</li>
                  <li>• Reduce salt intake (&lt;5g/day)</li>
                  <li>• Include dal, vegetables, fruits</li>
                  <li>• Limit fried foods and sweets</li>
                  <li>• Take prescribed medications regularly</li>
                  <li>• Regular heart check-ups</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span>Mental Health Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Practice meditation/pranayama</li>
                  <li>• Family and social support</li>
                  <li>• 7-8 hours sleep daily</li>
                  <li>• Professional counseling when needed</li>
                  <li>• Regular exercise/yoga</li>
                  <li>• Limit social media usage</li>
                  <li>• Helplines: 1860 2662 345</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  <span>Indian Wellness Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Drink 8-10 glasses water daily</li>
                  <li>• Include turmeric, ginger in diet</li>
                  <li>• Regular health check-ups</li>
                  <li>• Maintain healthy BMI (18.5-24.9)</li>
                  <li>• Hand hygiene & cleanliness</li>
                  <li>• Seasonal fruit consumption</li>
                  <li>• Avoid tobacco & alcohol</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}