
import React from 'react';
import SectionCard from './components/SectionCard';
import AnimatedBarChart from './components/charts/AnimatedBarChart';
import ForceDirectedGraph from './components/networks/ForceDirectedGraph';
import CollapsibleTree from './components/hierarchies/CollapsibleTree';
import PieChart from './components/charts/PieChart';
import ChoroplethMap from './components/geo/ChoroplethMap';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <header className="py-6 px-4 sm:px-6 lg:px-8 text-center sticky top-0 z-10 bg-gray-900/70 backdrop-blur-md border-b border-gray-800">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
            D3.js: The Ultimate Demo
          </span>
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">
          An extensive gallery showcasing the power and versatility of the D3.js library.
        </p>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8">
          <SectionCard
            id="animated-bar-chart"
            title="Animations & Transitions"
            description="D3 excels at declarative, data-driven animations. This bar chart uses D3's transitions to smoothly animate changes when the underlying data is updated. It showcases the general update pattern (enter, update, exit)."
          >
            <AnimatedBarChart />
          </SectionCard>

          <SectionCard
            id="force-directed-graph"
            title="Network Visualization (Force Simulation)"
            description="Visualize complex networks with D3's force simulation engine. Nodes repel each other while links act like springs, creating an organic, interactive layout. You can drag nodes around to interact with the simulation."
          >
            <ForceDirectedGraph />
          </SectionCard>

          <SectionCard
            id="choropleth-map"
            title="Geospatial Maps (Geo & TopoJSON)"
            description="D3's geo tools are incredibly powerful for creating maps. This example renders a world map from TopoJSON data, applies a Mercator projection, and uses a color scale to create a choropleth map. It's also zoomable and pannable."
          >
            <ChoroplethMap />
          </SectionCard>
          
          <SectionCard
            id="collapsible-tree"
            title="Hierarchical Data (Tree Layout)"
            description="D3's hierarchy layouts are perfect for visualizing tree-like structures, such as organization charts or file systems. This is a collapsible tree where you can click nodes to expand or collapse their children."
          >
            <CollapsibleTree />
          </SectionCard>
          
          <SectionCard
            id="pie-chart"
            title="Classic Charts (Pie/Donut Chart)"
            description="Beyond complex visualizations, D3 is great for creating standard charts. This donut chart is built using D3's pie and arc generators, with interactive tooltips on hover to display data."
          >
            <PieChart />
          </SectionCard>
        </div>
      </main>
      
      <footer className="text-center py-8 border-t border-gray-800 text-gray-500">
        <p>Built with React, TypeScript, Tailwind CSS, and the legendary D3.js.</p>
      </footer>
    </div>
  );
};

export default App;
