import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setInterviews, setFilter } from "@/store/slices/interviewSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { FaCalendarAlt, FaClock, FaUserTie, FaCheckCircle, FaClock as FaClockIcon, FaStar, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const MyInterviews = () => {
  const dispatch = useDispatch();
  const { interviews, filter } = useSelector((state) => state.interviews);
  const [sortBy, setSortBy] = useState("date");

  // Mock data - in production, this would come from an API
  useEffect(() => {
    const mockInterviews = [
      {
        id: "1",
        type: "frontend",
        date: "2024-12-20",
        time: "10:00",
        interviewer: "Sarah Johnson - Senior Frontend Engineer",
        status: "completed",
        feedback: "Great understanding of React concepts. Need to work on optimization techniques.",
        score: 85,
        result: "passed",
      },
      {
        id: "2",
        type: "behavioral",
        date: "2024-12-22",
        time: "14:00",
        interviewer: "Jessica Williams - Engineering Manager",
        status: "completed",
        feedback: "Excellent communication skills. Good examples of leadership.",
        score: 90,
        result: "passed",
      },
      {
        id: "3",
        type: "fullstack",
        date: "2024-12-25",
        time: "11:00",
        interviewer: "Mike Chen - Full Stack Lead",
        status: "upcoming",
        resources: [
          "https://example.com/fullstack-guide",
          "https://example.com/system-design",
        ],
      },
      {
        id: "4",
        type: "dsa",
        date: "2024-12-28",
        time: "15:00",
        interviewer: "David Park - Tech Lead",
        status: "upcoming",
        resources: [
          "https://example.com/dsa-patterns",
          "https://example.com/algorithm-prep",
        ],
      },
    ];
    dispatch(setInterviews(mockInterviews));
  }, [dispatch]);

  const filteredInterviews = interviews.filter(interview => {
    if (filter === "upcoming") return interview.status === "upcoming";
    if (filter === "completed") return interview.status === "completed";
    return true;
  });

  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === "type") {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });

  const getTypeColor = (type) => {
    const colors = {
      behavioral: "bg-purple-500",
      fullstack: "bg-blue-500",
      frontend: "bg-green-500",
      backend: "bg-orange-500",
      dsa: "bg-red-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const getResultBadge = (result) => {
    if (!result) return null;
    const variants = {
      passed: { className: "bg-success text-success-foreground", label: "Passed" },
      failed: { className: "bg-destructive text-destructive-foreground", label: "Failed" },
      pending: { className: "bg-warning text-warning-foreground", label: "Pending" },
    };
    const variant = variants[result];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

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
              <h1 className="text-4xl font-bold mb-2">My Interviews</h1>
              <p className="text-lg opacity-90">Track your interview progress and feedback</p>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={filter} onValueChange={(value) => dispatch(setFilter(value))}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter interviews" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Interviews</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="type">Interview Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interview Cards */}
          <div className="grid gap-6">
            {sortedInterviews.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">No interviews found</p>
                </CardContent>
              </Card>
            ) : (
              sortedInterviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-12 rounded-full ${getTypeColor(interview.type)}`} />
                          <div>
                            <CardTitle className="text-xl capitalize">
                              {interview.type.replace("_", " ")} Interview
                            </CardTitle>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt className="h-3 w-3" />
                                {new Date(interview.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaClock className="h-3 w-3" />
                                {interview.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaUserTie className="h-3 w-3" />
                                {interview.interviewer.split(" - ")[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {interview.status === "upcoming" ? (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <FaClockIcon className="h-3 w-3" />
                              Upcoming
                            </Badge>
                          ) : (
                            <>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <FaCheckCircle className="h-3 w-3" />
                                Completed
                              </Badge>
                              {getResultBadge(interview.result)}
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {interview.status === "completed" ? (
                        <div className="space-y-4">
                          {interview.score && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Score:</span>
                              <div className="flex items-center gap-1">
                                <FaStar className="h-4 w-4 text-warning" />
                                <span className="font-bold">{interview.score}/100</span>
                              </div>
                            </div>
                          )}
                          {interview.feedback && (
                            <div className="bg-secondary/50 rounded-lg p-4">
                              <p className="text-sm font-medium mb-2">Feedback:</p>
                              <p className="text-sm text-muted-foreground">{interview.feedback}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-secondary/50 rounded-lg p-4">
                            <p className="text-sm font-medium mb-2">Preparation Resources:</p>
                            <div className="space-y-2">
                              {interview.resources?.map((resource, idx) => (
                                <a
                                  key={idx}
                                  href={resource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <FaExternalLinkAlt className="h-3 w-3" />
                                  Resource {idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyInterviews;