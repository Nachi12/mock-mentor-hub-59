import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addInterview } from "@/store/slices/interviewSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { FaCalendarAlt, FaClock, FaUserTie, FaCode, FaBrain, FaLaptopCode, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";
import InterviewCarousel from "@/components/interviews/InterviewCarousel";
import { getResourcesForInterviewType } from "@/utils/resourceMapping";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const interviews = useSelector((state) => state.interviews.interviews);
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    time: "",
    interviewer: "",
  });

  const interviewTypes = [
    { value: "behavioral", label: "Behavioral Interview", icon: FaBrain },
    { value: "fullstack", label: "Full-Stack Interview", icon: FaLaptopCode },
    { value: "frontend", label: "Frontend Interview", icon: FaCode },
    { value: "backend", label: "Backend Interview", icon: FaCode },
    { value: "dsa", label: "DSA Interview", icon: FaBrain },
  ];

  const interviewers = [
    "Sarah Johnson - Senior Frontend Engineer",
    "Mike Chen - Full Stack Lead",
    "Emily Rodriguez - Backend Architect",
    "David Park - Tech Lead",
    "Jessica Williams - Engineering Manager",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.date || !formData.time || !formData.interviewer) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const resources = getResourcesForInterviewType(formData.type);
    const newInterview = {
      id: Date.now().toString(),
      type: formData.type,
      date: formData.date,
      time: formData.time,
      interviewer: formData.interviewer,
      status: "upcoming",
      resources: resources.map(r => r.url),
    };

    dispatch(addInterview(newInterview));
    
    toast({
      title: "Interview Scheduled!",
      description: `Your ${formData.type} interview has been scheduled for ${formData.date} at ${formData.time}`,
    });

    // Reset form
    setFormData({ type: "", date: "", time: "", interviewer: "" });
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
        {/* Hero Section */}
        <div className="bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to MeetConnect
              </h1>
              <p className="text-xl opacity-90">
                Schedule your mock interviews and prepare for success
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Schedule Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaCalendarAlt className="h-5 w-5 text-primary" />
                      Schedule Interview
                    </CardTitle>
                    <CardDescription>
                      Book a mock interview session with our expert interviewers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="type">Interview Type</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => setFormData({ ...formData, type: value })}
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select interview type" />
                          </SelectTrigger>
                          <SelectContent>
                            {interviewTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="date"
                              type="date"
                              className="pl-10"
                              value={formData.date}
                              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="time">Time</Label>
                          <div className="relative">
                            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="time"
                              type="time"
                              className="pl-10"
                              value={formData.time}
                              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interviewer">Choose Interviewer</Label>
                        <Select
                          value={formData.interviewer}
                          onValueChange={(value) => setFormData({ ...formData, interviewer: value })}
                        >
                          <SelectTrigger id="interviewer">
                            <SelectValue placeholder="Select your interviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            {interviewers.map((interviewer) => (
                              <SelectItem key={interviewer} value={interviewer}>
                                <div className="flex items-center gap-2">
                                  <FaUserTie className="h-4 w-4" />
                                  {interviewer}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-primary hover:opacity-90"
                        size="lg"
                      >
                        <FaRocket className="mr-2 h-4 w-4" />
                        Schedule Interview
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-gradient-card shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Interviews</span>
                      <span className="text-2xl font-bold text-primary">{interviews.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="text-2xl font-bold text-success">
                        {interviews.filter(i => i.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Upcoming</span>
                      <span className="text-2xl font-bold text-warning">
                        {interviews.filter(i => i.status === 'upcoming').length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-gradient-primary text-primary-foreground shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        Practice behavioral questions daily
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        Review your past interview feedback
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        Prepare your tech stack thoroughly
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        Join our practice resources section
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;