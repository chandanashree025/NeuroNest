import { useState, useEffect } from 'react';
import { Sun, Moon, Sunset, type LucideIcon } from 'lucide-react';

export interface GreetingState {
  greeting: string;
  greetingKey: string;
  icon: string;
  IconComponent: LucideIcon;
}

export function getGreeting(date: Date = new Date()): GreetingState {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return {
      greeting: "Good Morning",
      greetingKey: "goodMorning",
      icon: "☀️",
      IconComponent: Sun
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: "Good Afternoon",
      greetingKey: "goodAfternoon",
      icon: "☀️",
      IconComponent: Sun
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: "Good Evening",
      greetingKey: "goodEvening",
      icon: "🌆",
      IconComponent: Sunset
    };
  } else {
    return {
      greeting: "Good Night",
      greetingKey: "goodNight",
      icon: "🌙",
      IconComponent: Moon
    };
  }
}

export function useGreeting(): GreetingState {
  const [greetingState, setGreetingState] = useState<GreetingState>(() => getGreeting());

  useEffect(() => {
    // Recalculate immediately when mounted/loaded
    setGreetingState(getGreeting());

    // Automatically update greeting across time-period boundaries without full page reload
    const interval = setInterval(() => {
      setGreetingState((prevState) => {
        const nextState = getGreeting();
        if (
          prevState.greeting !== nextState.greeting ||
          prevState.icon !== nextState.icon
        ) {
          return nextState;
        }
        return prevState;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return greetingState;
}
