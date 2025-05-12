
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileForm from '@/components/ProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Your Profile</CardTitle>
              <CardDescription>
                Tell us about yourself to get personalized calorie recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
