---
name: markitdown-convert
description: >
  Convert files and documents to Markdown for LLM consumption using Microsoft MarkItDown.
  Supports PDF, Word, Excel, PowerPoint, images (OCR), audio (transcription), HTML,
  CSV, JSON, XML, YouTube URLs, EPubs, and ZIP archives. Integrates with Azure Document
  Intelligence and Azure Content Understanding for enterprise-grade extraction.
  Used by any agent that needs to reason about non-markdown documents.
version: 1.0.0
---

# MarkItDown Convert Skill

Convert any file to Markdown for LLM processing using [Microsoft MarkItDown](https://github.com/microsoft/markitdown) (127k+ stars, v0.1.6).

## Supported Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| PDF | `.pdf` | Text extraction + table preservation |
| Word | `.docx` | Headings, lists, tables, links |
| Excel | `.xlsx`, `.xls` | Sheet-per-section, table formatting |
| PowerPoint | `.pptx` | Slide-per-section, speaker notes |
| Images | `.png`, `.jpg`, `.svg` | EXIF metadata + OCR (with LLM) |
| Audio | `.wav`, `.mp3` | EXIF metadata + speech transcription |
| HTML | `.html` | Structure preservation |
| Text formats | `.csv`, `.json`, `.xml` | Auto-detected |
| ZIP archives | `.zip` | Iterates over contents |
| YouTube | URL | Transcript extraction |
| EPub | `.epub` | Chapter structure |

## Installation

```bash
# Full installation (all format support)
pip install 'markitdown[all]'

# Minimal (specific formats only)
pip install 'markitdown[pdf, docx, pptx, xlsx]'

# With Azure Document Intelligence
pip install 'markitdown[az-doc-intel]'

# With Azure Content Understanding (audio, video, structured fields)
pip install 'markitdown[az-content-understanding]'

# With OCR plugin (LLM-powered image text extraction)
pip install markitdown-ocr
```

## CLI Usage

```bash
# Single file conversion
markitdown path-to-file.pdf > output.md
markitdown report.docx -o report.md

# Pipe content
cat document.pdf | markitdown

# With Azure Document Intelligence (high-quality OCR)
markitdown scan.pdf -o output.md -d -e "<document_intelligence_endpoint>"

# With Azure Content Understanding (multimodal)
markitdown file.pdf --use-cu --cu-endpoint "<content_understanding_endpoint>"

# Batch conversion (all files in a directory)
for f in docs/*.pdf; do markitdown "$f" -o "converted/$(basename "$f" .pdf).md"; done

# List installed plugins
markitdown --list-plugins

# Enable plugins (e.g., OCR)
markitdown --use-plugins document_with_images.pdf
```

## Python API

### Basic Conversion

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("report.pdf")
print(result.text_content)
```

### With LLM-Powered Image Descriptions

```python
from markitdown import MarkItDown
from openai import OpenAI

client = OpenAI()
md = MarkItDown(
    llm_client=client,
    llm_model="gpt-4o",
    llm_prompt="Describe this image in detail, focusing on text, diagrams, and data."
)
result = md.convert("architecture-diagram.png")
print(result.text_content)
```

### With OCR Plugin (extract text from images in documents)

```python
from markitdown import MarkItDown
from openai import OpenAI

md = MarkItDown(
    enable_plugins=True,
    llm_client=client,
    llm_model="gpt-4o",
)
result = md.convert("scanned_document.pdf")
print(result.text_content)
```

### With Azure Document Intelligence

```python
from markitdown import MarkItDown

md = MarkItDown(docintel_endpoint="<document_intelligence_endpoint>")
result = md.convert("complex-table.pdf")
print(result.text_content)
```

### With Azure Content Understanding (multimodal)

```python
from markitdown import MarkItDown

# Zero-config — auto-selects analyzer per file type
md = MarkItDown(cu_endpoint="<content_understanding_endpoint>")
result = md.convert("report.pdf")     # documents → prebuilt-documentSearch
result = md.convert("meeting.mp4")    # video → prebuilt-videoSearch
result = md.convert("call.wav")       # audio → prebuilt-audioSearch
print(result.text_content)
```

### With Custom Analyzer (structured field extraction)

```python
from markitdown import MarkItDown

md = MarkItDown(
    cu_endpoint="<content_understanding_endpoint>",
    cu_analyzer_id="my-invoice-analyzer",
)
result = md.convert("invoice.pdf")
# Output includes YAML front matter with extracted fields:
# ---
# contentType: document
# fields:
#   VendorName: CONTOSO LTD.
#   InvoiceDate: '2019-11-15'
# ---
```

### Restrict CU to Specific File Types (cost control)

```python
from markitdown import MarkItDown
from markitdown.converters import ContentUnderstandingFileType

md = MarkItDown(
    cu_endpoint="<content_understanding_endpoint>",
    cu_file_types=[ContentUnderstandingFileType.PDF],  # only PDFs use CU
)
```

## Batch Conversion Patterns

### Convert Entire Documentation Folder

```python
from pathlib import Path
from markitdown import MarkItDown

md = MarkItDown()
docs_dir = Path("./legacy-docs")
output_dir = Path("./markdown-docs")
output_dir.mkdir(exist_ok=True)

for file in docs_dir.glob("**/*"):
    if file.suffix.lower() in ['.pdf', '.docx', '.pptx', '.xlsx', '.html']:
        try:
            result = md.convert(str(file))
            out_path = output_dir / file.relative_to(docs_dir).with_suffix('.md')
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(result.text_content)
            print(f"✅ {file.name} → {out_path}")
        except Exception as e:
            print(f"❌ {file.name}: {e}")
```

### Convert and Feed to Agent Context

```python
from markitdown import MarkItDown

md = MarkItDown()

def load_requirement_docs(file_paths: list[str]) -> str:
    """Convert requirement docs to markdown for agent context."""
    context_parts = []
    for path in file_paths:
        result = md.convert(path)
        context_parts.append(f"## Source: {path}\n\n{result.text_content}")
    return "\n\n---\n\n".join(context_parts)
```

## Security Considerations

| Risk | Mitigation |
|------|-----------|
| Path traversal | Use `convert_local()` for local-only access — never pass untrusted paths to `convert()` |
| Remote fetching | Use `convert_stream()` with pre-validated streams — don't let untrusted input reach `convert()` |
| Privilege escalation | MarkItDown runs with process privileges — sandbox in containers for untrusted content |
| Resource exhaustion | Set file size limits before conversion; large PDFs/videos can consume significant memory |
| Secrets in documents | Converted output may contain sensitive data — treat markdown output with same classification as source |

## Integration with Our Agents

| Agent | Use Case |
|-------|----------|
| `@planner` | Convert requirement PDFs/specs → markdown context for planning |
| `@reviewer` | Convert architecture docs → reference for review validation |
| `@docs-writer` | Ingest existing documentation before creating/updating |
| `@product-manual` | Extract content from legacy manuals for migration |
| `@k8s-deployer` | Parse architecture diagrams and deployment specs |
| `@azure-deployer` | Convert infrastructure documentation and runbooks |
| `@foundry-agent` | Extract agent instructions from existing documents |
| `@security-review` | Convert compliance/regulatory PDFs for security validation |

## Docker Usage

```bash
# Build
docker build -t markitdown:latest .

# Convert via stdin/stdout
docker run --rm -i markitdown:latest < input.pdf > output.md

# Mount volume for batch conversion
docker run --rm -v $(pwd)/docs:/data markitdown:latest /data/report.pdf -o /data/report.md
```
