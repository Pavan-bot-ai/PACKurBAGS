
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Languages, 
  Mic, 
  Camera, 
  Volume2,
  Copy,
  RotateCcw
} from "lucide-react";

interface AITranslatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const AITranslator = ({ isOpen, onClose }: AITranslatorProps) => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    // Simulate translation API call
    setTimeout(() => {
      setTranslatedText(`Translated: ${inputText}`);
      setIsTranslating(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setInputText("Voice input: Hello, how are you?");
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleCameraInput = () => {
    // Simulate camera text detection
    setInputText("Camera detected: Welcome to Paris");
    handleTranslate();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    alert("Translation copied to clipboard!");
  };

  const handlePlayAudio = () => {
    // Simulate text-to-speech
    alert("Playing audio translation...");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
              <Languages className="w-4 h-4 text-white" />
            </div>
            <span>AI Translator</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleCameraInput}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Camera className="w-4 h-4 mr-2" />
              Camera Lens
            </Button>
            
            <Button
              onClick={handleVoiceInput}
              className={`flex-1 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'}`}
            >
              <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
              {isRecording ? 'Recording...' : 'Voice Input'}
            </Button>
          </div>

          {/* Language Selection */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <Badge variant="outline" className="w-full justify-center">
                Auto-detect
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => {}}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <Badge variant="outline" className="w-full justify-center">
                English
              </Badge>
            </div>
          </div>

          {/* Input Section */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Enter text to translate</span>
                  {inputText && (
                    <Button variant="ghost" size="sm" onClick={() => setInputText('')}>
                      Clear
                    </Button>
                  )}
                </div>
                
                <Input
                  placeholder="Type here or use voice/camera input..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[60px]"
                />
                
                <Button 
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || isTranslating}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                >
                  {isTranslating ? 'Translating...' : 'Translate'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Translation Result */}
          {translatedText && (
            <Card className="bg-gradient-to-r from-green-50 to-teal-50">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Translation</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={handlePlayAudio}>
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCopy}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-lg">{translatedText}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Phrases */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Quick Phrases</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Hello",
                  "Thank you",
                  "Where is...?",
                  "How much?",
                  "I need help",
                  "Excuse me"
                ].map((phrase) => (
                  <Button
                    key={phrase}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputText(phrase);
                      setTimeout(handleTranslate, 100);
                    }}
                  >
                    {phrase}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AITranslator;
