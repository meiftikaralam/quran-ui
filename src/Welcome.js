import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-primary">Welcome to Alam-Educity</h1>
        
        <div className="space-y-4 text-lg text-foreground/80">
          <p>
            We are excited to introduce alameducity.com, an educational platform dedicated to enriching your learning experience.
          </p>
          <p>
            Our journey begins with a focus on Quran studies, providing comprehensive resources and guidance for your spiritual growth.
          </p>
          <p>
            In the future, we aim to expand our offerings to include a wide range of educational content, including skills development
            and other learning opportunities.
          </p>
        </div>

        <p className="text-xl text-foreground font-medium mt-8">
          Thank you for joining us on this journey of knowledge and growth.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate('/quran')}
          >
            Start Reading Quran
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/home')}
          >
            Explore More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
