
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Award,
  Building,
  FileText,
  CheckCircle
} from "lucide-react";

interface AILocalGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const AILocalGuide = ({ isOpen, onClose }: AILocalGuideProps) => {
  const [step, setStep] = useState<'personal' | 'contact' | 'professional' | 'complete'>('personal');
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    age: '',
    nationality: '',
    languages: '',
    
    // Contact Information
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    
    // Professional Information
    occupation: '',
    company: '',
    certifications: '',
    experience: '',
    specializations: ''
  });

  const handleNext = () => {
    if (step === 'personal') setStep('contact');
    else if (step === 'contact') setStep('professional');
    else if (step === 'professional') setStep('complete');
  };

  const handleSubmit = () => {
    console.log('Local Guide Profile:', formData);
    alert('Profile created successfully! You can now provide local guidance services.');
    onClose();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span>AI Local Guide Registration</span>
          </DialogTitle>
        </DialogHeader>

        {step === 'personal' && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                <p className="text-gray-600">Tell us about yourself to become a local guide</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    placeholder="Your nationality"
                    value={formData.nationality}
                    onChange={(e) => updateFormData('nationality', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Languages Spoken</Label>
                <Input
                  id="languages"
                  placeholder="e.g., English, Spanish, French..."
                  value={formData.languages}
                  onChange={(e) => updateFormData('languages', e.target.value)}
                />
              </div>

              <Button onClick={handleNext} className="w-full">
                Next: Contact Information
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'contact' && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                <p className="text-gray-600">How can travelers reach you?</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Location/Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      placeholder="City, Country"
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Emergency contact details"
                    value={formData.emergencyContact}
                    onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setStep('personal')} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Next: Professional Info
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'professional' && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Professional Information</h3>
                <p className="text-gray-600">Your qualifications and expertise</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="occupation"
                      placeholder="Your current job title"
                      className="pl-10"
                      value={formData.occupation}
                      onChange={(e) => updateFormData('occupation', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="company"
                      placeholder="Where you work"
                      className="pl-10"
                      value={formData.company}
                      onChange={(e) => updateFormData('company', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="certifications"
                      placeholder="Tourism, First Aid, Language certifications..."
                      className="pl-10"
                      value={formData.certifications}
                      onChange={(e) => updateFormData('certifications', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    placeholder="Years in tourism/hospitality"
                    value={formData.experience}
                    onChange={(e) => updateFormData('experience', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specializations">Specializations</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="specializations"
                      placeholder="Adventure tours, cultural experiences, food tours..."
                      className="pl-10"
                      value={formData.specializations}
                      onChange={(e) => updateFormData('specializations', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setStep('contact')} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Review & Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'complete' && (
          <Card>
            <CardContent className="p-6 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Review Your Information</h3>
                <p className="text-gray-600">Please confirm your details before submitting</p>
              </div>

              <div className="text-left space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <strong>Name:</strong> {formData.firstName} {formData.lastName}
                </div>
                <div>
                  <strong>Contact:</strong> {formData.email} | {formData.phone}
                </div>
                <div>
                  <strong>Location:</strong> {formData.address}
                </div>
                <div>
                  <strong>Occupation:</strong> {formData.occupation} at {formData.company}
                </div>
                <div>
                  <strong>Certifications:</strong> {formData.certifications}
                </div>
                <div>
                  <strong>Specializations:</strong> {formData.specializations}
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setStep('professional')} className="flex-1">
                  Edit Details
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-green-500 to-teal-500">
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AILocalGuide;
