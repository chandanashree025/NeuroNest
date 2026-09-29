import re
import logging
from typing import Dict, Any, List
import httpx
from app.core.config import LLM_API_KEY, LLM_MODEL, LLM_ENDPOINT

logger = logging.getLogger(__name__)

# Multilingual responses dictionary for fallback and consistent messaging
LOCALIZED_NOT_SAVED = {
    "en": "I don't have that information saved yet. You or your caregiver can add it to your Memory Library or Family page anytime.",
    "kn": "ನನ್ನಲ್ಲಿ ಆ ಮಾಹಿತಿ ಇನ್ನೂ ಉಳಿಸಲಾಗಿಲ್ಲ. ನೀವು ಅಥವಾ ನಿಮ್ಮ ಆರೈಕೆದಾರರು ಅದನ್ನು ಮೆಮೊರಿ ಲೈಬ್ರರಿ ಅಥವಾ ಕುಟುಂಬ ಪುಟದಲ್ಲಿ ಸೇರಿಸಬಹುದು.",
    "hi": "मेरे पास अभी यह जानकारी सुरक्षित नहीं है। आप या आपके देखभालकर्ता इसे अपनी मेमोरी लाइब्रेरी या परिवार पेज में जोड़ सकते हैं।",
    "ta": "என்னிடம் இன்னும் அந்த தகவல் சேமிக்கப்படவில்லை. நீங்களோ அல்லது உங்களை கவனிப்பவரோ இதை நினைவக நூலகம் அல்லது குடும்ப பக்கத்தில் சேர்க்கலாம்.",
    "te": "నా వద్ద ఇంకా ఆ సమాచారం భద్రపరచబడలేదు. మీరు లేదా మీ సంరక్షకులు దీనిని మీ మెమరీ లైబ్రరీ లేదా కుటుంబ పేజీలో జోడించవచ్చు.",
    "ml": "എന്റെ പക്കൽ ഇതുവരെ ആ വിവരങ്ങൾ സൂക്ഷിച്ചിട്ടില്ല. നിങ്ങൾക്കോ നിങ്ങളുടെ പരിചാരകനോ ഇത് നിങ്ങളുടെ മെമ്മറി ലൈബ്രറിയിലോ കുടുംബ പേജിലോ ചേർക്കാവുന്നതാണ്.",
    "bn": "আমার কাছে এখনো এই তথ্যটি সংরক্ষিত নেই। আপনি বা আপনার যত্নশীল যেকোনো সময় এটি আপনার স্মৃতি গ্রন্থাগার বা পরিবার পাতায় যোগ করতে পারেন।",
    "as": "মোৰ হাতত এতিয়ালৈকে এই তথ্য সংৰক্ষণ কৰা হোৱা নাই। আপুনি বা আপোনাৰ যত্ন লওঁতাই যিকোনো সময়তে স্মৃতি লাইব্ৰেৰী বা পৰিয়াল পৃষ্ঠাত যোগ কৰিব পাৰে।"
}

LOCALIZED_MEDICAL_WARNING = {
    "en": "NeuroNest provides memory and cognitive assistance and does not provide medical diagnoses or medication advice. Please consult your doctor or primary healthcare provider.",
    "kn": "ನ್ಯೂರೋನೆಸ್ಟ್ ಸ್ಮರಣೆ ಮತ್ತು ಅರಿವಿನ ನೆರವು ನೀಡುತ್ತದೆ ಮತ್ತು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯ ಅಥವಾ ಔಷಧ ಸಲಹೆ ನೀಡುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    "hi": "न्यूरोनेस्ट स्मृति और संज्ञानात्मक सहायता प्रदान करता है और चिकित्सीय निदान या दवा संबंधी सलाह नहीं देता है। कृपया अपने चिकित्सक से परामर्श लें।",
    "ta": "நியூரோநெஸ்ட் நினைவகம் மற்றும் அறிவாற்றல் ஆதரவை வழங்குகிறது; மருத்துவ நோயறிதல் அல்லது மருந்து ஆலோசனைகளை வழங்காது. உங்கள் மருத்துவரை அணுகவும்.",
    "te": "న్యూరోనెస్ట్ జ్ఞాపకశక్తి మరియు అభిజ్ఞా సహాయాన్ని అందిస్తుంది మరియు వైద్య నిర్ధారణ లేదా మందుల సలహాలను అందించదు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.",
    "ml": "ന്യൂറോനെസ്റ്റ് ഓർമ്മയും വൈജ്ഞാനികവുമായ പിന്തുണ നൽകുന്നു; വൈദ്യശാസ്ത്രപരമായ രോഗനിർണയമോ മരുന്ന് നിർദ്ദേശങ്ങളോ നൽകുന്നില്ല. ദയവായി ഡോക്ടറെ സമീപിക്കുക.",
    "bn": "নিউরোনেস্ট স্মৃতি ও জ্ঞানীয় সহায়তা প্রদান করে; এটি কোনো চিকিৎসাগত রোগনির্ণয় বা ওষুধের পরামর্শ দেয় না। দয়া করে আপনার ডাক্তারের পরামর্শ নিন।",
    "as": "নিউৰোনেষ্টে স্মৃতি আৰু জ্ঞানীয় সহায় প্ৰদান কৰে; ই কোনো চিকিৎসা নিদান বা ঔষধৰ পৰামৰ্শ নিদিয়ে। অনুগ্ৰহ কৰি আপোনাৰ চিকিৎসকৰ পৰামৰ্শ লওক।"
}

LOCALIZED_GREETINGS = {
    "en": "Hello! I am your NeuroNest companion. It is wonderful to talk with you today. How are you feeling, and what memory or activity would you like to explore?",
    "kn": "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ನ್ಯೂರೋನೆಸ್ಟ್ ಒಡನಾಡಿ. ಇಂದು ನಿಮ್ಮೊಂದಿಗೆ ಮಾತನಾಡುತ್ತಿರುವುದು ಸಂತೋಷವಾಗಿದೆ. ನೀವು ಹೇಗೆ ಭಾವಿಸುತ್ತಿದ್ದೀರಿ?",
    "hi": "नमस्ते! मैं आपका न्यूरोनेस्ट साथी हूँ। आज आपसे बात करके मुझे बहुत खुशी हो रही है। आप कैसा महसूस कर रहे हैं?",
    "ta": "வணக்கம்! நான் உங்கள் நியூரோநெஸ்ட் தோழன். இன்று உங்களுடன் பேசுவதில் மகிழ்ச்சி. நீங்கள் எப்படி உணர்கிறீர்கள்?",
    "te": "నమస్కారం! నేను మీ న్యూరోనెస్ట్ సహచరుడిని. ఈ రోజు మీతో మాట్లాడటం చాలా సంతోషంగా ఉంది. మీరు ఎలా ఉన్నారు?",
    "ml": "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ న్యూറോനെസ്റ്റ് കൂട്ടുകാരനാണ്. ഇന്ന് നിങ്ങളോട് സംസാരിക്കുന്നതിൽ വലിയ സന്തോഷം. സുഖമാണോ?",
    "bn": "নমস্কার! আমি আপনার নিউরোনেস্ট সঙ্গী। আজ আপনার সাথে কথা বলতে পেরে খুব ভালো লাগছে। আপনি কেমন বোধ করছেন?",
    "as": "নমস্কাৰ! মই আপোনাৰ নিউৰোনেষ্ট সংগী। আজি আপোনাৰ সৈতে কথা পাতিবলৈ পাই বহুত ভাল লাগিছে। আপুನಿ কেনে অনুভৱ কৰিছে?"
}

LOCALIZED_GAME_SUGGESTIONS = {
    "en": "A gentle cognitive exercise is a great way to stay sharp! I suggest trying 'Sequence Recall' for your working memory or 'Memory Match' with relaxing nature cards. Would you like to play one now?",
    "kn": "ಮನಸ್ಸನ್ನು ಚುರುಕಾಗಿಡಲು ಲಘು ಅರಿವಿನ ಚಟುವಟಿಕೆಗಳು ತುಂಬಾ ಒಳ್ಳೆಯದು! ನಿಮ್ಮ ಕಾರ್ಯನಿರತ ಸ್ಮರಣೆಗಾಗಿ 'ಸೀಕ್ವೆನ್ಸ್ ರೀಕಾಲ್' ಅಥವಾ 'ಮೆಮೊರಿ ಮ್ಯಾಚ್' ಆಡಲು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ.",
    "hi": "मन को तरोताजा रखने के लिए एक हल्की संज्ञानात्मक गतिविधि बहुत अच्छी है! मैं सुझाव देता हूँ कि आप 'सीक्वेंस रिकॉल' या 'मेमोरी मैच' खेलें। क्या आप खेलना चाहेंगे?",
    "ta": "மனதை சுறுசுறுப்பாக வைத்திருக்க எளிய அறிவாற்றல் பயிற்சி மிகவும் நல்லது! உங்கள் நினைவாற்றலுக்காக 'சீக்வென்ஸ் ரீகால்' அல்லது 'மெமரி மேட்ச்' விளையாட பரிந்துரைக்கிறேன்.",
    "te": "మనస్సును ఉల్లాసంగా ఉంచడానికి తేలికపాటి కార్యకలాపం చాలా మంచిది! మీ వర్కింగ్ మెమరీ కోసం 'సీక్వెన్స్ రీకాల్' లేదా 'మెమరీ మ్యాచ్' ఆడాలని నేను సూచిస్తున్నాను.",
    "ml": "മനസ്സ് സജീവമായി നിലനിർത്താൻ ലളിതമായ വൈജ്ഞാനിക വ്യായാമം വളരെ നല്ലതാണ്! 'സീക്വൻസ് റീകോൾ' അല്ലെങ്കിൽ 'മെമ്മറി മാച്ച്' കളിക്കാൻ ഞാൻ ശുപാർശ ചെയ്യുന്നു.",
    "bn": "মন সতেজ রাখতে একটি সহজ জ্ঞানীয় খেলা চমৎকার! আমি আপনার জন্য 'সিকোয়েন্স রিকল' বা 'মেমরি ম্যাচ' খেলার পরামর্শ দিচ্ছি।",
    "as": "মনটো সতেজ কৰি ৰাখিবলৈ এটা সৰু জ্ঞানীয় অনুশীলন বৰ ভাল! মই আপোনাক 'ছিকুৱেন্স ৰিকল' বা 'মেমৰি মেচ' খেলিবলৈ পৰামৰ্শ দিছোঁ।"
}

async def generate_ai_response(
    query: str,
    user_name: str,
    language: str,
    memory_context: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate conversational assistance using either external LLM API or
    an intelligent, strictly memory-grounded local response engine.
    """
    lang = language if language in LOCALIZED_NOT_SAVED else "en"
    clean_query = query.strip()
    clean_lower = clean_query.lower()

    # Safety Guardrail: Medical advice
    medical_keywords = ["diagnose", "dementia", "alzheimer", "cure", "medicine", "pill", "dosage", "prescription", "emergency"]
    if any(k in clean_lower for k in medical_keywords):
        return {
            "response": LOCALIZED_MEDICAL_WARNING.get(lang, LOCALIZED_MEDICAL_WARNING["en"]),
            "source": "Guardian Agent (Safety Guardrail)",
            "language": lang,
            "detected_intent": "medical_safety"
        }

    # Greeting intent
    greeting_keywords = ["hello", "hi", "hey", "namaste", "good morning", "good afternoon", "good evening", "how are you"]
    if any(clean_lower.startswith(k) or clean_lower == k for k in greeting_keywords):
        return {
            "response": LOCALIZED_GREETINGS.get(lang, LOCALIZED_GREETINGS["en"]),
            "source": "Companion Agent",
            "language": lang,
            "detected_intent": "greeting"
        }

    # Activity / Game suggestion intent
    game_keywords = ["game", "play", "activity", "exercise", "bored", "suggest", "what can i do", "recommend"]
    if any(k in clean_lower for k in game_keywords):
        return {
            "response": LOCALIZED_GAME_SUGGESTIONS.get(lang, LOCALIZED_GAME_SUGGESTIONS["en"]),
            "source": "Cognitive Coach Agent",
            "language": lang,
            "detected_intent": "activity_recommendation"
        }

    # Memory / Family Retrieval:
    # Check if this query is about family, people, visits, schedules, or past events
    matched_family = memory_context.get("matched_family", [])
    matched_memories = memory_context.get("matched_memories", [])
    
    # Check if query asks about family members or visit routines
    family_query_words = ["daughter", "son", "visit", "visiting", "comes", "family", "wife", "husband", "child", "sister", "brother", "grandchild", "friend", "anitha", "who is", "when does"]
    is_personal_query = any(w in clean_lower for w in family_query_words) or len(matched_family) > 0 or len(matched_memories) > 0

    if matched_family:
        fm = matched_family[0]
        # Formulate grounded personal answer
        name = fm.get("name")
        rel = fm.get("relationship")
        desc = fm.get("description", "")
        memos = fm.get("important_memories", "")
        
        info_parts = []
        if desc:
            info_parts.append(desc)
        if memos:
            info_parts.append(memos)
        detail_text = " ".join(info_parts)
        
        if lang == "en":
            ans = f"Your {rel.lower() if rel else 'family member'}, {name}, {detail_text}" if detail_text.lower().startswith("usually") or detail_text.lower().startswith("is") else f"Regarding your {rel.lower()} {name}: {detail_text}"
        elif lang == "kn":
            ans = f"ನಿಮ್ಮ {rel} {name} ಅವರ ಬಗ್ಗೆ: {detail_text}"
        elif lang == "hi":
            ans = f"आपके {rel} {name} के बारे में: {detail_text}"
        elif lang == "ta":
            ans = f"உங்கள் {rel} {name} பற்றி: {detail_text}"
        elif lang == "te":
            ans = f"మీ {rel} {name} గురించి: {detail_text}"
        elif lang == "ml":
            ans = f"നിങ്ങളുടെ {rel} {name} സംബന്ധിച്ച്: {detail_text}"
        elif lang == "bn":
            ans = f"আপনার {rel} {name} সম্পর্কে: {detail_text}"
        elif lang == "as":
            ans = f"আপোনাৰ {rel} {name} সম্পৰ্কে: {detail_text}"
        else:
            ans = f"Your {rel} {name}: {detail_text}"

        return {
            "response": ans,
            "source": "Personal Memory Agent",
            "language": lang,
            "detected_intent": "family_memory_retrieval",
            "context_used": [f"{name} ({rel}): {detail_text}"]
        }

    if matched_memories:
        m = matched_memories[0]
        title = m.get("title")
        desc = m.get("description")
        person = m.get("person")
        date = m.get("date")

        prefix = f"From your memory '{title}'"
        if date:
            prefix += f" ({date})"
        if person:
            prefix += f" with {person}"
            
        if lang == "en":
            ans = f"{prefix}: {desc}"
        elif lang == "kn":
            ans = f"ನಿಮ್ಮ ಸ್ಮರಣೆ '{title}' ಇಂದ: {desc}"
        elif lang == "hi":
            ans = f"आपकी स्मृति '{title}' से: {desc}"
        elif lang == "ta":
            ans = f"உங்கள் நினைவு '{title}' இலிருந்து: {desc}"
        elif lang == "te":
            ans = f"మీ జ్ఞాపకం '{title}' నుండి: {desc}"
        elif lang == "ml":
            ans = f"നിങ്ങളുടെ ഓർമ്മ '{title}'-ൽ നിന്ന്: {desc}"
        elif lang == "bn":
            ans = f"আপনার স্মৃতি '{title}' থেকে: {desc}"
        elif lang == "as":
            ans = f"আপোনাৰ স্মৃতি '{title}' ৰ পৰা: {desc}"
        else:
            ans = f"{prefix}: {desc}"

        return {
            "response": ans,
            "source": "Personal Memory Agent",
            "language": lang,
            "detected_intent": "library_memory_retrieval",
            "context_used": [f"{title}: {desc}"]
        }

    # If the user is asking a personal memory question but we don't have it saved:
    if is_personal_query:
        return {
            "response": LOCALIZED_NOT_SAVED.get(lang, LOCALIZED_NOT_SAVED["en"]),
            "source": "Personal Memory Agent",
            "language": lang,
            "detected_intent": "memory_missing"
        }

    # If an external LLM API key is provided, attempt external completion with strict grounding
    if LLM_API_KEY:
        try:
            return await _call_external_llm(clean_query, user_name, lang, memory_context)
        except Exception as e:
            logger.warning(f"External LLM call failed, falling back to local engine: {e}")

    # Default friendly conversational fallback
    default_responses = {
        "en": f"Thank you for sharing that with me, {user_name}. I am always here to help you recall memories, stay connected with family, or play engaging cognitive games. What would you like to do next?",
        "kn": f"ನನ್ನೊಂದಿಗೆ ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು, {user_name}. ನೆನಪುಗಳನ್ನು ನೆನಪಿಸಿಕೊಳ್ಳಲು ಅಥವಾ ಅರಿವಿನ ಆಟಗಳನ್ನು ಆಡಲು ನಾನು ಯಾವಾಗಲೂ ಇಲ್ಲಿದ್ದೇನೆ.",
        "hi": f"मुझसे बात करने के लिए धन्यवाद, {user_name}। मैं यादों को याद रखने या संज्ञानात्मक खेल खेलने में आपकी मदद के लिए हमेशा यहाँ हूँ।",
        "ta": f"என்னிடம் பகிர்ந்தமைக்கு நன்றி, {user_name}. நினைவுகளை நினைவுபடுத்த அல்லது பயிற்சிகள் செய்ய நான் எப்போதும் தயாராக உள்ளேன்.",
        "te": f"నాతో పంచుకున్నందుకు ధన్యవాదాలు, {user_name}. జ్ఞాపకాలను గుర్తుచేసుకోవడానికి లేదా ఆటలు ఆడటానికి నేను ఎల్లప్పుడూ ఇక్కడ ఉంటాను.",
        "ml": f"എന്റെയടുത്ത് പങ്കുവെച്ചതിന് നന്ദി, {user_name}. ഓർമ്മകൾ ഓർത്തെടുക്കാനും കളിക്കാനും ഞാൻ എപ്പോഴും ഒപ്പമുണ്ട്.",
        "bn": f"আমার সাথে কথা বলার জন্য ধন্যবাদ, {user_name}। আপনার স্মৃতি মনে করতে বা খেলা খেলতে আমি সবসময় পাশে আছি।",
        "as": f"মোৰ সৈতে কথা পতাৰ বাবে ধন্যবাদ, {user_name}। স্মৃতি মনত পেলাবলৈ বা খেল খেলিবলৈ মই সদায় আপোনাৰ লগত আছোঁ।"
    }
    
    return {
        "response": default_responses.get(lang, default_responses["en"]),
        "source": "Companion Agent",
        "language": lang,
        "detected_intent": "general_conversation"
    }

async def _call_external_llm(
    query: str,
    user_name: str,
    language: str,
    memory_context: Dict[str, Any]
) -> Dict[str, Any]:
    """Call external OpenAI-compatible or Gemini API endpoint with strict guardrails."""
    system_prompt = f"""You are NeuroNest, a gentle, respectful AI companion for older adults.
User's Name: {user_name}
Target Response Language: {language}

CRITICAL RULES:
1. Do NOT diagnose dementia, Alzheimer's, or any medical condition.
2. Do NOT give medical or medication prescriptions.
3. Only cite personal memories or family members if they appear in the provided context below.
4. If asked about a personal memory, family member, or schedule NOT in the context, reply honestly:
"I don't have that information saved yet." (or in target language). NEVER make up personal memories.
5. Keep sentences clear, calm, and comforting.

User Context:
Family: {memory_context.get('all_family_summary', [])}
Memories: {memory_context.get('all_memories_summary', [])}
"""
    endpoint = LLM_ENDPOINT or "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
    headers = {
        "Authorization": f"Bearer {LLM_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": LLM_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ],
        "temperature": 0.3
    }
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(endpoint, json=payload, headers=headers)
        if resp.status_code == 200:
            data = resp.json()
            reply = data["choices"][0]["message"]["content"]
            return {
                "response": reply,
                "source": "LLM Service (Grounded)",
                "language": language,
                "detected_intent": "llm_generated"
            }
        else:
            raise RuntimeError(f"LLM API returned status {resp.status_code}: {resp.text}")
