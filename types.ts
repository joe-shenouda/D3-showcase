
export interface Dimension {
  width: number;
  height: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
}

export interface BarData {
  name: string;
  value: number;
}

export interface LineData {
  date: Date;
  value: number;
}

export interface ScatterData {
  x: number;
  y: number;
}

export interface PieData {
  name: string;
  value: number;
}

export interface Node {
  id: string;
  group: number;
}

export interface Link {
  source: string;
  target: string;
  value: number;
}

export interface NetworkData {
  nodes: Node[];
  links: Link[];
}

export interface HierarchyData {
  name: string;
  children?: HierarchyData[];
  value?: number;
}
