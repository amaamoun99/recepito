
import { useState, useEffect } from  "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Switch } from  "@/components/ui/switch";
import { Label } from  "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from  "@/components/ui/card";
import { Separator } from  "@/components/ui/separator";
import { useToast } from  "@/components/ui/use-toast";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  // Initialize dark mode state from localStorage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setIsDarkMode(storedTheme === "dark");
    
    // Apply the stored theme when the component mounts
    const root = window.document.documentElement;
    if (storedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Update localStorage and apply class to html element
    const root = window.document.documentElement;
    if (newDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    toast({
      title: `${newDarkMode ? "Dark" : "Light"} mode activated`,
      description: `The application is now in ${newDarkMode ? "dark" : "light"} mode.`,
    });
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how RecipeShare looks on your device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Username</h3>
              <p className="text-sm text-muted-foreground">
                You can change your username at any time.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Email Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Manage how and when you receive email notifications.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Privacy & Data</h3>
              <p className="text-sm text-muted-foreground">
                Manage your data and privacy settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
