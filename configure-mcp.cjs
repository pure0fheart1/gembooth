const fs = require('fs');
const path = require('path');

// Path to .claude.json
const configPath = path.join(require('os').homedir(), '.claude.json');

// Read existing config
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Ensure mcpServers exists
if (!config.projects) config.projects = {};
if (!config.projects['C:\\Users\\jamie']) config.projects['C:\\Users\\jamie'] = {};
if (!config.projects['C:\\Users\\jamie'].mcpServers) config.projects['C:\\Users\\jamie'].mcpServers = {};

const mcpServers = config.projects['C:\\Users\\jamie'].mcpServers;

// Configure Supabase MCP
mcpServers.supabase = {
  type: "stdio",
  command: "npx",
  args: ["-y", "@supabase/mcp-server-supabase"],
  env: {
    SUPABASE_URL: "https://cahdabrkluflhlwexqsc.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhaGRhYnJrbHVmbGhsd2V4cXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTc5MDAsImV4cCI6MjA3NTMzMzkwMH0.4wAyToQXwPy8vWMmlYyuImL2yZ0exwaUzGuQr8bxFGI"
  }
};

// Configure Stripe MCP
mcpServers.stripe = {
  type: "stdio",
  command: "npx",
  args: ["-y", "@stripe/mcp"],
  env: {
    STRIPE_API_KEY: "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"
  }
};

// Write back to file
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log('✅ MCP servers configured successfully!');
console.log('Configured:');
console.log('  - Supabase MCP');
console.log('  - Stripe MCP');
