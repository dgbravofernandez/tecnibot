"""
OCR del manual Saeco Artic 272 usando Gemini Vision.
Convierte cada página del PDF escaneado a imagen y extrae el texto.
"""
import fitz  # PyMuPDF
import base64
import json
import time
import requests
import os

PDF_PATH = r"C:\Users\dgbra\vendingbot\knowledge-base\machines\artic\artic-272.pdf"
OUT_TS   = r"C:\Users\dgbra\vendingbot\app\manuals\data\saeco-artic.ts"

# API key del .env.local
API_KEY  = "AQ.Ab8RN6KWYg9BC5TV0vVJ8CriVlYBbmEeCNyi7bQ8WfIimjvk4g"
MODEL    = "gemini-1.5-flash"  # mejor soporte OCR en free tier
API_URL  = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

PROMPT = (
    "Eres un OCR especializado en manuales técnicos de máquinas expendedoras en español. "
    "Extrae TODO el texto visible en esta imagen de manual técnico. "
    "Incluye: instrucciones, códigos de error, procedimientos, tablas, advertencias, notas. "
    "Responde SOLO con el texto extraído, sin comentarios propios. "
    "Mantén la estructura original (listas, numeración). "
    "Si hay tablas, represéntalas con | como separador."
)

def page_to_base64(page):
    """Renderiza una página PDF a PNG en base64."""
    mat = fitz.Matrix(2.0, 2.0)  # 2x zoom para mejor resolución
    pix = page.get_pixmap(matrix=mat)
    return base64.b64encode(pix.tobytes("png")).decode()

def extract_page(page_b64: str, page_num: int) -> str:
    payload = {
        "contents": [{
            "parts": [
                {"text": PROMPT},
                {"inline_data": {"mime_type": "image/png", "data": page_b64}}
            ]
        }],
        "generationConfig": {"temperature": 0.0, "maxOutputTokens": 2048}
    }
    for attempt in range(4):
        try:
            r = requests.post(API_URL, json=payload, timeout=90)
            if r.status_code == 200:
                data = r.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text.strip()
            elif r.status_code in (429, 503):
                wait = 30 * (attempt + 1)  # 30s, 60s, 90s, 120s
                print(f"    Rate limit, esperando {wait}s...")
                time.sleep(wait)
            else:
                print(f"    Error {r.status_code}: {r.text[:300]}")
                return f"[ERROR PÁGINA {page_num}: {r.status_code}]"
        except Exception as e:
            print(f"    Excepción: {e}")
            time.sleep(10)
    return f"[TIMEOUT PÁGINA {page_num}]"

def main():
    print(f"Abriendo: {PDF_PATH}")
    doc = fitz.open(PDF_PATH)
    n = len(doc)
    print(f"Total páginas: {n}")

    all_text = []
    for i, page in enumerate(doc):
        print(f"  OCR página {i+1}/{n}...", end=" ", flush=True)
        b64 = page_to_base64(page)
        text = extract_page(b64, i+1)
        words = len(text.split())
        print(f"{words} palabras")
        all_text.append(f"--- PÁGINA {i+1} ---\n{text}")
        time.sleep(8)  # respetar rate limit: ~7 req/min en free tier

    doc.close()

    full_text = "\n\n".join(all_text)
    print(f"\nTotal texto extraído: {len(full_text)} chars")

    # Escapar para TypeScript
    escaped = full_text.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

    ts_content = f'const manual = `{escaped}`;\nexport default manual;\n'

    with open(OUT_TS, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"Guardado en: {OUT_TS}")

if __name__ == "__main__":
    main()
