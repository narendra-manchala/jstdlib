import re
import os

with open("website/src/docs.ts", "r") as f:
    text = f.read()

types_block = text.split("export const DOCS: DocSection[] = [")[0]
rest = "export const DOCS: DocSection[] = [" + text.split("export const DOCS: DocSection[] = [")[1]

# Write types
os.makedirs("website/src/data/docs", exist_ok=True)
with open("website/src/data/types.ts", "w") as f:
    f.write(types_block)

# Since doing regex on nested JSON-like JS structures is brittle in python, 
# I will use a simple custom script or write them explicitly.
