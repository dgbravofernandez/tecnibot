"""
Renderiza cada página de cada manual PDF a una imagen JPG comprimida.
Se usan para que el bot pueda "enseñar" la figura/página exacta que menciona.
Salida: app/public/manuals-images/{manualId}/{page}.jpg
"""
import fitz  # PyMuPDF
import os

BASE = r"C:\Users\dgbra\vendingbot\knowledge-base\machines"
OUT_BASE = r"C:\Users\dgbra\vendingbot\app\public\manuals-images"

MANUALS = {
    "saeco-cristallo":     "saeco/cristallo-400-600-evo.pdf",
    "saeco-dap":           "saeco/Dap 8.pdf",
    "saeco-atlante":       "saeco/Atlante.pdf",
    "saeco-diamante":      "saeco/Diamante Combi.pdf",
    "saeco-breakpoint":    "saeco/break-point-36-56.pdf",
    "rubino":              "rubino/rubino-manual.pdf",
    "azkoyen-palma-prog":  "azkoyen/palma-h-programacion.pdf",
    "fas-everest":         "fas/everest-panzer.pdf",
    "fas-1050":            "fas/fast-900-1050.pdf",
    "jofemar-vision":      "jofemar/vision-snack-plus.pdf",
}

def render_manual(manual_id: str, pdf_rel_path: str):
    pdf_path = os.path.join(BASE, pdf_rel_path)
    out_dir = os.path.join(OUT_BASE, manual_id)
    os.makedirs(out_dir, exist_ok=True)

    doc = fitz.open(pdf_path)
    print(f"{manual_id}: {len(doc)} páginas -> {out_dir}")

    for i, page in enumerate(doc):
        page_num = i + 1
        out_path = os.path.join(out_dir, f"{page_num}.jpg")
        if os.path.exists(out_path):
            continue
        mat = fitz.Matrix(1.6, 1.6)  # resolución moderada
        pix = page.get_pixmap(matrix=mat)
        pix.save(out_path, jpg_quality=65)

    doc.close()

def main():
    os.makedirs(OUT_BASE, exist_ok=True)
    total = 0
    for manual_id, pdf_rel in MANUALS.items():
        render_manual(manual_id, pdf_rel)
        total += 1
    print(f"\nCompletado: {total} manuales procesados.")

if __name__ == "__main__":
    main()
