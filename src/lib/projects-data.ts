
export const projects = [
    { 
      id: 'website-redesign',
      name: 'Website Redesign', 
      description: 'Modernize the company website and improve user experience.',
      progress: 75, 
      members: [
        { name: 'Alex', avatar: 'https://picsum.photos/seed/alex/32/32' },
        { name: 'Sam', avatar: 'https://picsum.photos/seed/sam/32/32' },
        { name: 'Jordan', avatar: 'https://picsum.photos/seed/jordan/32/32' },
        { name: 'Chris', avatar: 'https://picsum.photos/seed/chris/32/32' },
        { name: 'Taylor', avatar: 'https://picsum.photos/seed/taylor/32/32' },
      ], 
    },
    { 
      id: 'mobile-app-launch',
      name: 'Mobile App Launch', 
      description: 'Launch the new mobile app for iOS and Android.',
      progress: 40, 
      members: [
        { name: 'Olivia', avatar: 'https://picsum.photos/seed/olivia/32/32' },
        { name: 'Jackson', avatar: 'https://picsum.photos/seed/jackson/32/32' },
        { name: 'Isabella', avatar: 'https://picsum.photos/seed/isabella/32/32' },
      ], 
    },
    { 
      id: 'api-integration',
      name: 'API Integration', 
      description: 'Integrate with third-party APIs for enhanced functionality.',
      progress: 90, 
      members: [
        { name: 'William', avatar: 'https://picsum.photos/seed/william/32/32' },
        { name: 'Sophia', avatar: 'https://picsum.photos/seed/sophia/32/32' },
      ], 
    },
    { 
      id: 'marketing-campaign',
      name: 'Marketing Campaign',
      description: 'Plan and execute the Q3 marketing campaign.',
      progress: 20,
      members: [
        { name: 'Emma', avatar: 'https://picsum.photos/seed/emma/32/32' },
        { name: 'Liam', avatar: 'https://picsum.photos/seed/liam/32/32' },
        { name: 'Ava', avatar: 'https://picsum.photos/seed/ava/32/32' },
        { name: 'Noah', avatar: 'https://picsum.photos/seed/noah/32/32' },
      ],
    },
  ];
  
export const tasks = {
    todo: [
      { id: 'task-1', title: 'Setup CI/CD pipeline', priority: 'High', tags: ['DevOps'], points: 8, assignee: { name: 'Alex', avatar: 'https://picsum.photos/seed/alex/32/32' } },
      { id: 'task-2', title: 'Design user profile page', priority: 'Medium', tags: ['UI/UX', 'Design'], points: 5, assignee: { name: 'Sam', avatar: 'https://picsum.photos/seed/sam/32/32' } },
      { id: 'task-3', title: 'Onboarding flow illustrations', priority: 'Low', tags: ['Design'], points: 3, assignee: { name: 'Jordan', avatar: 'https://picsum.photos/seed/jordan/32/32' } },
    ],
    'in-progress': [
      { id: 'task-4', title: 'Implement authentication flow', priority: 'High', tags: ['Backend', 'Security'], points: 8, assignee: { name: 'Chris', avatar: 'https://picsum.photos/seed/chris/32/32' } },
      { id: 'task-5', title: 'Develop dashboard components', priority: 'Medium', tags: ['Frontend', 'React'], points: 13, assignee: { name: 'Taylor', avatar: 'https://picsum.photos/seed/taylor/32/32' } },
    ],
    done: [
      { id: 'task-6', title: 'Create project wireframes', priority: 'Low', tags: ['Design', 'UX'], points: 3, assignee: { name: 'Jordan', avatar: 'https://picsum.photos/seed/jordan/32/32' } },
      { id: 'task-7', title: 'Setup project repository', priority: 'Medium', tags: ['DevOps'], points: 2, assignee: { name: 'Alex', avatar: 'https://picsum.photos/seed/alex/32/32' } },
    ],
  };
