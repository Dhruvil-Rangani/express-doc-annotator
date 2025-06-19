# backend/api/utils.py
import pypdf
import docx

def extract_text_from_file(file_path):
    """Extracts text from pdf, docx, or txt files."""
    print(f"Extracting text from: {file_path}")
    if file_path.endswith(".pdf"):
        with open(file_path, 'rb') as f:
            reader = pypdf.PdfReader(f)
            text = "".join(page.extract_text() for page in reader.pages)
        return text
    elif file_path.endswith(".docx"):
        doc = docx.Document(file_path)
        text = "\n".join(para.text for para in doc.paragraphs)
        return text
    elif file_path.endswith(".txt"):
        with open(file_path, 'r') as f:
            text = f.read()
        return text
    else:
        print("Unsupported file type for text extraction.")
        return None
