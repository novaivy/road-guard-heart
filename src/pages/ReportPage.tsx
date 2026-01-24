import { Layout } from '@/components/layout/Layout';
import { AccidentReportForm } from '@/components/forms/AccidentReportForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock, MapPin, FileText } from 'lucide-react';

const ReportPage = () => {
  const steps = [
    {
      icon: MapPin,
      title: 'Location',
      description: 'Your location is captured automatically for accurate reporting.',
    },
    {
      icon: FileText,
      title: 'Details',
      description: 'Provide accident type, severity, and a description of what happened.',
    },
    {
      icon: Clock,
      title: 'Review',
      description: 'Our team reviews reports to verify and categorize them.',
    },
    {
      icon: Shield,
      title: 'Action',
      description: 'Data helps authorities improve road safety measures.',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Report an Accident</h1>
          <p className="text-muted-foreground">
            Help improve road safety by reporting accidents. Your reports are anonymous and contribute to data-driven safety improvements.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <AccidentReportForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How it works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
                <CardDescription>Your report goes through these steps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {index + 1}. {step.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Privacy Note */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy & Safety
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Your personal information is optional and kept confidential. 
                  Reports are used solely for improving road safety.
                </p>
                <p>
                  If you're at an active accident scene, please contact emergency 
                  services (911) first before submitting a report.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportPage;
