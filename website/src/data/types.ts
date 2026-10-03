export interface MethodParam {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
}

export interface MethodDoc {
  signature: string;
  description: string;
  params?: MethodParam[];
  returns?: { type: string; description: string };
  timeComplexity: string;
  spaceComplexity?: string;
  example: string;
}

export interface DocItem {
  id: string;
  label: string;
  description: string;
  importPath: string;
  since: string;
  methods: Record<string, MethodDoc>;
}

export interface DocSection {
  section: string;
  items: DocItem[];
}

