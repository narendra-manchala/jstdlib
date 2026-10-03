import os
import re

with open('website/src/App.tsx', 'r') as f:
    content = f.read()

def get_section(name):
    # Matches from the section header to the next section header (or end of file)
    pattern = r'// ─+\n// ' + name + r'.*?\n// ─+\n(.*?)(?=\n// ─+\n// |\Z)'
    match = re.search(pattern, content, re.DOTALL)
    return match.group(1).strip() if match else ''

hooks = get_section('HOOKS')
primitives = get_section('PRIMITIVE COMPONENTS')
params_table = get_section('PARAMS TABLE')
method_block = get_section('METHOD BLOCK')
playgrounds = get_section('PLAYGROUNDS')
playground_registry = get_section('PLAYGROUND REGISTRY')
try_it = get_section('TRY IT PANEL')
scroll_top = get_section('SCROLL TO TOP BUTTON')
doc_page = get_section('DOC PAGE')
sidebar = get_section('SIDEBAR CONTENTS')
nav_item = get_section('NAV ITEM')
app_root = get_section('APP ROOT')

os.makedirs('website/src/components', exist_ok=True)

with open('website/src/hooks.ts', 'w') as f:
    f.write("import { useState, useEffect, useRef } from 'react';\n\n" + hooks)

with open('website/src/components/ui.tsx', 'w') as f:
    f.write("import React, { useState, useEffect } from 'react';\n")
    f.write("import { Copy, Check, ArrowRight } from 'lucide-react';\n\n")
    f.write(primitives + "\n\n" + scroll_top)

with open('website/src/components/Playgrounds.tsx', 'w') as f:
    f.write("import React, { useState, useRef } from 'react';\n")
    f.write("import { ArrowRight, Terminal } from 'lucide-react';\n")
    f.write("import { Deque, PriorityQueue } from '../../../src/ds';\n")
    f.write("import { Badge, CodeBlock, Divider } from './ui';\n\n")
    f.write(playgrounds + "\n\n" + playground_registry + "\n\n" + try_it)

with open('website/src/components/Docs.tsx', 'w') as f:
    f.write("import React, { useEffect } from 'react';\n")
    f.write("import { DocItem, MethodDoc } from '../docs';\n")
    f.write("import { Badge, CodeBlock, Label, Divider } from './ui';\n")
    f.write("import { TryItPanel, PLAYGROUNDS } from './Playgrounds';\n\n")
    f.write(params_table + "\n\n" + method_block + "\n\n" + doc_page)

with open('website/src/components/Sidebar.tsx', 'w') as f:
    f.write("import React, { useState } from 'react';\n")
    f.write("import { Moon, Sun, Search, ChevronDown, ChevronRight } from 'lucide-react';\n")
    f.write("import { DOCS } from '../docs';\n")
    f.write("import { GitHubIcon } from '../App'; // We will export it from App or fix this later\n\n")
    f.write(nav_item + "\n\n" + sidebar)

with open('website/src/App.tsx', 'w') as f:
    f.write("import React, { useState, useEffect } from 'react';\n")
    f.write("import { Moon, Sun, Menu, X } from 'lucide-react';\n")
    f.write("import { DOCS } from './docs';\n")
    f.write("import { useTheme, useHash } from './hooks';\n")
    f.write("import { SidebarContents } from './components/Sidebar';\n")
    f.write("import { DocPage } from './components/Docs';\n")
    f.write("import { ScrollToTopButton } from './components/ui';\n")
    f.write("import { TryItPanel, PLAYGROUNDS } from './components/Playgrounds';\n\n")
    f.write(app_root)

print("Split completed.")
