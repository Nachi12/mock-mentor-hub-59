import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Layout from "@/components/layout/Layout";
import { FaLinkedin, FaTwitter, FaGithub, FaRocket, FaBullseye, FaHandshake } from "react-icons/fa";
import { motion } from "framer-motion";

const About = () => {
  const team = [
    {
      name: "Sarah Mitchell",
      role: "Co-Founder & CEO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "David Chen",
      role: "Co-Founder & CTO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      linkedin: "#",
      github: "#",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Michael Park",
      role: "Lead Engineer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      linkedin: "#",
      github: "#",
    },
  ];

  const investors = [
    { name: "Sequoia Capital", logo: "🌲" },
    { name: "Y Combinator", logo: "Y" },
    { name: "Andreessen Horowitz", logo: "a16z" },
    { name: "Google Ventures", logo: "GV" },
  ];

  const faqs = [
    {
      question: "How does MeetConnect work?",
      answer: "MeetConnect connects students with experienced professionals for mock interviews. You can schedule interviews, receive feedback, and access practice resources all in one platform.",
    },
    {
      question: "What types of interviews are available?",
      answer: "We offer various interview types including Behavioral, Frontend, Backend, Full-Stack, and Data Structures & Algorithms interviews.",
    },
    {
      question: "How are interviewers selected?",
      answer: "Our interviewers are carefully vetted professionals with extensive industry experience from top tech companies.",
    },
    {
      question: "Can I reschedule an interview?",
      answer: "Yes, you can reschedule interviews up to 24 hours before the scheduled time through your dashboard.",
    },
    {
      question: "Is there a fee for using MeetConnect?",
      answer: "We offer both free and premium plans. The free plan includes basic features, while premium plans offer additional benefits like unlimited interviews and priority scheduling.",
    },
  ];

  const values = [
    {
      icon: FaRocket,
      title: "Innovation",
      description: "Constantly evolving our platform to provide the best interview preparation experience.",
    },
    {
      icon: FaBullseye,
      title: "Excellence",
      description: "Committed to delivering high-quality mock interviews and comprehensive feedback.",
    },
    {
      icon: FaHandshake,
      title: "Community",
      description: "Building a supportive community where students can learn and grow together.",
    },
  ];

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
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About MeetConnect</h1>
              <p className="text-xl opacity-90">
                Empowering students to ace their interviews through practice and feedback
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  MeetConnect was founded with a simple yet powerful mission: to bridge the gap between academic learning and industry expectations. We believe that every student deserves the opportunity to practice and refine their interview skills with experienced professionals. Our platform provides a safe, supportive environment where students can gain confidence, receive constructive feedback, and ultimately land their dream jobs.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            {values.map((value, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary p-1"
                    />
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{member.role}</p>
                    <div className="flex justify-center gap-3">
                      {member.linkedin && (
                        <a href={member.linkedin} className="text-primary hover:text-primary/80">
                          <FaLinkedin className="h-5 w-5" />
                        </a>
                      )}
                      {member.twitter && (
                        <a href={member.twitter} className="text-primary hover:text-primary/80">
                          <FaTwitter className="h-5 w-5" />
                        </a>
                      )}
                      {member.github && (
                        <a href={member.github} className="text-primary hover:text-primary/80">
                          <FaGithub className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Investors Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Our Investors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {investors.map((investor, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{investor.logo}</div>
                    <p className="font-medium text-sm">{investor.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default About;