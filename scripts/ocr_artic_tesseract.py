"""
OCR del manual Saeco Artic 272 usando Tesseract local.
Sin límites de API, funciona offline.
Requiere: pip install pytesseract pymupdf pillow
Y Tesseract instalado: winget install UB-Mannheim.TesseractOCR
"""
import fitz  # PyMuPDF
import sys
import os

PDF_PATH = r"C:\Users\dgbra\vendingbot\knowledge-base\machines\artic\artic-272.pdf"
OUT_TS   = r"C:\Users\dgbra\vendingbot\app\manuals\data\saeco-artic.ts"

# Ruta de Tesseract en Windows
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

try:
    import pytesseract
    from PIL import Image
    import io
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH
except ImportError:
    print("Instalando dependencias...")
    os.system("pip install pytesseract pillow --quiet")
    import pytesseract
    from PIL import Image
    import io
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

def page_to_pil(page):
    mat = fitz.Matrix(2.5, 2.5)  # alta resolución para mejor OCR
    pix = page.get_pixmap(matrix=mat)
    img_data = pix.tobytes("png")
    return Image.open(io.BytesIO(img_data))

def main():
    # Verificar Tesseract
    if not os.path.exists(TESSERACT_PATH):
        print(f"ERROR: Tesseract no encontrado en {TESSERACT_PATH}")
        print("Instala con: winget install UB-Mannheim.TesseractOCR")
        sys.exit(1)

    print(f"Tesseract encontrado: {TESSERACT_PATH}")
    print(f"Abriendo: {PDF_PATH}")

    doc = fitz.open(PDF_PATH)
    n = len(doc)
    print(f"Total páginas: {n}")

    all_text = []
    for i, page in enumerate(doc):
        print(f"  OCR página {i+1}/{n}...", end=" ", flush=True)
        img = page_to_pil(page)
        # OCR en español
        text = pytesseract.image_to_string(img, lang="spa", config="--psm 3")
        words = len(text.split())
        print(f"{words} palabras")
        if words > 5:
            all_text.append(f"--- PÁGINA {i+1} ---\n{text.strip()}")

    doc.close()

    full_text = "\n\n".join(all_text)
    print(f"\nTotal texto extraído: {len(full_text)} chars")

    if len(full_text) < 500:
        print("ADVERTENCIA: Muy poco texto extraído. El PDF puede estar en otro idioma o muy degradado.")

    escaped = full_text.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    ts_content = f'const manual = `{escaped}`;\nexport default manual;\n'

    with open(OUT_TS, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"Guardado en: {OUT_TS}")

if __name__ == "__main__":
    main()
