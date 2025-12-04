
export const repositories = [
  {
    id: 'thoughtmaps-ui',
    name: 'thoughtmaps-ui',
    description: 'The main UI for the Thoughtmaps application.',
    visibility: 'private',
    tech: ['TypeScript', 'React', 'Next.js', 'TailwindCSS'],
    stars: 120,
    forks: 15,
    lastUpdated: '2 hours ago',
  },
  {
    id: 'genkit-integrations',
    name: 'genkit-integrations',
    description: 'Integrations for the Genkit AI framework.',
    visibility: 'public',
    tech: ['TypeScript', 'Node.js'],
    stars: 580,
    forks: 98,
    lastUpdated: '1 day ago',
  },
  {
    id: 'rust-microservice-template',
    name: 'rust-microservice-template',
    description: 'A template for building high-performance microservices in Rust.',
    visibility: 'public',
    tech: ['Rust', 'Docker'],
    stars: 890,
    forks: 150,
    lastUpdated: '3 days ago',
  },
  {
    id: 'design-system',
    name: 'design-system',
    description: 'Shared component library for all company projects.',
    visibility: 'private',
    tech: ['React', 'Storybook', 'CSS-in-JS'],
    stars: 45,
    forks: 5,
    lastUpdated: '5 days ago',
  },
  {
    id: 'legacy-api',
    name: 'legacy-api',
    description: 'The old monolithic API. In process of being deprecated.',
    visibility: 'private',
    tech: ['JavaScript', 'Express'],
    stars: 10,
    forks: 1,
    lastUpdated: '2 weeks ago',
  },
    {
    id: 'mobile-app',
    name: 'mobile-app',
    description: 'The native mobile application for iOS and Android.',
    visibility: 'private',
    tech: ['React Native', 'TypeScript'],
    stars: 33,
    forks: 8,
    lastUpdated: '1 hour ago',
  },
];

export const files = [
    { name: '.gitignore', type: 'file', commit: 'Initial commit', age: '2 months ago' },
    { name: 'package.json', type: 'file', commit: 'feat: Add analytics', age: '1 day ago' },
    { name: 'README.md', type: 'file', commit: 'docs: Update setup instructions', age: '3 hours ago' },
    { name: 'src', type: 'folder', commit: 'refactor: Move to app router', age: '2 weeks ago' },
    { name: 'public', type: 'folder', commit: 'Initial commit', age: '2 months ago' },
    { name: 'next.config.ts', type: 'file', commit: 'feat: Enable image optimization', age: '1 month ago' },
];

export const fileTree = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'app',
        type: 'folder',
        children: [
          { name: 'layout.tsx', type: 'file' },
          { name: 'page.tsx', type: 'file' },
          {
            name: 'api',
            type: 'folder',
            children: [{ name: 'route.ts', type: 'file' }],
          },
        ],
      },
      {
        name: 'components',
        type: 'folder',
        children: [
          {
            name: 'ui',
            type: 'folder',
            children: [{ name: 'button.tsx', type: 'file' }],
          },
        ],
      },
      {
        name: 'lib',
        type: 'folder',
        children: [{ name: 'utils.ts', type: 'file' }],
      },
    ],
  },
  { name: '.gitignore', type: 'file' },
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' },
];
