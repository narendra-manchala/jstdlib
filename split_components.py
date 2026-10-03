import re
import os

def extract_and_write(filename, component_names, out_dir, imports):
    with open(filename, 'r') as f:
        content = f.read()
    
    for name in component_names:
        # Match 'export function Name' to the next 'export ' or EOF
        pattern = rf'(export function {name}\b.*?)(?=\nexport |\Z)'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            code = match.group(1).strip()
            # Custom logic for imports could go here, but doing it in bash is safer.
            with open(os.path.join(out_dir, f"{name}.tsx"), 'w') as out:
                out.write(imports[name] + "\n\n" + code + "\n")

# To be safe, I'll just write them out using bash. It's much less prone to regex errors on closing braces.
