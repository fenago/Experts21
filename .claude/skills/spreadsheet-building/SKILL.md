---
name: spreadsheet-building
description: "Create clean, reusable spreadsheets (budgets, models, competitor sheets, site scorecards, recipe costs). Use whenever a deliverable is a table someone will update or calculate with."
---

# Spreadsheet building

1. Build `.xlsx` with Python (`openpyxl`) or write `.csv` if formatting isn't needed.
2. Layout: an **Inputs** sheet (assumptions, blue font), **Calculations**, and **Summary/Outputs**. One purpose per file.
3. Use formulas that reference input cells — no numbers typed inside formulas.
4. Label units in headers (`$/month`, `sq ft`, `%`). Freeze the header row. Format currency and percentages.
5. Add a **Sources** column or sheet for every input.
6. Save to `deliverables/<topic>/<name>-YYYY-MM-DD.xlsx` and give the path in your memo.
7. After building, reopen the file in code and check the key outputs match what you report.
