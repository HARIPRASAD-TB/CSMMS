"""
Generate the complete MCA Major Project Report (.docx) for the
"Construction Service & Material Management System" project.

Bharathiar University CDOE compliance:
  - A4 page, double line spacing, Times New Roman 12 (chapter headings 16)
  - Left margin 1.5" (column 10), right margin 1.0" (column 65)
  - Page numbers printed top-right inside every page:
      preliminary pages  -> lowercase Roman (i, ii, iii, ...)
      Chapter 1 onwards  -> Arabic (1, 2, 3, ...) restarting at 1
  - Order: e-Wrapper, Copy of wrapper, Declaration (Annexure-I),
    Certificate (Annexure-II), Certificate from organization,
    Letter to the Guide, Acknowledgement, Synopsis,
    Table of Contents (Annexure-III), Chapters, Bibliography (alphabetical)
  - Full chapter text, tables, diagrams, and application screenshots are
    rendered from MCA_PROJECT_REPORT.md

Usage:  python generate_report.py
Output: CSMMS_MCA_Project_Report.docx
"""

import re
from pathlib import Path

try:
    from docx import Document
    from docx.shared import Pt, Inches, Cm
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.enum.section import WD_SECTION_START
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
except ImportError:
    print("Install dependency: python -m pip install --user python-docx")
    raise

HERE = Path(__file__).parent
SOURCE_MD = HERE / "MCA_PROJECT_REPORT.md"
OUTPUT = HERE / "CSMMS_MCA_Project_Report.docx"

TITLE = "CONSTRUCTION SERVICE & MATERIAL MANAGEMENT SYSTEM"
CANDIDATE = "HARIPRASAD T B"
ENROL = "232MCAN0168"
REG = "23MCA5168"
GUIDE = "DR. S. MEERA"
GUIDE_TITLE = "Associate Professor & Head (I/c)"
DEPT = "Department of Computer Science (AI)"
MONTH_YEAR = "June 2026"

TEXT_WIDTH = Inches(5.7)  # A4 minus 1.5" + 1.0" margins


# ------------------------------------------------------------- page setup

def setup_section(section):
    """A4, left margin col 10 (1.5"), right margin col 65 (1.0")."""
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.left_margin = Inches(1.5)
    section.right_margin = Inches(1.0)
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)


def add_page_border(section):
    """Single-line black border on all four sides of every page."""
    sect_pr = section._sectPr
    borders = sect_pr.find(qn("w:pgBorders"))
    if borders is None:
        borders = OxmlElement("w:pgBorders")
        sect_pr.append(borders)
    borders.set(qn("w:offsetFrom"), "page")
    for el in list(borders):
        borders.remove(el)
    for side in ("top", "left", "bottom", "right"):
        el = OxmlElement(f"w:{side}")
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), "12")        # 1.5 pt
        el.set(qn("w:space"), "24")     # 24 pt in from page edge
        el.set(qn("w:color"), "000000")
        borders.append(el)


def set_page_number_format(section, fmt, start=None):
    sect_pr = section._sectPr
    pg = sect_pr.find(qn("w:pgNumType"))
    if pg is None:
        pg = OxmlElement("w:pgNumType")
        sect_pr.append(pg)
    pg.set(qn("w:fmt"), fmt)
    if start is not None:
        pg.set(qn("w:start"), str(start))


def add_page_number_header(section):
    """PAGE field, top-right corner of every page."""
    header = section.header
    header.is_linked_to_previous = False
    p = header.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = p.add_run()
    f1 = OxmlElement("w:fldChar")
    f1.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = "PAGE"
    f2 = OxmlElement("w:fldChar")
    f2.set(qn("w:fldCharType"), "end")
    run._r.append(f1)
    run._r.append(instr)
    run._r.append(f2)
    run.font.name = "Times New Roman"
    run.font.size = Pt(12)


# ------------------------------------------------------------- text helpers

def _style_run(run, size, bold, font="Times New Roman"):
    run.font.name = font
    run.font.size = Pt(size)
    run.bold = bold


def para(doc, text, size=12, bold=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY,
         spacing=2.0, space_after=0, font="Times New Roman"):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.line_spacing = spacing
    p.paragraph_format.space_after = Pt(space_after)
    run = p.add_run(text)
    _style_run(run, size, bold, font)
    return p


def centered(doc, text, size=12, bold=False, spacing=1.5, space_after=6):
    return para(doc, text, size=size, bold=bold,
                align=WD_ALIGN_PARAGRAPH.CENTER, spacing=spacing,
                space_after=space_after)


def chapter_heading(doc, text, page_break_before=False):
    p = para(doc, text, size=16, bold=True,
             align=WD_ALIGN_PARAGRAPH.CENTER, spacing=1.5, space_after=12)
    if page_break_before:
        # unlike a hard page break, this never produces an empty page
        p.paragraph_format.page_break_before = True
    return p


def section_heading(doc, text):
    return para(doc, text, size=12, bold=True,
                align=WD_ALIGN_PARAGRAPH.LEFT, spacing=1.5, space_after=6)


def code_block(doc, lines):
    """Diagram / code lines kept together on a single page (with caption)."""
    for line in lines:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.keep_together = True
        p.paragraph_format.keep_with_next = True
        run = p.add_run(line)
        _style_run(run, 8, False, font="Courier New")


def md_table(doc, rows):
    """rows: list of lists (first row = header)."""
    if not rows:
        return
    cols = max(len(r) for r in rows)
    table = doc.add_table(rows=len(rows), cols=cols)
    table.style = "Table Grid"
    table.alignment = 1  # center
    for i, row in enumerate(rows):
        for j in range(cols):
            cell = table.cell(i, j)
            text = row[j] if j < len(row) else ""
            cell.text = ""
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.0
            run = p.add_run(text)
            _style_run(run, 10, i == 0)
    doc.add_paragraph().paragraph_format.space_after = Pt(0)


def figure_image(doc, img_path):
    if not img_path.exists():
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True  # keep image with its caption
    p.add_run().add_picture(str(img_path), width=TEXT_WIDTH)


def clean_inline(text):
    text = text.replace("**", "").replace("`", "")
    text = re.sub(r"\*\((.*?)\)\*", r"(\1)", text)  # *(note)* -> (note)
    text = text.replace("<br>", "").strip()
    return text


# ------------------------------------------------------------- preliminaries

def wrapper_page(doc):
    centered(doc, TITLE, size=16, bold=True, space_after=18)
    centered(doc,
             "Project Report submitted to Bharathiar University in partial "
             "fulfillment of the requirement for the award of the Degree of "
             "Master of Computer Applications", space_after=18)
    centered(doc, CANDIDATE, size=14, bold=True)
    centered(doc, f"Enrolment No.: {ENROL}")
    centered(doc, f"Reg. No.: {REG}", space_after=18)
    centered(doc, "Under the guidance of", space_after=10)
    centered(doc, GUIDE, size=14, bold=True)
    centered(doc, GUIDE_TITLE, space_after=18)
    centered(doc, "Centre for Distance and Online Education")
    centered(doc, "Bharathiar University")
    centered(doc, "Coimbatore 641 046", space_after=12)
    centered(doc, MONTH_YEAR)


def declaration_page(doc):
    chapter_heading(doc, "DECLARATION")
    para(doc,
         f'I hereby declare that this project work titled "{TITLE}" '
         "submitted to the Centre for Distance and Online Education, "
         "Bharathiar University is a record of original work done by "
         f"{CANDIDATE} under the supervision and guidance of Dr. S. Meera, "
         f"{GUIDE_TITLE}, {DEPT} and that this project work has not formed "
         "the basis for the award of any Degree / Diploma / Associateship / "
         "Fellowship or similar title to any candidate of any University.")
    para(doc, "")
    para(doc, "Signature of the Candidate", spacing=1.5)
    para(doc, f"Name : {CANDIDATE}", spacing=1.5)
    para(doc, f"Enrolment No. : {ENROL}", spacing=1.5)
    para(doc, f"Register No. : {REG}", spacing=1.5)
    para(doc, "Course : Master of Computer Applications (MCA)", spacing=1.5)
    para(doc, "Place : _______________", spacing=1.5)
    para(doc, "Date : _______________", spacing=1.5)
    para(doc, "")
    para(doc, "Countersigned by", spacing=1.5)
    para(doc,
         "Signature of the Guide (With Seal)          "
         "Countersigned by the Co-ordinator (With Seal)", spacing=1.5)


def certificate_page(doc):
    chapter_heading(doc, "CERTIFICATE")
    para(doc,
         f'This is to certify that the Major Project work titled "{TITLE}" '
         "submitted to Bharathiar University in partial fulfillment of the "
         "requirements for the award of the Degree of Master of Computer "
         f"Applications is a record of the original work done by {CANDIDATE} "
         "under my supervision and guidance and that this project work has "
         "not formed the basis for the award of any Degree / Diploma / "
         "Associateship / Fellowship or similar title to any candidate of "
         "any University.")
    para(doc, "")
    para(doc, "Signature of the Guide (with Seal)", spacing=1.5)
    para(doc, f"Dr. S. Meera, {GUIDE_TITLE}, {DEPT}", spacing=1.5)
    para(doc, "")
    para(doc, "Programme Co-ordinator (with Seal)", spacing=1.5)
    para(doc, "")
    para(doc, "Forwarded by", spacing=1.5)
    para(doc, "Director", spacing=1.5)
    para(doc, "Centre for Distance and Online Education", spacing=1.5)
    para(doc, "Bharathiar University, Coimbatore - 46", spacing=1.5)


def organization_certificate_page(doc):
    chapter_heading(doc, "CERTIFICATE FROM THE ORGANIZATION")
    para(doc,
         f"This is to certify that Mr. {CANDIDATE}, Enrolment No. {ENROL}, "
         f"Reg. No. {REG}, student of Master of Computer Applications, "
         "Centre for Distance and Online Education, Bharathiar University, "
         "has successfully carried out the Major Project work titled "
         f'"{TITLE}" as an individual academic project during the period '
         "of six weeks allotted for the Major Project.")
    para(doc, "")
    para(doc,
         "Name of the Organization : Department of Computer Science (AI), "
         "Centre for Distance and Online Education, Bharathiar University",
         spacing=1.5)
    para(doc,
         "Address : Bharathiar University, Coimbatore - 641 046, "
         "Tamil Nadu, India", spacing=1.5)
    para(doc, "")
    para(doc, "Signature of the Head of the Department (with Seal)",
         spacing=1.5)
    para(doc, f"Dr. S. Meera, {GUIDE_TITLE}, {DEPT}", spacing=1.5)
    para(doc, "Date : _______________", spacing=1.5)


def acknowledgement_page(doc):
    chapter_heading(doc, "ACKNOWLEDGEMENT")
    para(doc,
         "The candidate expresses sincere gratitude to Dr. S. Meera, "
         f"{GUIDE_TITLE}, {DEPT}, for her valuable guidance, continuous "
         "support, and encouragement throughout the completion of this "
         "Major Project work.")
    para(doc,
         "The candidate is thankful to the Director and the Programme "
         "Co-ordinator, Centre for Distance and Online Education, "
         "Bharathiar University, for providing the opportunity to undertake "
         "this project as part of the Master of Computer Applications "
         "programme during the academic years 2023-2025.")
    para(doc,
         f"The candidate also extends thanks to the faculty members of the "
         f"{DEPT} for their academic support, and to family and friends for "
         "their motivation during the course of this work.")
    para(doc, "")
    para(doc, CANDIDATE, bold=True, align=WD_ALIGN_PARAGRAPH.RIGHT,
         spacing=1.5)


def synopsis_page(doc):
    chapter_heading(doc, "SYNOPSIS")
    paragraphs = [
        "The construction industry in India has traditionally depended upon "
        "informal networks, local referrals, and physical visits to "
        "suppliers for hiring skilled labour, booking contractors, and "
        "procuring building materials.  This conventional approach has "
        "resulted in lack of transparency in pricing, difficulty in "
        "verifying service quality, fragmented communication between "
        "stakeholders, and absence of a unified digital record for bookings "
        "and purchases.",
        "The Construction Service & Material Management System has been "
        "developed as a full-stack web application to address the above "
        "challenges.  The system has been designed to connect customers "
        "with skilled workers, verified contractors, and material vendors "
        "through a unified online platform.  The application supports five "
        "distinct user roles, namely Customer, Worker, Contractor, Vendor, "
        "and Administrator, each of which has been provided with "
        "role-specific dashboards and permissions.  Customers have been "
        "enabled to browse and hire workers, book contractors, purchase "
        "construction materials, manage a shopping cart, track orders and "
        "bookings, and submit reviews.",
        "The frontend of the application has been implemented using Next.js "
        "16 and React 19 with Tailwind CSS 4 for responsive user interface "
        "design.  The backend has been built using Next.js API Routes "
        "following RESTful architecture principles.  MongoDB has been used "
        "as the database management system with Mongoose as the object data "
        "modelling layer.  Authentication and session management have been "
        "implemented using JSON Web Tokens stored in secure HTTP-only "
        "cookies, and passwords have been hashed using bcrypt.",
        "The project has been analysed through problem identification, "
        "feasibility study, system design using Data Flow Diagrams and "
        "Entity Relationship Diagrams, modular implementation, and "
        "comprehensive testing at unit, integration, and user acceptance "
        "levels.  The system has been found to fulfil the stated objectives "
        "and has demonstrated how a unified digital marketplace can improve "
        "accessibility, transparency, and operational efficiency in the "
        "construction services sector.",
    ]
    for text in paragraphs:
        para(doc, text)
    para(doc,
         "Keywords: Construction Marketplace, Next.js, MongoDB, JWT "
         "Authentication, Role-Based Access Control, E-Commerce, Service "
         "Booking.", spacing=1.5, bold=True)


def to_roman(n):
    vals = [(10, "x"), (9, "ix"), (5, "v"), (4, "iv"), (1, "i")]
    out = ""
    for v, sym in vals:
        while n >= v:
            out += sym
            n -= v
    return out


def load_page_map():
    """Read measured page numbers produced by measure_pages.ps1 (Word COM).

    Workflow: 1) python generate_report.py   (placeholder TOC numbers)
              2) powershell -File measure_pages.ps1   -> headings.txt
              3) python generate_report.py   (TOC now uses measured numbers)
    """
    f = HERE / "headings.txt"
    if not f.exists():
        return {}
    mapping = {}
    for line in f.read_text(encoding="utf-8-sig").splitlines():
        if "\t" not in line:
            continue
        pg, txt = line.split("\t", 1)
        txt = txt.strip().strip("\x07").strip()
        if pg.strip().isdigit():
            mapping[txt] = int(pg.strip())  # last occurrence wins
    return mapping


def table_of_contents_page(doc):
    chapter_heading(doc, "CONTENTS")
    rows = [
        ["Chapter", "Title", "Page No."],
        ["", "Acknowledgement", "(i)"],
        ["", "Synopsis", "(ii)"],
        ["1", "INTRODUCTION", "1"],
        ["1.1", "System Overview", "2"],
        ["1.2", "Organization Profile", "3"],
        ["2", "SYSTEM STUDY AND ANALYSIS", "4"],
        ["2.1", "Problem Statement", "5"],
        ["2.2", "Existing System", "6"],
        ["2.2.1", "Drawbacks", "7"],
        ["2.3", "Proposed System", "8"],
        ["2.3.1", "Advantage", "9"],
        ["2.4", "Feasibility Analysis", "10"],
        ["2.4.1", "Technical Feasibility", "11"],
        ["2.4.2", "Economic Feasibility", "12"],
        ["2.4.3", "Operational Feasibility", "13"],
        ["2.4.4", "Cost Estimation and Scheduling", "14"],
        ["3", "DEVELOPMENT ENVIRONMENT", "15"],
        ["3.1", "Hardware Requirement", "16"],
        ["3.2", "Software Requirement", "17"],
        ["3.3", "Programming Environment", "18"],
        ["3.3.1", "About Next.js", "19"],
        ["3.3.2", "About MongoDB", "20"],
        ["4", "SYSTEM DESIGN AND DEVELOPMENT", "21"],
        ["4.1", "Element of Design", "22"],
        ["4.1.1", "Process Design", "23"],
        ["4.1.2", "Concept Design", "24"],
        ["4.1.3", "Logical Design", "25"],
        ["4.1.4", "Physical Design", "26"],
        ["4.1.5", "Input Design", "27"],
        ["4.1.6", "Output Design", "28"],
        ["4.1.7", "Database Design", "29"],
        ["4.2", "Table Structure", "30"],
        ["5", "SYSTEM TESTING AND IMPLEMENTATION", "31"],
        ["5.1", "System Testing", "32"],
        ["5.1.1", "Unit Testing", "33"],
        ["5.1.2", "Integration Testing", "34"],
        ["5.1.3", "User Acceptance Testing", "35"],
        ["5.1.4", "Output Testing", "36"],
        ["5.1.5", "Validation Testing", "37"],
        ["5.2", "System Security", "38"],
        ["5.3", "System Enhancement", "39"],
        ["6", "CONCLUSION AND FURTHER ENHANCEMENT", "40"],
        ["6.1", "Conclusion", "41"],
        ["6.2", "Further Enhancement", "42"],
        ["7", "BIBLIOGRAPHY & REFERENCES", "43"],
    ]
    page_map = load_page_map()
    if page_map:
        for row in rows[1:]:
            num, title = row[0], row[1]
            if not num:
                key = title.upper()
                if key in page_map:
                    row[2] = f"({to_roman(page_map[key])})"
                continue
            if "." not in num:
                key = f"CHAPTER {num}"
                if key in page_map:
                    row[2] = str(page_map[key])
                continue
            for key, pg in page_map.items():
                if key.startswith(num + " "):
                    row[2] = str(pg)
                    break
    md_table(doc, rows)
    if not page_map:
        para(doc,
             "(Page numbers are indicative and should be updated after "
             "final pagination in Microsoft Word.)", spacing=1.0, size=10)


# ------------------------------------------------------------- md chapters

def render_chapters(doc):
    """Parse MCA_PROJECT_REPORT.md from CHAPTER 1 onward into the document."""
    text = SOURCE_MD.read_text(encoding="utf-8")
    idx = text.find("# CHAPTER 1")
    body = text[idx:]
    lines = body.split("\n")

    in_code = False
    code_lines = []
    table_rows = []

    def flush_table():
        nonlocal table_rows
        if table_rows:
            md_table(doc, table_rows)
            table_rows = []

    i = 0
    while i < len(lines):
        raw = lines[i]
        line = raw.rstrip()

        if line.strip().startswith("```"):
            flush_table()
            if in_code:
                code_block(doc, code_lines)
                code_lines = []
            in_code = not in_code
            i += 1
            continue
        if in_code:
            code_lines.append(raw)
            i += 1
            continue

        if line.strip().startswith("|"):
            cells = [clean_inline(c) for c in line.strip().strip("|").split("|")]
            if not all(re.fullmatch(r"[-: ]*", c) for c in cells):
                table_rows.append(cells)
            i += 1
            continue
        flush_table()

        stripped = line.strip()
        if not stripped or stripped == "---" or stripped.startswith("<br"):
            i += 1
            continue
        if stripped == "\\newpage":
            i += 1  # chapter headings handle their own page breaks
            continue

        if stripped.startswith("# "):
            heading = clean_inline(stripped[2:])
            chapter_heading(doc, heading,
                            page_break_before=heading.startswith("CHAPTER"))
            i += 1
            continue
        if stripped.startswith("## ") or stripped.startswith("### "):
            section_heading(doc, clean_inline(stripped.lstrip("# ")))
            i += 1
            continue

        if stripped.startswith("!["):
            m = re.search(r"\((.*?)\)", stripped)
            if m:
                figure_image(doc, HERE / m.group(1))
            i += 1
            continue

        if stripped.startswith("**Table") or stripped.startswith("**Fig"):
            centered(doc, clean_inline(stripped), bold=True, spacing=1.5,
                     space_after=10)
            i += 1
            continue

        para(doc, clean_inline(stripped))
        i += 1

    flush_table()
    if in_code and code_lines:
        code_block(doc, code_lines)


# ------------------------------------------------------------------- main

def main():
    doc = Document()

    # ---- Section 1: preliminary pages, lowercase Roman page numbers
    sec1 = doc.sections[0]
    setup_section(sec1)
    add_page_border(sec1)
    set_page_number_format(sec1, "lowerRoman", start=1)
    add_page_number_header(sec1)

    wrapper_page(doc)                       # 1. e-Wrapper
    doc.add_page_break()
    wrapper_page(doc)                       # 2. Copy of the wrapper
    doc.add_page_break()
    declaration_page(doc)                   # 3. Declaration (Annexure-I)
    doc.add_page_break()
    certificate_page(doc)                   # 4. Certificate (Annexure-II)
    doc.add_page_break()
    organization_certificate_page(doc)      # 5. Certificate from organization
    doc.add_page_break()
    acknowledgement_page(doc)               # 6. Acknowledgement
    doc.add_page_break()
    synopsis_page(doc)                      # 7. Synopsis
    doc.add_page_break()
    table_of_contents_page(doc)             # 8. Table of contents (Annexure-III)

    # ---- Section 2: chapters, Arabic page numbers restarting at 1
    sec2 = doc.add_section(WD_SECTION_START.NEW_PAGE)
    setup_section(sec2)
    add_page_border(sec2)
    set_page_number_format(sec2, "decimal", start=1)
    add_page_number_header(sec2)

    render_chapters(doc)                    # 9. Chapters + 10. Bibliography

    doc.save(OUTPUT)
    print(f"Created: {OUTPUT}")
    print("Sections: preliminary (i, ii, ...) + main text (1, 2, ...)")
    print("Remaining manual steps: signatures/seals, Fig 4.9 admin screenshot,")
    print("update TOC page numbers after final pagination, export to PDF.")


if __name__ == "__main__":
    main()
