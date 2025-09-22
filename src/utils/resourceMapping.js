// Resource mapping by interview type
export const resourcesByInterviewType = {
  behavioral: [
    {
      title: 'STAR Method for Behavioral Interviews',
      url: 'https://www.thebalancecareers.com/what-is-the-star-interview-response-technique-2061629',
      type: 'article'
    },
    {
      title: 'Top 30 Behavioral Interview Questions',
      url: 'https://www.indeed.com/career-advice/interviewing/most-common-behavioral-interview-questions-and-answers',
      type: 'guide'
    },
    {
      title: 'How to Answer "Tell Me About Yourself"',
      url: 'https://www.youtube.com/watch?v=es7XakGv9v8',
      type: 'video'
    }
  ],
  frontend: [
    {
      title: 'React Interview Questions',
      url: 'https://github.com/sudheerj/reactjs-interview-questions',
      type: 'github'
    },
    {
      title: 'JavaScript Interview Prep',
      url: 'https://www.frontendinterviewhandbook.com/',
      type: 'guide'
    },
    {
      title: 'CSS Interview Questions',
      url: 'https://www.edureka.co/blog/interview-questions/css-interview-questions/',
      type: 'article'
    }
  ],
  backend: [
    {
      title: 'Node.js Interview Questions',
      url: 'https://www.simplilearn.com/tutorials/nodejs-tutorial/nodejs-interview-questions',
      type: 'article'
    },
    {
      title: 'Database Design Best Practices',
      url: 'https://www.vertabelo.com/blog/database-design-best-practices/',
      type: 'guide'
    },
    {
      title: 'REST API Design Guide',
      url: 'https://restfulapi.net/',
      type: 'documentation'
    }
  ],
  fullstack: [
    {
      title: 'Full Stack Developer Roadmap',
      url: 'https://roadmap.sh/full-stack',
      type: 'roadmap'
    },
    {
      title: 'System Design Interview Guide',
      url: 'https://github.com/donnemartin/system-design-primer',
      type: 'github'
    },
    {
      title: 'Full Stack Interview Questions',
      url: 'https://www.interviewbit.com/full-stack-developer-interview-questions/',
      type: 'article'
    }
  ],
  dsa: [
    {
      title: 'LeetCode Top Interview Questions',
      url: 'https://leetcode.com/problemset/top-interview-questions/',
      type: 'practice'
    },
    {
      title: 'Data Structures Visualizations',
      url: 'https://visualgo.net/',
      type: 'interactive'
    },
    {
      title: 'Algorithm Complexity Cheat Sheet',
      url: 'https://www.bigocheatsheet.com/',
      type: 'reference'
    }
  ],
  'system-design': [
    {
      title: 'System Design Interview Prep',
      url: 'https://www.educative.io/courses/grokking-the-system-design-interview',
      type: 'course'
    },
    {
      title: 'High Scalability',
      url: 'http://highscalability.com/',
      type: 'blog'
    },
    {
      title: 'System Design Cheatsheet',
      url: 'https://gist.github.com/vasanthk/485d1c25737e8e72759f',
      type: 'github'
    }
  ]
};

export const getResourcesForInterviewType = (type) => {
  const normalizedType = type.toLowerCase().replace(/\s+/g, '-');
  return resourcesByInterviewType[normalizedType] || [];
};