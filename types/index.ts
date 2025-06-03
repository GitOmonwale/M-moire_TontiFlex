
export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
    size?: number;
  }>;
}