import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { MapPin, Loader2, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AccidentType, SeverityLevel } from '@/types/accident';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const accidentTypes: { value: AccidentType; label: string }[] = [
  { value: 'collision', label: 'Vehicle Collision' },
  { value: 'rollover', label: 'Rollover' },
  { value: 'pedestrian', label: 'Pedestrian Involved' },
  { value: 'cyclist', label: 'Cyclist Involved' },
  { value: 'hit-and-run', label: 'Hit and Run' },
  { value: 'multi-vehicle', label: 'Multi-Vehicle' },
  { value: 'single-vehicle', label: 'Single Vehicle' },
  { value: 'other', label: 'Other' },
];

const severityLevels: { value: SeverityLevel; label: string }[] = [
  { value: 'minor', label: 'Minor - No or minor injuries' },
  { value: 'moderate', label: 'Moderate - Injuries requiring attention' },
  { value: 'severe', label: 'Severe - Serious injuries' },
  { value: 'fatal', label: 'Fatal - One or more fatalities' },
];

const formSchema = z.object({
  type: z.enum(['collision', 'rollover', 'pedestrian', 'cyclist', 'hit-and-run', 'multi-vehicle', 'single-vehicle', 'other']),
  severity: z.enum(['minor', 'moderate', 'severe', 'fatal']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  dateTime: z.string().min(1, 'Date and time is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  reporterName: z.string().max(100).optional(),
  reporterContact: z.string().max(100).optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AccidentReportForm() {
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'collision',
      severity: 'minor',
      description: '',
      dateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      latitude: 0,
      longitude: 0,
      address: '',
      reporterName: '',
      reporterContact: '',
    },
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue('latitude', position.coords.latitude);
        form.setValue('longitude', position.coords.longitude);
        setIsLocating(false);
        toast({
          title: 'Location captured',
          description: `Coordinates: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
        });
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    toast({
      title: 'Report submitted successfully',
      description: 'Your accident report has been submitted and will be reviewed shortly.',
    });
    form.reset();
  };

  const latitude = form.watch('latitude');
  const longitude = form.watch('longitude');
  const hasLocation = latitude !== 0 && longitude !== 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-accent" />
          Report an Accident
        </CardTitle>
        <CardDescription>
          Submit details about a road accident. All information helps improve road safety.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Location Section */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Location</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getLocation}
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-2" />
                  )}
                  {isLocating ? 'Getting location...' : 'Get Current Location'}
                </Button>
              </div>

              {locationError && (
                <Alert variant="destructive">
                  <AlertDescription>{locationError}</AlertDescription>
                </Alert>
              )}

              {hasLocation && (
                <div className="text-sm text-muted-foreground">
                  <p>Latitude: {latitude.toFixed(6)}</p>
                  <p>Longitude: {longitude.toFixed(6)}</p>
                </div>
              )}

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address / Landmark (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Near Central Park, 5th Avenue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Accident Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accident Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select accident type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accidentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {severityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date and Time of Accident</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what happened, including vehicles involved, road conditions, weather, etc."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reporter Info (Optional) */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
              <Label className="text-sm font-medium">Reporter Information (Optional)</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="reporterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reporterContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact (Phone/Email)</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!hasLocation}>
              <Send className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
