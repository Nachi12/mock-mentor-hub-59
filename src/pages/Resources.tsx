import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setQuestions, setBlogs, setCategory, setPage } from "@/store/slices/resourceSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Layout from "@/components/layout/Layout";
import { FaCode, FaBrain, FaLaptopCode, FaBookOpen, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Resources = () => {
  const dispatch = useDispatch();
  const { questions, blogs, selectedCategory, currentPage } = useSelector(
    (state: RootState) => state.resources
  );
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const questionsPerPage = 10;

  // Mock data - in production, this would come from an API
  useEffect(() => {
    const mockQuestions = {
      frontend: [
        { id: "1", question: "What is the Virtual DOM in React?", category: "frontend" as const, difficulty: "medium" as const, answer: "The Virtual DOM is a JavaScript representation of the actual DOM..." },
        { id: "2", question: "Explain React Hooks", category: "frontend" as const, difficulty: "medium" as const, answer: "Hooks are functions that let you use state and other React features..." },
        { id: "3", question: "What is CSS Box Model?", category: "frontend" as const, difficulty: "easy" as const, answer: "The CSS box model is a container that contains multiple properties..." },
        { id: "4", question: "Difference between var, let, and const?", category: "frontend" as const, difficulty: "easy" as const, answer: "var has function scope, let and const have block scope..." },
        { id: "5", question: "What is closure in JavaScript?", category: "frontend" as const, difficulty: "hard" as const, answer: "A closure is the combination of a function and the lexical environment..." },
        { id: "6", question: "Explain event delegation", category: "frontend" as const, difficulty: "medium" as const, answer: "Event delegation is a technique of delegating events to a parent element..." },
        { id: "7", question: "What is Redux?", category: "frontend" as const, difficulty: "medium" as const, answer: "Redux is a predictable state container for JavaScript apps..." },
        { id: "8", question: "Explain CSS Flexbox", category: "frontend" as const, difficulty: "easy" as const, answer: "Flexbox is a layout model that allows elements to align and distribute space..." },
        { id: "9", question: "What are Web Components?", category: "frontend" as const, difficulty: "hard" as const, answer: "Web Components are a set of web platform APIs that allow you to create custom elements..." },
        { id: "10", question: "Difference between == and ===?", category: "frontend" as const, difficulty: "easy" as const, answer: "== performs type coercion, === checks both value and type..." },
        { id: "11", question: "What is webpack?", category: "frontend" as const, difficulty: "medium" as const, answer: "Webpack is a module bundler for JavaScript applications..." },
        { id: "12", question: "Explain async/await", category: "frontend" as const, difficulty: "medium" as const, answer: "Async/await is syntactic sugar for promises, making asynchronous code look synchronous..." },
      ],
      backend: [
        { id: "13", question: "What is REST API?", category: "backend" as const, difficulty: "easy" as const, answer: "REST is an architectural style for designing networked applications..." },
        { id: "14", question: "Explain database indexing", category: "backend" as const, difficulty: "medium" as const, answer: "Database indexing is a data structure technique to quickly locate data..." },
        { id: "15", question: "What is middleware?", category: "backend" as const, difficulty: "medium" as const, answer: "Middleware is software that acts as a bridge between an operating system..." },
      ],
      fullstack: [
        { id: "16", question: "Explain microservices architecture", category: "fullstack" as const, difficulty: "hard" as const, answer: "Microservices is an architectural style that structures an application..." },
        { id: "17", question: "What is CI/CD?", category: "fullstack" as const, difficulty: "medium" as const, answer: "CI/CD stands for Continuous Integration and Continuous Deployment..." },
      ],
      behavioral: [
        { id: "18", question: "Tell me about yourself", category: "behavioral" as const, difficulty: "easy" as const, answer: "Start with your current role, highlight key achievements..." },
        { id: "19", question: "Why do you want to work here?", category: "behavioral" as const, difficulty: "easy" as const, answer: "Research the company, align your values with theirs..." },
        { id: "20", question: "Describe a challenging project", category: "behavioral" as const, difficulty: "medium" as const, answer: "Use the STAR method: Situation, Task, Action, Result..." },
      ],
    };

    const mockBlogs = [
      { id: "1", title: "Mastering React Interviews", excerpt: "Top React questions and how to answer them", url: "#", category: "Technical", date: "2024-12-15" },
      { id: "2", title: "System Design Interview Guide", excerpt: "Everything you need to know about system design", url: "#", category: "Technical", date: "2024-12-14" },
      { id: "3", title: "Behavioral Interview Success", excerpt: "STAR method and example answers", url: "#", category: "Behavioral", date: "2024-12-13" },
      { id: "4", title: "Data Structures Deep Dive", excerpt: "Essential DS&A concepts for interviews", url: "#", category: "Technical", date: "2024-12-12" },
    ];

    dispatch(setQuestions(mockQuestions[selectedCategory] || []));
    dispatch(setBlogs(mockBlogs));
  }, [selectedCategory, dispatch]);

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-success text-success-foreground",
      medium: "bg-warning text-warning-foreground",
      hard: "bg-destructive text-destructive-foreground",
    };
    return colors[difficulty as keyof typeof colors] || "bg-secondary";
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      frontend: FaCode,
      backend: FaCode,
      fullstack: FaLaptopCode,
      behavioral: FaBrain,
    };
    return icons[category as keyof typeof icons] || FaBookOpen;
  };

  const paginatedQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
        {/* Header */}
        <div className="bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-2">Practice Resources</h1>
              <p className="text-lg opacity-90">Interview questions and preparation materials</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Questions Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg mb-6">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle>Interview Questions</CardTitle>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value: any) => dispatch(setCategory(value))}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend Development</SelectItem>
                        <SelectItem value="backend">Backend Development</SelectItem>
                        <SelectItem value="fullstack">Full Stack Development</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paginatedQuestions.map((question, index) => {
                      const Icon = getCategoryIcon(question.category);
                      return (
                        <motion.div
                          key={question.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Icon className="h-4 w-4 text-primary" />
                                    <Badge className={getDifficultyColor(question.difficulty)}>
                                      {question.difficulty}
                                    </Badge>
                                  </div>
                                  <button
                                    onClick={() => toggleQuestion(question.id)}
                                    className="text-left w-full"
                                  >
                                    <p className="font-medium hover:text-primary transition-colors">
                                      {question.question}
                                    </p>
                                  </button>
                                  {expandedQuestions.has(question.id) && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="mt-4 p-4 bg-secondary/30 rounded-lg"
                                    >
                                      <p className="text-sm text-muted-foreground">
                                        {question.answer}
                                      </p>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <Pagination className="mt-6">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              currentPage > 1 && dispatch(setPage(currentPage - 1))
                            }
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => dispatch(setPage(i + 1))}
                              isActive={currentPage === i + 1}
                              className="cursor-pointer"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              currentPage < totalPages && dispatch(setPage(currentPage + 1))
                            }
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Blogs Section */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Preparation Blogs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blogs.map((blog, index) => (
                      <motion.div
                        key={blog.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <Badge variant="outline" className="mb-2">
                              {blog.category}
                            </Badge>
                            <h3 className="font-semibold mb-1">{blog.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {blog.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {new Date(blog.date).toLocaleDateString()}
                              </span>
                              <a
                                href={blog.url}
                                className="text-primary hover:underline text-sm flex items-center gap-1"
                              >
                                Read more
                                <FaExternalLinkAlt className="h-3 w-3" />
                              </a>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;