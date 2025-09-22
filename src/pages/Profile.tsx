import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { updateProfile } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaSave } from "react-icons/fa";
import { motion } from "framer-motion";

const Profile = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    contact: user?.contact || "",
    dob: user?.dob || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(updateProfile({
      name: formData.name,
      contact: formData.contact,
      dob: formData.dob,
    }));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      contact: user?.contact || "",
      dob: user?.dob || "",
    });
    setIsEditing(false);
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
              <h1 className="text-4xl font-bold mb-2">My Profile</h1>
              <p className="text-lg opacity-90">Manage your account information</p>
            </motion.div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details and contact information
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="name"
                          type="text"
                          className="pl-10"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10 bg-muted cursor-not-allowed"
                          value={formData.email}
                          disabled
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email address cannot be changed
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number</Label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="contact"
                          type="tel"
                          className="pl-10"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <div className="relative">
                        <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="dob"
                          type="date"
                          className="pl-10"
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-primary hover:opacity-90"
                        >
                          <FaSave className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Statistics Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6"
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Interview Statistics</CardTitle>
                  <CardDescription>Your interview performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-secondary/30 rounded-lg">
                      <p className="text-2xl font-bold text-primary">12</p>
                      <p className="text-sm text-muted-foreground">Total Interviews</p>
                    </div>
                    <div className="text-center p-4 bg-secondary/30 rounded-lg">
                      <p className="text-2xl font-bold text-success">8</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    <div className="text-center p-4 bg-secondary/30 rounded-lg">
                      <p className="text-2xl font-bold text-warning">4</p>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                    </div>
                    <div className="text-center p-4 bg-secondary/30 rounded-lg">
                      <p className="text-2xl font-bold text-primary">85%</p>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;