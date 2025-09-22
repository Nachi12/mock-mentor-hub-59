import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { FaRocket, FaUserGraduate, FaBriefcase, FaChartLine, FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaUserGraduate,
      title: "Expert Interviewers",
      description: "Practice with professionals from top tech companies",
    },
    {
      icon: FaBriefcase,
      title: "Real Interview Experience",
      description: "Simulate actual interview conditions and scenarios",
    },
    {
      icon: FaChartLine,
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics",
    },
  ];

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Software Engineer at Google",
      content: "MeetConnect helped me prepare for my dream job. The mock interviews were incredibly realistic!",
    },
    {
      name: "Priya Patel",
      role: "Frontend Developer at Meta",
      content: "The feedback I received was invaluable. I improved my interview skills significantly.",
    },
    {
      name: "Marcus Johnson",
      role: "Full Stack Developer at Amazon",
      content: "Best platform for interview preparation. The resources section is comprehensive and helpful.",
    },
  ];

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)]">
        {/* Hero Section */}
        <section className="bg-gradient-hero text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Ace Your Next Interview
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Practice with industry experts and land your dream job
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate("/signup")}
                >
                  <FaRocket className="mr-2 h-5 w-5" />
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose MeetConnect?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform provides everything you need to succeed in your technical interviews
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                        <feature.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Success Stories
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of successful candidates who landed their dream jobs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="h-full bg-card/50 backdrop-blur">
                    <CardContent className="p-6">
                      <FaQuoteLeft className="h-8 w-8 text-primary/30 mb-4" />
                      <p className="text-muted-foreground mb-6 italic">
                        "{testimonial.content}"
                      </p>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join MeetConnect today and take the first step towards your dream career
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate("/signup")}
              >
                <FaRocket className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
